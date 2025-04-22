import rootAxiosInstance from "../axiosinstance";

export type ActivityProps = {
  _id?: string,
  type?:  "Withdraw" | "Received",
  isPending?: boolean,
  isVemreCharge?: boolean,
  title?: string;
  description?: string;
  transactionReference?: string;
  senderName?: string;
  amount?: number;
  category?: string;
  servicelink?: string
  updatedAt?: Date,
  header?: string,
  user?: {
    fullname: string
  }
  
}




const alltransactions = "/api/user/transactions";
const sendmoney = "/api/user/sendmoney";


class UserServices {


    /**
     * To get all transactions
     * @returns
     */
    
    async alltransactions(): Promise<{data: ActivityProps[]}> {
        const response = await rootAxiosInstance.get(alltransactions);
        return response.data
    }

       /**
     * create 
     * @returns
     */
       async createuserwithdrawl(data: {txnId: string}) {
        return await rootAxiosInstance.post(sendmoney, data)
    }


}

export default UserServices;
