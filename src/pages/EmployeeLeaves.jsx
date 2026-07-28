import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeAPI from "../services/employeeApi";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

import {
  FaArrowLeft,
  FaSearch,
  FaCalendarAlt,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";

function EmployeeLeaves() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] =useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await EmployeeAPI.get("/leave/employee");
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load leaves");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      return (
        leave.leaveType
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        leave.reason
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        leave.status
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [leaves, search]);

  const totalLeaves = leaves.length;

  const approvedLeaves = leaves.filter(
    (l) => l.status === "Approved"
  ).length;

  const pendingLeaves = leaves.filter(
    (l) => l.status === "Pending"
  ).length;

  const rejectedLeaves = leaves.filter(
    (l) => l.status === "Rejected"
  ).length;

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-2xl ${
          theme === "dark"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-gray-900"
        }`}
      >
        Loading Leave History...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-900"
          : "bg-slate-100"
      }`}
    >
      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-8">

        <div>

          <h1
            className={`text-3xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            My Leave History
          </h1>

          <p
            className={`mt-2 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            View all your leave requests and approvals.
          </p>

        </div>

        <button
          onClick={() => navigate("/employee/dashboard")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          <FaArrowLeft />
          Dashboard
        </button>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div
          className={`rounded-2xl p-5 shadow ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-white"
          }`}
        >
          <FaClipboardList className="text-blue-500 text-3xl mb-3" />

          <h2
            className={`text-3xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {totalLeaves}
          </h2>

          <p className="text-gray-500 mt-1">
            Total Leaves
          </p>

        </div>

        <div
          className={`rounded-2xl p-5 shadow ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-white"
          }`}
        >
          <FaClock className="text-yellow-500 text-3xl mb-3" />

          <h2
            className={`text-3xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {pendingLeaves}
          </h2>

          <p className="text-gray-500 mt-1">
            Pending
          </p>

        </div>

        <div
          className={`rounded-2xl p-5 shadow ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-white"
          }`}
        >
          <FaCheckCircle className="text-green-500 text-3xl mb-3" />

          <h2
            className={`text-3xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {approvedLeaves}
          </h2>

          <p className="text-gray-500 mt-1">
            Approved
          </p>

        </div>

        <div
          className={`rounded-2xl p-5 shadow ${
            theme === "dark"
              ? "bg-slate-800"
              : "bg-white"
          }`}
        >
          <FaTimesCircle className="text-red-500 text-3xl mb-3" />

          <h2
            className={`text-3xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {rejectedLeaves}
          </h2>

          <p className="text-gray-500 mt-1">
            Rejected
          </p>

        </div>

      </div>

      {/* Search */}

      <div className="relative mb-8">

        <FaSearch
          className={`absolute left-4 top-4 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        />

        <input
          type="text"
          placeholder="Search leaves..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
          }`}
        />
      </div>
            {/* Leave History */}

      {filteredLeaves.length === 0 ? (

        <div
          className={`rounded-2xl p-12 text-center border ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <FaCalendarAlt
            className={`mx-auto text-6xl mb-4 ${
              theme === "dark"
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          />

          <h2
            className={`text-2xl font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            No Leave Requests
          </h2>

          <p
            className={`mt-2 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            Your leave requests will appear here.
          </p>

        </div>

      ) : (

        <div
          className={`rounded-2xl overflow-hidden shadow border ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead
                className={
                  theme === "dark"
                    ? "bg-slate-700"
                    : "bg-gray-100"
                }
              >
                <tr>

                  <th
                    className={`p-4 text-left ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Date
                  </th>

                  <th
                    className={`p-4 text-left ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Leave Type
                  </th>

                  <th
                    className={`p-4 text-left ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Reason
                  </th>

                  <th
                    className={`p-4 text-center ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredLeaves.map((leave) => (

                  <tr
                    key={leave._id}
                    className={`transition-all duration-300 hover:${
                      theme === "dark"
                        ? "bg-slate-700"
                        : "bg-gray-50"
                    } border-t ${
                      theme === "dark"
                        ? "border-slate-700"
                        : "border-gray-200"
                    }`}
                  >

                    <td
                      className={`p-4 ${
                        theme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {new Date(
                        leave.date
                      ).toLocaleDateString()}
                    </td>

                    <td className="p-4 font-semibold text-cyan-500">
                      {leave.leaveType}
                    </td>

                    <td
                      className={`p-4 ${
                        theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-700"
                      }`}
                    >
                      {leave.reason}
                    </td>

                    <td className="p-4 text-center">

                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                          leave.status === "Approved"
                            ? "bg-green-600 text-white"
                            : leave.status === "Rejected"
                            ? "bg-red-600 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {leave.status === "Approved"
                          ? "🟢 Approved"
                          : leave.status === "Rejected"
                          ? "🔴 Rejected"
                          : "🟡 Pending"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>
  );
}

export default EmployeeLeaves;