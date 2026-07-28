import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeAPI from "../services/employeeApi";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import {
  FaArrowLeft,
  FaSearch,
  FaTasks,
} from "react-icons/fa";

function EmployeeTasks() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await EmployeeAPI.get("/task/employee");

      setTasks(res.data.tasks || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await EmployeeAPI.put(`/task/${id}/status`, {
        status,
      });

      toast.success("Task Updated");

      fetchTasks();
    } catch (err) {
      console.log(err);
      toast.error("Update Failed");
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        task.description
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        task.client?.clientName
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || task.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-2xl transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-gray-900"
        }`}
      >
        Loading Tasks...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-8 transition-colors duration-300 ${
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
            My Tasks
          </h1>

          <p
            className={`mt-2 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            View and manage your assigned tasks
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

      {/* Search & Filter */}

      <div className="grid md:grid-cols-2 gap-4 mb-8">

        <div className="relative">

          <FaSearch
            className={`absolute left-4 top-4 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          />

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            }`}
          />

        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`px-4 py-3 rounded-xl border outline-none transition-all duration-300 ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          <option value="All">All Tasks</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

      </div>
            {/* Tasks */}

      {filteredTasks.length === 0 ? (

        <div
          className={`rounded-2xl p-12 text-center border ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <FaTasks
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
            No Tasks Found
          </h2>

          <p
            className={`mt-3 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}
          >
            There are no tasks matching your search or filter.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          {filteredTasks.map((task) => (

            <div
              key={task._id}
              className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-gray-200"
              }`}
            >

              <div className="flex justify-between items-start mb-4">

                <div>

                  <h2
                    className={`text-xl font-bold ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </h2>

                  <p
                    className={`mt-2 ${
                      theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {task.description}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    task.priority === "High"
                      ? "bg-red-600 text-white"
                      : task.priority === "Medium"
                      ? "bg-yellow-600 text-white"
                      : "bg-green-600 text-white"
                  }`}
                >
                  {task.priority === "High"
                    ? "🔴 High"
                    : task.priority === "Medium"
                    ? "🟡 Medium"
                    : "🟢 Low"}
                </span>

              </div>

              <div className="space-y-2">

                <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  <strong>Category:</strong> {task.category}
                </p>

                {task.client && (
                  <>
                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                      <strong>Client:</strong> {task.client.clientName}
                    </p>

                    <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                      <strong>Event:</strong> {task.client.eventType}
                    </p>
                  </>
                )}

                <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
                  <strong>Due Date:</strong>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>

              </div>

              <div className="mt-5">

                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    task.status === "Completed"
                      ? "bg-green-600 text-white"
                      : task.status === "In Progress"
                      ? "bg-yellow-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  {task.status === "Pending"
                    ? "🟡 Pending"
                    : task.status === "In Progress"
                    ? "🟠 In Progress"
                    : "🟢 Completed"}
                </span>

              </div>

              <div className="mt-6">

                {task.status === "Pending" && (

                  <button
                    onClick={() =>
                      updateStatus(task._id, "In Progress")
                    }
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    ▶ Start Task
                  </button>

                )}

                {task.status === "In Progress" && (

                  <button
                    onClick={() =>
                      updateStatus(task._id, "Completed")
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    ✅ Complete Task
                  </button>

                )}

                {task.status === "Completed" && (

                  <button
                    disabled
                    className="w-full bg-gray-500 text-white py-3 rounded-xl cursor-not-allowed"
                  >
                    ✔ Completed
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default EmployeeTasks;