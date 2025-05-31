import {
  DollarSign,
  CreditCard,
  Users,
  Plus
} from "lucide-react";
import StatsCard from "../components/common/StatsCard";
import GroupCard from "../components/group/GroupCard";
import { useEffect, useState } from "react";
import { getDashboardInfo } from "../apis/dashboard";
import { Transaction } from "../types/group";
import TransactionCard from "../components/group/TransactionCard";
import useUserStore from "../store/useUserStore";
import { useNavigate } from "react-router-dom";



const HomePage = () => {
  const [groups,setGroups] = useState([])
  const [transactions,setTransactions] = useState([])
  const [oweTransaction,setOweTransaction] = useState(0.0)
  const [owedTransaction,setOwedTransaction] = useState(0.0)
  
  const {user} = useUserStore()

  const navigate = useNavigate();

  const skip = 0
  const limit = 5

  const getDashboard = async() =>{
    const result =  await getDashboardInfo(skip,limit);
    setGroups(result.groups)
    setTransactions(result.transactions)
    

    setOwedTransaction(result?.owed_transactions.filter((transaction: Transaction) => transaction.paid_by === user?.id).reduce((acc: number, transaction: Transaction) => acc + (transaction.amount - transaction.amount / transaction.split_between.length), 0));
      setOweTransaction(result?.owe_transactions.filter((transaction: Transaction) => transaction.paid_by !== user?.id).reduce((acc: number, transaction: Transaction) => acc + (transaction.amount / transaction.split_between.length), 0));
    
  }

  useEffect(()=>{
    getDashboard()
  },[])



  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="You Owe"
          value={`Rs. ${oweTransaction.toFixed(2)}`}
          icon={<CreditCard size={18} className="text-red-500" />}
          color="bg-red-100"
        />
        <StatsCard
          title="You're Owed"
          value={`Rs. ${owedTransaction.toFixed(2)}`}
          icon={<CreditCard size={18} className="text-blue-500" />}
          color="bg-blue-100"
        />
        <StatsCard
          title="Net Amount"
          value={`Rs. ${(owedTransaction - oweTransaction).toFixed(2) }`}
          icon={<DollarSign size={18} className="text-green-500" />}
          color="bg-green-100"
        />
        <StatsCard
          title="Active Groups"
          value="5"
          icon={<Users size={18} className="text-purple-500" />}
          color="bg-purple-100"
        />
      </div>

      {/* Two column layout for desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Groups section */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Your Groups</h2>
            <button className="text-sm text-blue-500 font-medium hover:text-blue-700" onClick={()=>navigate('/groups')}>
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups?.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}

            {/* Create new group card */}
            <div className="bg-white rounded-lg shadow-md p-4 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-full hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="bg-blue-100 p-2 rounded-full mb-3">
                <Plus size={24} className="text-blue-500" />
              </div>
              <p className="font-medium text-blue-500">Create New Group</p>
            </div>
          </div>
        </div>

        {/* Recent transactions section */}
        <div className="bg-white rounded-lg shadow-md p-4 h-[58vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h2>
          </div>

                  {transactions && transactions.length > 0 ? (
                    transactions.map((transaction: Transaction) => (
                      <TransactionCard transaction={transaction} />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-gray-500">No transactions yet</p>
                    </div>
                  )}
    
  
        </div>
      </div>

    </div>
  );
};

export default HomePage;
