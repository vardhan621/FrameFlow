import { FaEdit, FaTrash, FaUserCircle } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

function EmployeeTable({
  employees,
  loading,
  onEdit,
  onDelete,
}) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <div
        className={`mt-6 rounded-2xl border shadow-sm p-10 text-center transition-all ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700 text-gray-300"
            : "bg-white border-gray-200 text-gray-600"
        }`}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-gray-400/30 rounded mx-auto"></div>
          <div className="h-4 w-72 bg-gray-400/20 rounded mx-auto"></div>
        </div>

        <p className="mt-6 text-lg font-medium">
          Loading Employees...
        </p>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div
        className={`mt-6 rounded-2xl border shadow-sm p-12 text-center transition-all ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <FaUserCircle
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
          No Employees Found
        </h2>

        <p
          className={`mt-3 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-600"
          }`}
        >
          Click the <b>Add Employee</b> button to create your first employee.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`mt-6 rounded-2xl border overflow-hidden shadow-sm transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead
            className={`${
              theme === "dark"
                ? "bg-slate-900"
                : "bg-gray-100"
            }`}
          >
            <tr>

              <th
                className={`px-6 py-4 text-left uppercase tracking-wider text-xs font-semibold ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                Employee
              </th>

              <th
                className={`px-6 py-4 text-left uppercase tracking-wider text-xs font-semibold ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                Role
              </th>

              <th
                className={`px-6 py-4 text-left uppercase tracking-wider text-xs font-semibold ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                Phone
              </th>

              <th
                className={`px-6 py-4 text-left uppercase tracking-wider text-xs font-semibold ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                Salary
              </th>

              <th
                className={`px-6 py-4 text-center uppercase tracking-wider text-xs font-semibold ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                Status
              </th>

              <th
                className={`px-6 py-4 text-center uppercase tracking-wider text-xs font-semibold ${
                  theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-600"
                }`}
              >
                Actions
              </th>

            </tr>

          </thead>

          <tbody>
                      {employees.map((employee) => (
              <tr
                key={employee._id}
                className={`transition-all duration-300 hover:shadow-sm ${
                  theme === "dark"
                    ? "border-t border-slate-700 hover:bg-slate-700/40"
                    : "border-t border-gray-200 hover:bg-gray-50"
                }`}
              >
                {/* Employee */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {employee.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div>
                      <p
                        className={`font-semibold ${
                          theme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {employee.name}
                      </p>

                      <p
                        className={`text-xs ${
                          theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-500"
                        }`}
                      >
                        {employee.email || "No Email"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td
                  className={`px-6 py-4 ${
                    theme === "dark"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {employee.role}
                </td>

                {/* Phone */}
                <td
                  className={`px-6 py-4 ${
                    theme === "dark"
                      ? "text-gray-300"
                      : "text-gray-700"
                  }`}
                >
                  {employee.phone}
                </td>

                {/* Salary */}
                <td className="px-6 py-4">
                  <span className="font-semibold text-green-600">
                    ₹ {Number(employee.salary || 0).toLocaleString("en-IN")}
                  </span>

                  <p
                    className={`text-xs ${
                      theme === "dark"
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    per month
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                      employee.status === "Active"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                    }`}
                  >
                    {employee.status === "Active" ? "🟢" : "🔴"}
                    {employee.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3">

                    <button
                      onClick={() => onEdit(employee)}
                      title="Edit Employee"
                      className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => onDelete(employee)}
                      title="Delete Employee"
                      className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    >
                      <FaTrash />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeTable;