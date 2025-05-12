import { DollarSign } from "lucide-react"
import useUserStore from "../../store/useUserStore"
import { useState } from "react"
import PaymentModal from "../payment/PaymentModal"

const TransactionCard = ({ transaction }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const {user} = useUserStore()
  const isInGroup = transaction.split_between.includes(user?.id)
  const totalShareMembers = transaction.split_between.length
  const isPayer = transaction.paid_by === user?.id
  let shareAmount = 0
  if(isInGroup && !isPayer){
    shareAmount = transaction.amount / totalShareMembers
  }
  return (
    <div key={transaction.id}
      className="p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${transaction.amount < 0 ? 'bg-red-100' : 'bg-green-100'}`}>
            <DollarSign size={16} className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'} />
          </div>
          <div>
            <p className="font-medium text-gray-800">{transaction.name}</p>
            <p className="text-sm text-gray-500">{transaction.split_between.length} Members</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-semibold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {transaction.amount.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">{new Date(transaction.date * 1000).toLocaleDateString()}</p>
          {isInGroup && !isPayer && (
            <div className="mt-2 flex justify-center bg-red-600 text-white px-2 py-1 rounded-md">
              <button className="text-sm text-gray-200" onClick={() => setShowPaymentModal(true)}>
                Pay <span className="text-xs text-gray-200">({shareAmount.toFixed(2)})</span>
              </button>
            </div>
          )}
          {showPaymentModal && (
            <PaymentModal
              isOpen={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              qrImage={"../assets/qr.png"}
              shareAmount = {shareAmount.toFixed(2)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default TransactionCard