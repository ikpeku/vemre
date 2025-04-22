"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { autoTable } from 'jspdf-autotable'
import UserQueries from "@/requestapi/queries/userQueries"
import Loader from "@/components/Loader"
import { ActivityProps } from "@/requestapi/instances/userRequest"
import { formatInky } from "@/lib/utils"
import dayjs from "@/lib/dayjs"
import { getError } from "@/lib/requestError"
import OverlayLoader from "@/components/OverLayLoader"

// Define transaction type
type Transaction = {
  id?: string
  description?: string
  date?: string
  // date?: Date
  amount?: number
  amountClass?: string
  status: string
  details?: {
    reference?: string
    category?: string
    paymentMethod?: string
    time?: string
    // time?: Date
    note?: string
  }
} & ActivityProps; 

const {useAlTransactions, setCreateuserWithdrawal} = new UserQueries();

export default function Dashboard() {
  const router = useRouter();

  const {data} = useAlTransactions();
  const {mutateAsync, isPending} = setCreateuserWithdrawal();

  // Define status badges inline instead of using the Badge component
  const getStatusBadge = (status: string) => {
    const styles = {
      Completed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    )
  }

  // State for transaction details dialog
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  // Function to open transaction details
  const openTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsDetailsOpen(true)
  }

  // Function to download transactions as PDF
  const downloadTransactionsPDF = () => {
    // We'll use dynamic import to load jsPDF only in the browser
    import("jspdf")
      .then(({ default: jsPDF }) => {

        import("jspdf-autotable").then(() => {

          const doc = new jsPDF()

          // Add title
          doc.setFontSize(18)
          doc.text("Recent Transactions", 14, 22)
          doc.setFontSize(11)
          doc.text(`Generated on: ${new Date().toString()}`, 14, 30);
         
      
          // Define the columns
          const columns = [
            { header: "Description", dataKey: "description" },
            { header: "Date", dataKey: "date" },
            { header: "Amount", dataKey: "amount" },
            { header: "Status", dataKey: "status" },
            { header: "Reference", dataKey: "reference" },
          ]
      
          // Prepare the data
          const data =  transactions.map((transaction) => ({
            description: transaction.description!,
            date: transaction.date,
            amount: transaction.amount!,
            status: transaction.status!,
            reference: transaction.details?.reference || "",
          })) || [];
      
          // Create the table
          
          autoTable(doc, {
            head: [columns.map((column) => column.header)],
            body: data.map((item) => columns.map((column) => item[column.dataKey as keyof typeof item])),
            startY: 40,
            theme: "grid",
            styles: {
              fontSize: 10,
              cellPadding: 3,
            },
            headStyles: {
              fillColor: [66, 66, 66],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          })
      
          // Save the PDF
          doc.save("recent-transactions.pdf")
        })
      })
      .catch((error) => {
        console.error("Error generating PDF:", error)
        alert("Failed to generate PDF. Please try again.")
      })

   


  }


  const handleLogout = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    localStorage.removeItem("accessToken")
    router.push("/login")
  }


  const transactions = data?.data.filter(item => item.isVemreCharge == false)
  .map(item => ({
    id: item._id,
    description: item.description,
    date: dayjs(item.updatedAt).format("MMM D, YYYY"),
    amount: item.amount,
    amountClass:  item.type == "Received" ? "text-green-600" : "text-red-600",
    status: item.isPending ? "Pending" : "Completed",
    type: item.type,
    details: {
      reference: item._id,
      category: item.type,
      paymentMethod: item.type == "Received" ? "stripe" : "paystack",
      time: dayjs(item.updatedAt).format("hh:mm A"),
      note: item.description
    }
  })) || [];


  const transacts = data?.data.reduce((accumulator, item) => {
      

      if (item.type == "Received" && !item.isVemreCharge && !item.isPending) {
        accumulator.Received += item.amount!;
      } 
      if (item.type == "Received"  && item.isPending) {
        accumulator.PendingReceive += item.amount!;
      } 

      if (item.type == "Withdraw" && !item.isVemreCharge && !item.isPending) {
        accumulator.Withdraw += item.amount!;
      }
      if (item.type == "Withdraw"   && item.isPending ) {
        accumulator.PendingWithdraw += item.amount!;
      }

      if (item.isVemreCharge) {
        accumulator.revenue += item.amount!;
      }

      accumulator.alltransaction += item.amount!;


      return accumulator;
    }, { alltransaction: 0, Withdraw: 0, Received: 0, revenue: 0 , PendingWithdraw: 0, PendingReceive: 0})  || { alltransaction: 0, Withdraw: 0, Received: 0, revenue: 0 , PendingWithdraw: 0, PendingReceive: 0};


  
  const pendingtransactions = data?.data.filter(item => item.isPending == true && item.isVemreCharge == false)
.map(item => ({
    id: item._id,
    description: item.description,
    date: dayjs(item.updatedAt).format("MMM D, YYYY"),
    // date: item.updatedAt,
    amount: item.amount,
    amountClass:  item.type == "Received" ? "text-green-600" : "text-red-600",
    status: item.isPending ? "Pending" : "Completed",
    type: item.type,
    details: {
      reference: item._id,
      category: item.type,
      paymentMethod: item.type == "Received" ? "stripe" : "paystack",
      time: dayjs(item.updatedAt).format("hh:mm A"),
      // time: item.updatedAt,
      note: item.description
    }
  })) || [];



  const handlePay = async() => {

    try {

    if (!window.confirm("Do you want to continue with the payment?")) return

      await mutateAsync({txnId: selectedTransaction?.id!})
      setIsDetailsOpen(false)
      
    } catch (error) {
      const Error = getError(error);
      window.alert(Error)
      
    }
  }
  



  return (
    <div className="container mx-auto py-10">

      {(!data?.data || isPending)  && <OverlayLoader />}


      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Welcome</h2>
          <p className="text-gray-600">You have successfully logged in to your account.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Activity</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">All Transactions</span>
              <span className="font-medium">{formatInky(transacts.alltransaction?.toString()!)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Withdraw</span>
              <span className="font-medium text-yellow-600">{formatInky(transacts.PendingWithdraw?.toString()!)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending Credit</span>
              <span className="font-medium text-yellow-600">{formatInky(transacts.PendingReceive?.toString()!)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Withdrawn</span>
              <span className="font-medium text-red-600">{formatInky(transacts.Withdraw?.toString()!)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Received</span>
              <span className="font-medium text-green-600">{formatInky(transacts.Received?.toString()!)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Revenue</span>
              <span className="font-medium text-green-600">{formatInky(transacts.revenue?.toString()!)}</span>
            </div>

          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button onClick={handleLogout} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">
              Logout
            </button>
            {/* <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded">Settings</button> */}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTransactionsPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Link href="/transactions" className="text-sm font-medium text-primary hover:underline flex items-center">
                See All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-5 font-medium text-sm text-gray-500">
                <div>Transaction</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div></div>
              </div>
              <div className="divide-y">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="grid grid-cols-5 py-3 gap-5 items-center">
                    <div className="font-medium truncate">{transaction.description}</div>
                    <div className="text-gray-500 text-sm">{transaction.date}</div>
                    
                    <div className={transaction.amountClass}>{formatInky(transaction.amount?.toString()!)}</div>
                    <div>{getStatusBadge(transaction.status)}</div>
                    <div className="text-right">
                      <button
                        className="text-sm text-primary hover:underline"
                        onClick={() => openTransactionDetails(transaction)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* pending transaction */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Transactions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={downloadTransactionsPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Link href="/transactions?type=pending" className="text-sm font-medium text-primary hover:underline flex items-center">
                See All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-5 font-medium text-sm text-gray-500">
                <div>Transaction</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
                <div></div>
              </div>
              <div className="divide-y">
                {pendingtransactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="grid grid-cols-5 py-3 gap-5 items-center">
                    <div className="font-medium truncate">{transaction.description}</div>
                    <div className="text-gray-500 text-sm">{transaction.date}</div>
                    
                    <div className={transaction.amountClass}>{formatInky(transaction.amount?.toString()!)}</div>
                    <div>{getStatusBadge(transaction.status)}</div>
                    <div className="text-right">
                      <button
                        className="text-sm text-primary hover:underline"
                        onClick={() => openTransactionDetails(transaction)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>Complete information about this transaction</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{selectedTransaction.description}</h3>
                 <span className={`font-bold ${selectedTransaction.amountClass}`}>{formatInky(selectedTransaction.amount?.toString()!)}</span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-gray-500">Status:</div>
                <div>{getStatusBadge(selectedTransaction.status)}</div>

                <div className="text-gray-500">Date:</div>
                <div >{selectedTransaction.date}</div>

                <div className="text-gray-500">Time:</div>
                <div >{selectedTransaction.details?.time}</div>

                <div className="text-gray-500">Reference:</div>
                <div>{selectedTransaction.details?.reference}</div>

                <div className="text-gray-500">Category:</div>
                <div>{selectedTransaction.details?.category}</div>

                <div className="text-gray-500">Payment Method:</div>
                <div>{selectedTransaction.details?.paymentMethod}</div>

                {selectedTransaction.details?.note && (
                  <>
                    <div className="text-gray-500">Note:</div>
                    <div>{selectedTransaction.details.note}</div>
                  </>
                )}
              </div>
            </div>
          )}

          {selectedTransaction?.type == "Withdraw" &&  <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={handlePay}>
              pay
            </Button>
          </DialogFooter>}

        </DialogContent>
      </Dialog>
    </div>
  )
}
