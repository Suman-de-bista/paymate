import React, { useState } from 'react';
import { User, QrCode, Bell, Shield, CreditCard, LogOut } from 'lucide-react';
import AddQRModal from '../components/AddQRModal';
import QR from '../components/settings/QR';
import Profile from '../components/settings/Profile';
import Notification from '../components/settings/Notification';



const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

 
 

  const renderQRSection = () => (
    <QR  />
  );


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'qr' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <QrCode size={20} />
              <span>QR Codes</span>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Bell size={20} />
              <span>Notifications</span>
            </button>
            <button
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'profile' && <Profile/>}
            {activeTab === 'qr' && renderQRSection()}
            {activeTab === 'notifications' && <Notification/>}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default SettingsPage;
