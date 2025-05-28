import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import GroupCard from "../components/group/GroupCard";
import Modal from "../components/group/AddGroup";
import { createGroup, getGroups } from "../apis/groups";

const GroupPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted

    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getGroups();
        console.log(fetchedGroups);

        if (isMounted) {
          setGroups(fetchedGroups);
        }
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    fetchGroups();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted component
    };
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const addGroup = async(newGroup) => {
    const addedGroup = await createGroup(newGroup);
    setGroups([...groups, addedGroup]);
    toggleModal();
  };

  return (
    <div className="px-6 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Your Groups</h1>
        <button
          onClick={toggleModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus size={18} className="mr-1" />
          <span>Add Group</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.length && groups?.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {isModalOpen && (
        <Modal onClose={toggleModal}>
          <AddGroupForm onSubmit={addGroup} />
        </Modal>
      )}
    </div>
  );
};

const AddGroupForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // Updated to remove members

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description }); // Removed members
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">Add New Group</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Group Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-1.5 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          rows="2"
          style={{ resize: "none" }}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors"
      >
        Add Group
      </button>
    </form>
  );
};

export default GroupPage;
