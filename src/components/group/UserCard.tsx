
const UserCard = ({member,getRandomColor}) => {
  return (
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
  )
}

export default UserCard