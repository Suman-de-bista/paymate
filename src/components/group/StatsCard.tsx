import { Users } from 'lucide-react'

const StatsCard = ({value, icon, label}) => {
  return (
    <div className="flex items-center space-x-4 p-4 border-b-2 border-blue-500">
                  {icon}
                  <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                  </div>
                </div>
  )
}

export default StatsCard