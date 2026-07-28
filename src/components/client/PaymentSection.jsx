import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  IndianRupee,
  Plus,
  Trash2,
} from "lucide-react";

export default function PaymentSection({
  client,
  payments = [],
  paidAmount = 0,
  addPayment,
  deletePayment,
}) {
  const { theme } = useTheme();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    paymentMethod: "Cash",
    notes: "",
  });

  const totalAmount = Number(client?.totalAmount || 0);

  const pendingAmount = Math.max(
    totalAmount - Number(paidAmount),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const amount = Number(form.amount);

    if (!amount || amount <= 0) return;

    if (amount > pendingAmount) {
      alert("Payment exceeds pending amount.");
      return;
    }

    setSaving(true);

    const success = await addPayment({
      amount,
      paymentMethod: form.paymentMethod,
      notes: form.notes.trim(),
    });

    setSaving(false);

    if (success) {
      setForm({
        amount: "",
        paymentMethod: "Cash",
        notes: "",
      });
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Delete this payment?"
    );

    if (!ok) return;

    await deletePayment(id);
  };

  return (
    <div className="space-y-6">

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-3">

        <SummaryCard
          title="Total Amount"
          amount={totalAmount}
          color="blue"
        />

        <SummaryCard
          title="Paid Amount"
          amount={paidAmount}
          color="green"
        />

        <SummaryCard
          title="Pending Amount"
          amount={pendingAmount}
          color="red"
        />

      </div>

      {/* Add Payment */}

      <div
        className={`rounded-3xl border shadow-2xl p-6 transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >

        <h2
          className={`text-xl font-bold mb-5 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Add Payment
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 lg:grid-cols-4"
        >

          <input
            type="number"
            min="1"
            max={pendingAmount}
            required
            placeholder="Amount"
            value={form.amount}
            onChange={(e) =>
              setForm({
                ...form,
                amount: e.target.value,
              })
            }
            className={`rounded-xl border p-3 transition-all ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />

          <select
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({
                ...form,
                paymentMethod: e.target.value,
              })
            }
            className={`rounded-xl border p-3 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
            <option>Bank Transfer</option>
          </select>

          <input
            placeholder="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
            className={`rounded-xl border p-3 transition-all ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-400"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={18} />
            {saving ? "Saving..." : "Add Payment"}
          </button>

        </form>

      </div>
            {/* History */}

      <div
        className={`rounded-3xl border shadow-2xl p-6 transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-5 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Payment History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr
                className={`border-b ${
                  theme === "dark"
                    ? "border-slate-700 text-white"
                    : "border-gray-200 text-gray-900"
                }`}
              >
                <th className="text-left py-3">Date</th>
                <th className="text-left py-3">Method</th>
                <th className="text-left py-3">Notes</th>
                <th className="text-right py-3">Amount</th>
                <th className="text-center py-3">Action</th>
              </tr>

            </thead>

            <tbody>

              {payments.length === 0 ? (

                <tr>

                  <td
                    colSpan={5}
                    className={`text-center py-8 ${
                      theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    No payment history available.
                  </td>

                </tr>

              ) : (

                payments.map((payment) => (

                  <tr
                    key={payment._id}
                    className={`border-b transition ${
                      theme === "dark"
                        ? "border-slate-700 hover:bg-slate-800 text-gray-200"
                        : "border-gray-200 hover:bg-gray-50 text-gray-900"
                    }`}
                  >

                    <td className="py-4">
                      {new Date(
                        payment.paymentDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {payment.paymentMethod}
                    </td>

                    <td>
                      {payment.notes || "-"}
                    </td>

                    <td className="text-right font-semibold">
                      ₹
                      {Number(
                        payment.amount
                      ).toLocaleString("en-US")}
                    </td>

                    <td className="text-center">

                      <button
                        onClick={() =>
                          handleDelete(payment._id)
                        }
                        className={`transition ${
                          theme === "dark"
                            ? "text-red-400 hover:text-red-300"
                            : "text-red-600 hover:text-red-700"
                        }`}
                      >
                        <Trash2 size={18} />
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function SummaryCard({
  title,
  amount,
  color,
}) {
  const { theme } = useTheme();

  const colors = {
    blue:
      theme === "dark"
        ? "bg-slate-800 border border-blue-800 text-blue-400"
        : "bg-blue-50 text-blue-700",

    green:
      theme === "dark"
        ? "bg-slate-800 border border-green-800 text-green-400"
        : "bg-green-50 text-green-700",

    red:
      theme === "dark"
        ? "bg-slate-800 border border-red-800 text-red-400"
        : "bg-red-50 text-red-700",
  };

  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 ${colors[color]}`}
    >
      <p className="text-sm opacity-80">
        {title}
      </p>

      <h2 className="mt-2 flex items-center gap-1 text-2xl font-bold">
        <IndianRupee size={20} />
        {Number(amount).toLocaleString("en-US")}
      </h2>

    </div>
  );
}