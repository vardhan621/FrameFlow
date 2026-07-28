import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";
import AddEmployeeModal from "../components/employee/AddEmployeeModal";
import EmployeeTable from "../components/employee/EmployeeTable";
import toast from "react-hot-toast";

function Employees() {
  const { theme } = useTheme();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("new") === "true") {
      setShowModal(true);
    }
  }, [location]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);

    try {
      const res = await API.get("/employee");
      setEmployees(res.data.employees);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Delete ${employee.name}?`)) return;

    try {
      await API.delete(`/employee/${employee._id}`);

      toast.success("Employee Deleted Successfully");

      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <Layout>
      <div
        className={`p-6 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900"
            : "bg-slate-100"
        }`}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">
          <div>
            <p
              className={`text-sm ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Dashboard / Employees
            </p>

            <h1
              className={`text-3xl font-bold mt-1 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Employees
            </h1>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-5 py-3 rounded-xl shadow-md"
          >
            + Add Employee
          </button>
        </div>

        {/* Search Card */}
        <div
          className={`rounded-2xl border p-6 shadow-sm transition mb-6 ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <input
            type="text"
            placeholder="Search Employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full p-3 rounded-xl border outline-none transition ${
              theme === "dark"
                ? "bg-slate-900 border-slate-700 text-white placeholder:text-gray-500 focus:border-blue-500"
                : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
            }`}
          />
        </div>

        {/* Employee Table */}
        <EmployeeTable
          employees={employees.filter((employee) =>
            employee.name
              .toLowerCase()
              .includes(search.toLowerCase())
          )}
          loading={loading}
          onEdit={(employee) => {
            setSelectedEmployee(employee);
            setShowModal(true);
          }}
          onDelete={handleDelete}
        />

        {/* Modal */}
        {showModal && (
          <AddEmployeeModal
            employee={selectedEmployee}
            onClose={() => {
              setShowModal(false);
              setSelectedEmployee(null);
            }}
            onSuccess={async () => {
              await fetchEmployees();

              setShowModal(false);

              setSelectedEmployee(null);

              if (location.search.includes("new=true")) {
                navigate("/dashboard");
              }
            }}
          />
        )}
      </div>
    </Layout>
  );
}

export default Employees;