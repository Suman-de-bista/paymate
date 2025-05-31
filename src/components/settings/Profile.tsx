import { User } from 'lucide-react'
import useUserStore from '../../store/useUserStore'
import { useState } from 'react';

interface UserInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
  }

const Profile = () => {
    
    const [userInfo, setUserInfo] = useState<UserInfo>({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    const {user} = useUserStore()

    const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
        setUserInfo(prev => ({
          ...prev,
          [field]: value
        }));
      };
    
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={40} className="text-gray-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{user?.name || ""}</h3>
          <p className="text-gray-500">{user?.email || ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={user?.name || ""}
            onChange={(e) => handleUserInfoChange('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={user?.email || ""}
            onChange={(e) => handleUserInfoChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={user?.phone || ""}
            onChange={(e) => handleUserInfoChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            value={user?.address || ""}
            onChange={(e) => handleUserInfoChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

    
  

export default Profile