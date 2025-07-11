
const Notification = () => {
  return (
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
  )
}

export default Notification