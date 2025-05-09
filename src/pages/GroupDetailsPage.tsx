import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, X, Edit2, Save, Users, DollarSign, ArrowLeft } from "lucide-react";
import { getGroupDetails, updateGroupDetails, addGroupMembers, searchUsersByEmailInGroup } from "../apis/groups";
import { debounce } from "lodash";

interface User {
  id: string;
  email: string;
  name: string;
}

interface GroupMember {
  id: string;
  email: string;
  name: string;
}

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
  const [group, setGroup] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<GroupMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGroupDetails();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      setIsLoading(true);
      const data = await getGroupDetails(groupId!);
      setGroup(data);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/groups")}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Groups
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Group Details */}
          <div className="lg:col-span-2">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4 p-4 border-b-2 border-blue-500">
                  <Users size={24} className="text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-800">{group.members.length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 border-b-2 border-green-500">
                  <DollarSign size={24} className="text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Balance</p>
                    <p className="text-2xl font-bold text-gray-800">${(group.balance || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 border-b-2 border-purple-500">
                  <DollarSign size={24} className="text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Your Share</p>
                    <p className="text-2xl font-bold text-gray-800">${((group.balance || 0) / (group.members.length || 1)).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Members List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[calc(100vh-12rem)] flex flex-col">
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
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="divide-y divide-gray-100">
                  {group.members.map((member: any) => (
                    <div
                      key={member.id || Math.random()}
                      className="flex items-center p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div 
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${getRandomColor(member.id)}, ${getRandomColor(member.id ? member.id + '2' : 'default2')})`
                        }}
                      >
                        {member.name ? member.name.substring(0, 2).toUpperCase() : '??'}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{member.name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-500 truncate">{member.email || 'No email'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
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
        )}
      </div>
    </div>
  );
};

export default GroupDetailsPage; 