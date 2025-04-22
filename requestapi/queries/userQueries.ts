import { useMutation, useQuery } from "@tanstack/react-query"
import UserServices from "../instances/userRequest";
// import { Tcreate_transactionSchema } from "constants/transaction.type";


const {  alltransactions, createuserwithdrawl} = new UserServices()

class UserQueries {

    // staleTime: 1000, gcTime: 1000,
  
    useAlTransactions = () => {
        return useQuery({queryKey:["alltransactions"], queryFn: alltransactions });
    };

    setCreateuserWithdrawal = () => useMutation({
      mutationFn: (data: {txnId: string}) => {
        console.log({data})
        return createuserwithdrawl(data)
      },
    });


}

export default UserQueries;