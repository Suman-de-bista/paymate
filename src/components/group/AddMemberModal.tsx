import { debounce } from "lodash";
import { useCallback, useState } from "react";
import { addGroupMembers, searchUsersByEmailInGroup } from "../../apis/groups";
import { GroupMember, User } from "../../types/group";
import { X } from "lucide-react";

const AddMemberModal = ({groupId,setShowAddMemberModal,fetchGroupDetails}) => {
    const [emailInput, setEmailInput] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([]);
    
    const [isSearching, setIsSearching] = useState(false);
    
      const searchUsers = useCallback(
        debounce(async (email: string) => {
          if (email.length < 3) {
            setSearchResults([]);
            return;
          }
          setIsSearching(true);
          try {
            const results = await searchUsersByEmailInGroup(email, groupId!);
            setSearchResults(results);
          } catch (error) {
            console.error("Error searching users:", error);
          } finally {
            setIsSearching(false);
          }
        }, 500),
        []
      );
    
      const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setEmailInput(email);
        searchUsers(email);
      };
    
      const handleAddMember = (user: User) => {
        if (!selectedMembers.find((member) => member.id === user.id)) {
          setSelectedMembers([...selectedMembers, user]);
        }
        setEmailInput("");
        setSearchResults([]);
      };
    
      const handleRemoveMember = (userId: string) => {
        setSelectedMembers(selectedMembers.filter((member) => member.id !== userId));
      };
    
      const handleSaveMembers = async () => {
        try {
          const memberIds = selectedMembers.map((member) => member.id);
          await addGroupMembers(groupId!, memberIds);
          setShowAddMemberModal(false);
          setSelectedMembers([]);
          fetchGroupDetails();
        } catch (error) {
          console.error("Error adding members:", error);
        }
      };
  return (
    <div className="fixed inset-0 bg-white/30 bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-8 relative transform transition-all max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Members</h2>
              
              {/* Email Search Input */}
              <div className="relative mb-6">
                <input
                  type="email"
                  value={emailInput}
                  onChange={handleEmailChange}
                  placeholder="Enter email to search users..."
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <div className="animate-spin h-6 w-6 border-3 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mb-6 max-h-48 overflow-y-auto rounded-lg border border-gray-100 custom-scrollbar">
                  {searchResults.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleAddMember(user)}
                      className="p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected Members */}
              {selectedMembers.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Selected Members</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {selectedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSaveMembers}
                disabled={selectedMembers.length === 0}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                Add Selected Members
              </button>
            </div>
          </div>
  )
}

export default AddMemberModal