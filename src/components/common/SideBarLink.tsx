const SideBarLink = ({ icon, label,handleClick,active }) => {
  
    return (
      <button
        className={`flex items-center px-4 py-3 text-sm w-full ${
          active ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
        }`}
        onClick={handleClick}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    );
  };
  

export default SideBarLink