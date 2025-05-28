import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types/group';
import qr from '../../assets/qr.png';
import { getQR, QRDetail } from '../../apis/qr';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  payeeId: string; // URL or path to the QR code image
  shareAmount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, payeeId, shareAmount }) => {
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [qrCode, setQrCode] = useState<QRDetail | null>(null);

  const fetchQrCode = async () => {
    const qrCode = await getQR(payeeId);
    setQrCode(qrCode);
};

useEffect(() => {
    fetchQrCode();
}, []);

  if (!isOpen) return null;

  const handleAmountPaidChange = (value: string) => {
    const numValue = parseFloat(value);
    const total = parseFloat(totalAmount);
    
    if (numValue <= shareAmount) {
      setAmountPaid(value);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-4 shadow-2xl h-[98vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold text-gray-800">Payment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* QR Code Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">QR Code</h3>
          {qrCode?.qr_image?<div className="bg-white p-2 rounded-lg shadow-sm">
            <p className='text-center mb-1.5'>Name:{qrCode?.name}</p>
            <img 
              src={`../backend/${qrCode?.qr_image}`}
              alt="QR Code" 
              className="w-[250px] h-[250px] object-contain"
            />
            <p className='text-center mt-1.5'>Description:{qrCode?.description}</p>
            <p className='text-start text-gray-400 text-[10px]'>Scan the QR for the payment</p>
            </div>:<p>No Active QR Found</p>}
            
            
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount to Pay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
              <input
                type="number"
                value={shareAmount}
                disabled={true}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Paid
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
              <input
                type="number"
                value={amountPaid}
                onChange={(e) => handleAmountPaidChange(e.target.value)}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {amountPaid && parseFloat(amountPaid) > parseFloat(totalAmount) && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle size={16} className="mr-1" />
                Amount paid cannot exceed total amount
              </p>
            )}
          </div>

          {/* Payment Status */}
          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="paymentComplete"
              checked={isPaymentComplete}
              onChange={(e) => setIsPaymentComplete(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="paymentComplete" className="text-sm text-gray-700">
              Mark payment as complete
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 text-white rounded-lg flex items-center space-x-2 ${
                isPaymentComplete
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } transition-colors`}
            >
              {isPaymentComplete ? (
                <>
                  <CheckCircle2 size={20} />
                  <span>Payment Complete</span>
                </>
              ) : (
                <span>Complete Payment</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 