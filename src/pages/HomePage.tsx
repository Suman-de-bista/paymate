import {
  DollarSign,
  CreditCard,
  Users,
  Plus
} from "lucide-react";
import StatsCard from "../components/common/StatsCard";
import GroupCard from "../components/group/GroupCard";
import RecentTransaction from "../components/common/RecentTransaction";



const HomePage = () => {


  return (
    <>
      <main className="flex-1 overflow-y-auto">
        <DashboardContent />
      </main>
    </>
  );
};

// Main Dashboard Content
const DashboardContent = () => {
  // Sample data
  const groups = [
    { id: 1, name: "Roommates", members: 4, balance: 120.5, color: "#4F46E5" },
    {
      id: 2,
      name: "Trip to Bali",
      members: 6,
      balance: -45.75,
      color: "#10B981",
    },
    { id: 3, name: "Office Lunch", members: 8, balance: 0, color: "#F59E0B" },
  ];

  const transactions = [
    {
      id: 1,
      description: "Dinner at Italian Place",
      from: "Alex",
      amount: 32.5,
      date: "Today, 7:30 PM",
      isPaid: true,
      color: "#4F46E5",
    },
    {
      id: 2,
      description: "Movie Tickets",
      from: "Sarah",
      amount: 24.0,
      date: "Yesterday, 9:15 PM",
      isPaid: false,
      color: "#EC4899",
    },
    {
      id: 3,
      description: "Uber Ride",
      from: "Mike",
      amount: 18.75,
      date: "May 6, 3:20 PM",
      isPaid: true,
      color: "#10B981",
    },
    {
      id: 4,
      description: "Groceries",
      from: "You",
      amount: 45.3,
      date: "May 5, 11:45 AM",
      isPaid: false,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors">
          <Plus size={18} className="mr-1" />
          <span>New Expense</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Balance"
          value="$245.80"
          icon={<DollarSign size={18} className="text-green-500" />}
          color="bg-green-100"
        />
        <StatsCard
          title="You Owe"
          value="$87.50"
          icon={<CreditCard size={18} className="text-red-500" />}
          color="bg-red-100"
        />
        <StatsCard
          title="You're Owed"
          value="$333.30"
          icon={<CreditCard size={18} className="text-blue-500" />}
          color="bg-blue-100"
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
            <button className="text-sm text-blue-500 font-medium hover:text-blue-700">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map((group) => (
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
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Transactions
            </h2>
            <button className="text-sm text-blue-500 font-medium hover:text-blue-700">
              See All
            </button>
          </div>

          <div>
            {transactions.map((transaction) => (
              <RecentTransaction
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-center text-sm font-medium text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors">
            Load More
          </button>
        </div>
      </div>

    </div>
  );
};

export default HomePage;
