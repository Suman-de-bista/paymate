import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Edit2, Save, Users, DollarSign, ArrowLeft } from "lucide-react";
import { getGroupDetails, updateGroupDetails } from "../apis/groups";
import { getTransactions } from "../apis/transaction";
import StatsCard from "../components/group/StatsCard";
import TransactionCard from "../components/group/TransactionCard";
import UserCard from "../components/group/UserCard";
import {  Group, Transaction } from "../types/group";
import AddMemberModal from "../components/group/AddMemberModal";
import AddTransactionModal from "../components/group/AddTransactionModal";
import useUserStore from "../store/useUserStore";


const getRandomColor = (seed: string | undefined) => {
  const colors = [
    '#4F46E5', // Indigo
    '#7C3AED', // Violet
    '#EC4899', // Pink
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];
  
  // Use a default seed if none provided
  const safeSeed = seed || 'default';
  // Use the seed to consistently generate the same color for the same member
  const index = safeSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const GroupDetailsPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {user} = useUserStore();

  const [totalTransactionAmount, setTotalTransactionAmount] = useState(0);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalYouOwe, setTotalYouOwe] = useState(0);
  
  // Transaction form state


  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getGroupDetails(groupId!);
      const transactions = await getTransactions(groupId!);
      setGroup({
        ...data,
        transactions: transactions || []
      });
      setTotalTransactionAmount(transactions.reduce((acc: number, transaction: Transaction) => acc + transaction.amount, 0));
      setTotalOwed(transactions.filter((transaction: Transaction) => transaction.paid_by === user?.id).reduce((acc: number, transaction: Transaction) => acc + (transaction.amount - transaction.amount / transaction.split_between.length), 0));
      setTotalYouOwe(transactions.filter((transaction: Transaction) => transaction.paid_by !== user?.id).reduce((acc: number, transaction: Transaction) => acc + (transaction.amount / transaction.split_between.length), 0));
      setEditedName(data.name);
      setEditedDescription(data.description);
    } catch (error) {
      console.error("Error fetching group details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGroupDetails = async () => {
    try {
      const updatedGroup = await updateGroupDetails( {
        id: groupId!,
        name: editedName,
        description: editedDescription,
      });
      setGroup(updatedGroup);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating group details:", error);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Group not found</h2>
        <button
          onClick={() => navigate("/groups")}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Groups
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <div className="h-full max-w-7xl mx-auto px-4 py-2 overflow-y-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/groups")}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors sticky top-0 bg-gray-50 py-2 z-10"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Groups
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Group Details and Transactions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Group Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-8">
                {isEditing ? (
                  <div className="flex-1 space-y-4">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-3xl font-bold w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Group Name"
                    />
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                      placeholder="Group Description"
                    />
                  </div>
                ) : (
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">{group.name}</h1>
                    <p className="text-gray-600 text-lg">{group.description}</p>
                  </div>
                )}
                <button
                  onClick={() => (isEditing ? handleSaveGroupDetails() : setIsEditing(true))}
                  className="ml-4 p-3 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
                >
                  {isEditing ? <Save size={24} /> : <Edit2 size={24} />}
                </button>
              </div>

              {/* Group Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatsCard value={group.members.length} icon={<Users size={24} className="text-blue-500" />} label="Total Members" />
                <StatsCard value={totalTransactionAmount.toFixed(2)} icon={<DollarSign size={24} className="text-blue-500" />} label="Total Amount" />
                <StatsCard value={totalOwed.toFixed(2)} icon={<DollarSign size={24} className="text-green-500" />} label="You're Owed" />
                <StatsCard value={totalYouOwe.toFixed(2)} icon={<DollarSign size={24} className="text-red-500" />} label="You Owe" />
              </div>
            </div>

            {/* Transactions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <DollarSign size={24} className="text-gray-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Transactions</h2>
                  </div>
                  <button
                    onClick={() => setShowAddTransactionModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all transform hover:scale-105"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Transactions List */}
              <div className="h-[calc(100vh-32rem)] overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-gray-100">
                  {group.transactions && group.transactions.length > 0 ? (
                    group.transactions.map((transaction: Transaction) => (
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
          </div>

          {/* Right Column - Members List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 sticky top-8">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Users size={24} className="text-gray-600 mr-3" />
                    <h2 className="text-xl font-semibold text-gray-800">Members</h2>
                  </div>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all transform hover:scale-105"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Members List */}
              <div className="max-h-[calc(100vh-14rem)] overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-gray-100">
                  {group.members.map((member: any) => (
                    <UserCard member={member} getRandomColor={getRandomColor} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <AddMemberModal groupId={groupId} setShowAddMemberModal={setShowAddMemberModal} fetchGroupDetails={fetchGroupDetails} />
        )}

        {/* Add Transaction Modal */}
        {showAddTransactionModal && (
          <AddTransactionModal group={group} setGroup={setGroup} setShowAddTransactionModal={setShowAddTransactionModal}/>
        )}
      </div>
    </div>
  );
};

export default GroupDetailsPage; 