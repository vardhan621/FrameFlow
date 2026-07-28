import { FiX } from "react-icons/fi";
import PaymentForm from "./PaymentForm";
function AddPaymentModal({
  payment,
  onClose,
  onSuccess,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-xl relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
             {payment ? "Edit Payment" : "Add Payment"}
        </h2>               
        <PaymentForm
            payment={payment}
            onSuccess={onSuccess}
        />

      </div>

    </div>
  );
}

export default AddPaymentModal;