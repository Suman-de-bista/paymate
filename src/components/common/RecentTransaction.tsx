const RecentTransaction = ({ transaction }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-200">
      <div className="flex items-center">
        <div
          className="h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-xs"
          style={{ backgroundColor: transaction.color }}
        >
          {transaction.from.substring(0, 2).toUpperCase()}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-800">
            {transaction.description}
          </p>
          <p className="text-xs text-gray-500">
            {transaction.isPaid ? "Paid by " : "You paid "}
            <span className="font-medium">{transaction.from}</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-medium ${
            transaction.isPaid ? "text-green-600" : "text-red-600"
          }`}
        >
          {transaction.isPaid ? "+" : "-"}${transaction.amount.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">{transaction.date}</p>
      </div>
    </div>
  );
};


export default RecentTransaction