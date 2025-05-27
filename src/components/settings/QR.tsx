import { useEffect, useState } from 'react'
import { getUserQRs, QRDetail, deleteQR } from '../../apis/qr';
import AddQRModal from '../AddQRModal';

const QR = () => {
    const [qrCodes, setQrCodes] = useState<QRDetail[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchQrCodes = async () => {
        const qrCodes = await getUserQRs();
        setQrCodes(qrCodes);
    };

    useEffect(() => {
        fetchQrCodes();
    }, []);

    const handleDelete = async (qrId: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default form submission
        if (window.confirm('Are you sure you want to delete this QR code?')) {
            try {
                setIsDeleting(true);
                await deleteQR(qrId);
                await fetchQrCodes(); // Refresh the list
            } catch (error) {
                console.error('Error deleting QR code:', error);
                alert('Failed to delete QR code');
            } finally {
                setIsDeleting(false);
            }
        }
    };

  return (
    <div className="space-y-6">
        {isModalOpen && <AddQRModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (qrData) => {
          try {
            await fetchQrCodes(); // Refresh the list after new QR is added
          } catch (error) {
            console.error('Error refreshing QR list:', error);
          }
        }}
      />}
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
      {qrCodes?.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center relative">
            <img src={`./backend/${item.qr_image}`} alt="QR Code" className="w-full h-full object-cover" />
            {item.is_active && (
              <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{item.name}</h4>
              {item.is_active && (
                <span className="text-xs text-green-600 font-medium">Default</span>
              )}
            </div>
            <p className="text-sm text-gray-500">{item.description}</p>
            <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString("en-US")}</p>
            <div className="flex space-x-2">
              <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
              <button 
                onClick={(e) => handleDelete(item.id, e)}
                disabled={isDeleting}
                className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  )
}

export default QR