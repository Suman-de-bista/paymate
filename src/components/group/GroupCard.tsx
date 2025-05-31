import { useNavigate } from "react-router-dom";

interface Group {
  id: string;
  name: string;
  description: string;
  members: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  color?: string;
  balance?: number;
}

const GroupCard = ({ group }: { group: Group }) => {
    const navigate = useNavigate();

    const handleViewDetails = () => {
        navigate(`/groups/${group.id}`);
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: group.color || "#4F46E5" }}
            >
              {group.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-800">{group.name}</h3>
              <p className="text-sm text-gray-500">{group.members.length} members</p>
            </div>
          </div>
          <span
            className={`text-sm font-medium ${
              (group.balance || 0) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${(group.balance || 0).toFixed(2)}
          </span>
        </div>
        <div className="mt-4 flex justify-between">
          <button 
            onClick={handleViewDetails}
            className="text-sm text-blue-500 font-medium hover:text-blue-700"
          >
            View Details
          </button>
          {/* <button className="text-sm text-gray-500 font-medium hover:text-gray-700">
            Settle Up
          </button> */}
        </div>
      </div>
    );
  };

export default GroupCard