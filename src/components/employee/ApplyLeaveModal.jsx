import { useState } from "react";
import EmployeeAPI from "../../services/employeeApi";
import toast from "react-hot-toast";

function ApplyLeaveModal({
  employeeId,
  onClose,
  onSuccess,
}) {
  const [date, setDate] = useState("");
  const [leaveType, setLeaveType] = useState("Casual");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!date) {
      return toast.error("Please select leave date");
    }

    if (!reason.trim()) {
      return toast.error("Please enter reason");
    }

    try {
      setLoading(true);

      await EmployeeAPI.post("/leave/apply", {
        employee: employeeId,
        date,
        leaveType,
        reason,
      });

      toast.success("Leave Applied Successfully");

      if (onSuccess) onSuccess();

      onClose();

    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message ||
        "Failed to apply leave"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

      <div className="bg-slate-900 rounded-xl w-full max-w-lg p-6 border border-slate-700">

        <h2 className="text-2xl font-bold text-white mb-6">
          Apply Leave
        </h2>

        <div className="space-y-4">

          <div>
            <label className="text-gray-300 block mb-2">
              Leave Date
            </label>

            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-2">
              Leave Type
            </label>

            <select
              value={leaveType}
              onChange={(e) =>
                setLeaveType(e.target.value)
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white"
            >
              <option value="Casual">
                Casual Leave
              </option>

              <option value="Sick">
                Sick Leave
              </option>

              <option value="Personal">
                Personal Leave
              </option>

              <option value="Emergency">
                Emergency Leave
              </option>
            </select>
          </div>

          <div>
            <label className="text-gray-300 block mb-2">
              Reason
            </label>

            <textarea
              rows="4"
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="Enter reason..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white resize-none"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Applying..." : "Apply Leave"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ApplyLeaveModal;