import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import API from "../services/api";
import AddPaymentModal from "../components/payment/AddPaymentModal";
import {
  FaWallet,
  FaCalendarAlt,
  FaClock,
  FaReceipt,
} from "react-icons/fa";
function Payments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [stats, setStats] = useState({
      totalCollection: 0,
      monthlyCollection: 0,
      todayCollection: 0,
      totalPayments: 0,
    });
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      const params = new URLSearchParams(location.search);

      if (params.get("new") === "true") {
        setShowModal(true);
      }
    }, [location]);
    useEffect(() => {
        fetchPayments();
        }, []
    );

    const fetchPayments = async () => {
    try {
        const res = await API.get("/payment");
        console.log(res.data);
        setPayments(res.data.payments);

        setStats({
          totalCollection: res.data.totalCollection,
          monthlyCollection: res.data.monthlyCollection,
          todayCollection: res.data.todayCollection,
          totalPayments: res.data.count,
        });

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    const deletePayment = async (id) => {
    if (!window.confirm("Delete this payment?")) return;

    try {
        await API.delete(`/payment/delete/${id}`);

        fetchPayments();

    } catch (error) {
        console.log(error);
    }
    };
  return (
  <Layout>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-white">
        Payments
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">

          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
            <FaWallet className="text-green-400 text-3xl" />
          </div>

          <h3 className="text-gray-400 text-lg">
            Total Collection
          </h3>

          <p className="text-4xl font-bold text-green-400 mt-2">
            ₹{stats.totalCollection}
          </p>

        </div>

       <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">

          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
            <FaCalendarAlt className="text-blue-400 text-3xl" />
          </div>

          <h3 className="text-gray-400 text-lg">
            This Month
          </h3>

          <p className="text-4xl font-bold text-blue-400 mt-2">
            ₹{stats.monthlyCollection}
          </p>

        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">

          <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
            <FaClock className="text-yellow-400 text-3xl" />
          </div>

          <h3 className="text-gray-400 text-lg">
            Today
          </h3>

          <p className="text-4xl font-bold text-yellow-400 mt-2">
            ₹{stats.todayCollection}
          </p>

        </div>
       <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">

          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <FaReceipt className="text-purple-400 text-3xl" />
          </div>

          <h3 className="text-gray-400 text-lg">
            Total Payments
          </h3>

          <p className="text-4xl font-bold text-purple-400 mt-2">
            {stats.totalPayments}
          </p>

        </div>

      </div>
      <button
        onClick={() => {
            setSelectedPayment(null);
            setShowModal(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
      >
        + Add Payment
      </button>
    </div>

    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-slate-800 text-gray-300">
          <tr>
            <th className="p-4">Client</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Method</th>
            <th className="p-4">Date</th>
            <th className="p-4">Notes</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-400">
                Loading...
              </td>
            </tr>
          ) : payments.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-400">
                No Payments Found
              </td>
            </tr>
          ) : (
            payments.map((payment) => (
              <tr
                key={payment._id}
                className="border-t border-slate-800"
              >
                <td className="p-4 text-white">
                    {payment.client?.clientName || "Client Deleted"}
                </td>

                <td className="p-4 text-green-400 font-semibold">
                  ₹{payment.amount}
                </td>

                <td className="p-4 text-gray-300">
                  {payment.paymentMethod}
                </td>

                <td className="p-4 text-gray-300">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>

                <td className="p-4 text-gray-300">
                    {payment.notes}
                    </td>

                    <td className="p-4">
                    <button
                        onClick={() => {
                            setSelectedPayment(payment);
                            setShowModal(true);
                        }}
                        className="text-blue-500 hover:underline mr-4"
                        >
                        Edit
                    </button>

                    <button
                        onClick={() => deletePayment(payment._id)}
                        className="text-red-500 hover:underline"
                        >
                        Delete
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {showModal && (
        <AddPaymentModal
            payment={selectedPayment}
            onClose={() => {
                setShowModal(false);
                setSelectedPayment(null);
            }}
           onSuccess={async () => {
            await fetchPayments();

            setShowModal(false);
            setSelectedPayment(null);

            if (location.search.includes("new=true")) {
              navigate("/dashboard");
            }
          }}
        />
    )}
  </Layout>
);
}

export default Payments;