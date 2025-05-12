import { useState } from "react";
import { Transaction } from "../../types/group";
import { createTransaction } from "../../apis/transaction";
import { Check, ChevronsUpDown, X } from "lucide-react";

const AddTransactionModal = ({group,setGroup,setShowAddTransactionModal }) => {
    const [transactionForm, setTransactionForm] = useState({
        name: '',
        description: '',
        amount: '',
        paid_by: '',
        split_between: [] as string[],
        date: Math.floor(Date.now() / 1000) // Current timestamp in seconds
      });
    
  const [isSplitBetweenOpen, setIsSplitBetweenOpen] = useState(false);

  const handleTransactionInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTransactionForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSplitBetweenChange = (memberId: string) => {
    setTransactionForm(prev => ({
      ...prev,
      split_between: prev.split_between.includes(memberId)
        ? prev.split_between.filter(id => id !== memberId)
        : [...prev.split_between, memberId]
    }));
  };

  const handleSelectAllMembers = () => {
    if (group) {
      setTransactionForm(prev => ({
        ...prev,
        split_between: prev.split_between.length === group.members.length 
          ? [] 
          : group.members.map(member => member.id)
      }));
    }
  };

  const handleAddTransaction = async () => {
    try {
      // TODO: Add API call to create transaction
      const newTransaction: Transaction = {
        group_id: group.id,
        name: transactionForm.name,
        description: transactionForm.description,
        amount: parseFloat(transactionForm.amount),
        paid_by: transactionForm.paid_by,
        split_between: transactionForm.split_between,
        date: transactionForm.date
      };
      const createdTransaction = await createTransaction(newTransaction);

      // Update local state
      setGroup(prev => prev ? {
        ...prev,
        transactions: [createdTransaction, ...(prev.transactions || [])]
      } : null);

      // Reset form and close modal
      setTransactionForm({
        name: '',
        description: '',
        amount: '',
        paid_by: '',
        split_between: [],
        date: Math.floor(Date.now() / 1000)
      });
      setShowAddTransactionModal(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative transform transition-all max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => {
                  setShowAddTransactionModal(false)
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>
              
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={transactionForm.name}
                    onChange={handleTransactionInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter transaction name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={transactionForm.description}
                    onChange={handleTransactionInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter transaction description"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={transactionForm.amount}
                    onChange={handleTransactionInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Paid By */}
                <div>
                  <label htmlFor="paid_by" className="block text-sm font-medium text-gray-700 mb-1">
                    Paid By
                  </label>
                  <select
                    id="paid_by"
                    name="paid_by"
                    value={transactionForm.paid_by}
                    onChange={handleTransactionInputChange}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select member</option>
                    {group?.members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Split Between */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Split Between
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsSplitBetweenOpen(!isSplitBetweenOpen)}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    >
                      <span className="text-gray-700">
                        {transactionForm.split_between.length === 0
                          ? "Select members"
                          : `${transactionForm.split_between.length} member${transactionForm.split_between.length === 1 ? '' : 's'} selected`}
                      </span>
                      <ChevronsUpDown size={20} className="text-gray-500" />
                    </button>

                    {isSplitBetweenOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2 border-b border-gray-100">
                          <button
                            onClick={handleSelectAllMembers}
                            className="w-full flex items-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            <Check 
                              size={16} 
                              className={`${transactionForm.split_between.length === group?.members.length ? 'text-blue-500' : 'text-gray-400'}`}
                            />
                            <span>Select All Members</span>
                          </button>
                        </div>
                        <div className="p-2">
                          {group?.members.map((member) => (
                            <div
                              key={member.id}
                              onClick={() => handleSplitBetweenChange(member.id)}
                              className="flex items-center space-x-2 p-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                            >
                              <Check 
                                size={16} 
                                className={`${transactionForm.split_between.includes(member.id) ? 'text-blue-500' : 'text-gray-400'}`}
                              />
                              <span>{member.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {transactionForm.split_between.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {group?.members
                        .filter(member => transactionForm.split_between.includes(member.id))
                        .map(member => (
                          <div
                            key={member.id}
                            className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                          >
                            <span>{member.name}</span>
                            <button
                              onClick={() => handleSplitBetweenChange(member.id)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={new Date(transactionForm.date * 1000).toISOString().split('T')[0]}
                    onChange={(e) => {
                      const timestamp = Math.floor(new Date(e.target.value).getTime() / 1000);
                      setTransactionForm(prev => ({ ...prev, date: timestamp }));
                    }}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleAddTransaction}
                disabled={!transactionForm.name || !transactionForm.description || !transactionForm.amount || !transactionForm.paid_by || transactionForm.split_between.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none mt-6"
              >
                Add Transaction
              </button>
            </div>
          </div>
  )
}

export default AddTransactionModal