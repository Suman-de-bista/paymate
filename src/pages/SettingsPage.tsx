import React, { useState } from 'react';
import { User, QrCode, Bell, Shield, CreditCard, LogOut } from 'lucide-react';
import AddQRModal from '../components/AddQRModal';

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City'
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={40} className="text-gray-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{userInfo.name}</h3>
          <p className="text-gray-500">{userInfo.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={userInfo.name}
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
            value={userInfo.email}
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
            value={userInfo.phone}
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
            value={userInfo.address}
            onChange={(e) => handleUserInfoChange('address', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderQRSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Your QR Codes</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New QR
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample QR Code Cards */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
              <QrCode size={100} className="text-gray-400" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">QR Code {item}</h4>
              <p className="text-sm text-gray-500">Created on Jan {item}, 2024</p>
              <div className="flex space-x-2">
                <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                <button className="text-sm text-red-600 hover:text-red-700">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Notification Preferences</h3>
      <div className="space-y-4">
        {[
          'Payment Notifications',
          'QR Code Scans',
          'Account Updates',
          'Marketing Emails'
        ].map((item) => (
          <div key={item} className="flex items-center justify-between">
            <span className="text-gray-700">{item}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Security Settings</h3>
      <div className="space-y-4">
        <button className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Change Password
        </button>
        <button className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Two-Factor Authentication
        </button>
        <button className="w-full px-4 py-2 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Connected Devices
        </button>
      </div>
    </div>
  );

  const renderPaymentSection = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Payment Methods</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <CreditCard size={24} className="text-gray-500" />
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
          <button className="text-red-600 hover:text-red-700">Remove</button>
        </div>
        <button className="w-full px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          Add New Payment Method
        </button>
      </div>
    </div>
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
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Shield size={20} />
              <span>Security</span>
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg ${
                activeTab === 'payment' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CreditCard size={20} />
              <span>Payment</span>
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
            {activeTab === 'profile' && renderProfileSection()}
            {activeTab === 'qr' && renderQRSection()}
            {activeTab === 'notifications' && renderNotificationsSection()}
            {activeTab === 'security' && renderSecuritySection()}
            {activeTab === 'payment' && renderPaymentSection()}
          </div>
        </div>
      </div>
      <AddQRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(qrData) => {
          // Handle the QR code data
          console.log(qrData);
        }}
      />
    </div>
  );
};

export default SettingsPage;
