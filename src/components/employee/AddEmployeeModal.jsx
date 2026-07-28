import {
  FaTimes,
  FaUserPlus,
  FaUserEdit,
} from "react-icons/fa";
import EmployeeForm from "./EmployeeForm";
import { useTheme } from "../../context/ThemeContext";

function AddEmployeeModal({
  employee,
  onClose,
  onSuccess,
}) {
  const { theme } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-4xl rounded-3xl shadow-2xl border overflow-hidden animate-scaleIn ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Sticky Header */}

        <div
          className={`sticky top-0 z-20 px-8 py-6 border-b flex items-center justify-between ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                employee
                  ? "bg-amber-500"
                  : "bg-blue-600"
              }`}
            >
              {employee ? (
                <FaUserEdit size={28} />
              ) : (
                <FaUserPlus size={28} />
              )}
            </div>

            <div>
              <h2
                className={`text-3xl font-bold ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {employee
                  ? "Edit Employee"
                  : "Add Employee"}
              </h2>

              <p
                className={`mt-1 ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                {employee
                  ? "Update employee details."
                  : "Create a new employee account."}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              theme === "dark"
                ? "bg-slate-800 text-gray-300 hover:bg-red-600 hover:text-white"
                : "bg-gray-100 text-gray-600 hover:bg-red-600 hover:text-white"
            }`}
          >
            <FaTimes />
          </button>
        </div>

        {/* Scroll Area */}

        <div className="max-h-[80vh] overflow-y-auto p-8">
          <EmployeeForm
            employee={employee}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}

export default AddEmployeeModal;