import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaTrash } from "react-icons/fa";
import EmployeeAPI from "../services/employeeApi";
import toast from "react-hot-toast";
import ApplyLeaveModal from "../components/employee/ApplyLeaveModal";
import socket from "../socket";
import { useTheme } from "../context/ThemeContext";
function EmployeeDashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [todayShoots, setTodayShoots] = useState([]);
  const [upcomingShoots, setUpcomingShoots] = useState([]);

  const [completed, setCompleted] = useState(0);
  const [pending, setPending] = useState(0);

  const [showLeave, setShowLeave] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  
  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("employee"));

  if (!data) {
    navigate("/employee/login");
    return;
  }

  setEmployee(data);

  socket.on("connect", () => {
    console.log("✅ Socket Connected:", socket.id);

    console.log("Joining Employee Room:", data._id);

    socket.emit("joinEmployee", data._id);
  });

  socket.on("newNotification", (notification) => {
    console.log("🔔 Notification Received", notification);

    fetchNotifications();

    const audio = new Audio("/notification.wav");

    audio.volume = 1;

    audio.play()
      .then(() => console.log("✅ Sound Played"))
      .catch((err) => console.log("❌ Audio Error:", err));
  });

  fetchDashboard();
  fetchNotifications();

  return () => {
    socket.off("connect");
    socket.off("newNotification");
  };

}, [navigate]);
  // ================= Dashboard =================

  const fetchDashboard = async () => {
    try {
      const res = await EmployeeAPI.get("/employee/dashboard");

      setTodayShoots(res.data.todayShoots || []);
      setUpcomingShoots(res.data.upcomingShoots || []);
      setCompleted(res.data.completed || 0);
      setPending(res.data.pending || 0);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ================= Notifications =================

  const fetchNotifications = async () => {
    try {

      const res = await EmployeeAPI.get("/notification/employee");

      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);

    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead = async () => {
    try {

      await EmployeeAPI.put("/notification/employee/read-all");

      fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  const clearAllNotifications = async () => {
    try {

      await EmployeeAPI.delete("/notification/employee/clear");

      fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteNotification = async (id) => {
    try {

      await EmployeeAPI.delete(`/notification/employee/${id}`);

      fetchNotifications();

    } catch (err) {
      console.log(err);
    }
  };

  const handleNotificationClick = async (item) => {

    try {

      if (!item.isRead) {
        await EmployeeAPI.put(
          `/notification/employee/${item._id}/read`
        );
      }

      fetchNotifications();

      setShowNotifications(false);

      switch (item.type) {

        case "task":
          navigate("/employee/tasks");
          return;

        case "leave":
          navigate("/employee/leaves");
          return;

        default:
          navigate("/employee/dashboard");
      }

    } catch (err) {
      console.log(err);
    }
  };

  // ================= Shoot Status =================

  const updateShootStatus = async (clientId, status) => {
    try {

      await EmployeeAPI.put(`/client/${clientId}`, {
        shootStatus: status,
      });

      toast.success("Status Updated");

      fetchDashboard();

    } catch (err) {
      console.log(err);
      toast.error("Update Failed");
    }
  };

  // ================= Logout =================

  const logout = () => {
    localStorage.removeItem("employee");
    localStorage.removeItem("employeeToken");

    navigate("/employee/login");
  };

  if (!employee || loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center text-2xl transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-gray-900"
        }`}
      >
        Loading...
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

    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-8">

      <div>

        <h1 className={`text-3xl font-bold ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}>
          Welcome {employee.name}
        </h1>

        <p className={`mt-2 ${
          theme === "dark"
            ? "text-gray-400"
            : "text-gray-600"
        }`}>
          {employee.role}
        </p>

      </div>

      <div className="flex items-center gap-4 relative">

        {/* Notification Bell */}

        <button
          onClick={() =>
            setShowNotifications(!showNotifications)
          }
          className={`relative text-2xl transition-transform duration-300 hover:scale-110 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          <FaBell />

          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}

        </button>

        {/* Notification Popup */}

        {showNotifications && (

          <div className={`absolute top-14 right-0 w-[380px] max-w-[95vw] rounded-2xl shadow-xl border z-50 ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}>

            {/* Header */}

            <div className={`flex justify-between items-center p-4 border-b ${
              theme === "dark"
                ? "border-slate-700"
                : "border-gray-200"
            }`}>

              <h2 className={`font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}>
                Notifications
              </h2>

              <div className="flex gap-3">

                <button
                  onClick={markAllRead}
                  className="text-blue-400 text-sm"
                >
                  Mark All
                </button>

                <button
                  onClick={clearAllNotifications}
                  className="text-red-400 text-sm"
                >
                  Clear
                </button>

              </div>

            </div>

            {/* Notifications */}

            <div className="max-h-96 overflow-y-auto">

              {notifications.length === 0 ? (

                <div className={`p-5 text-center ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}>
                  No Notifications
                </div>

              ) : (

                notifications.map((item) => (

                  <div
                    key={item._id}
                    onClick={() =>
                      handleNotificationClick(item)
                    }
                    className={`cursor-pointer border-b p-4 transition-all duration-300 ${
                      theme === "dark"
                        ? `border-slate-700 hover:bg-slate-700 ${
                            item.isRead ? "" : "bg-slate-700"
                          }`
                        : `border-gray-200 hover:bg-gray-100 ${
                            item.isRead ? "" : "bg-blue-50"
                          }`
                    }`}
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <div className="flex items-center gap-2">

                          {!item.isRead && (
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          )}

                          <h3 className={`font-semibold ${
                            theme === "dark"
                              ? "text-white"
                              : "text-gray-900"
                          }`}>
                            {item.title}
                          </h3>

                        </div>

                        <p className={`text-sm mt-1 ${
                          theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}>
                          {item.message}
                        </p>

                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(item._id);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        )}

        {/* Leave */}

        <button
          onClick={() => setShowLeave(true)}
          className="bg-yellow-600 hover:bg-yellow-700 px-5 py-2 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:scale-105"        >
          Apply Leave
        </button>

        {/* Logout */}

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Logout
        </button>

      </div>

    </div>

    {/* Stats */}

    <div className="grid md:grid-cols-3 gap-6 mb-8">

      <div className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
        theme === "dark"
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200"
      }`}>

        <h2 className={`text-xl font-bold ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}>
          Assigned Clients
        </h2>

        <p className="text-4xl text-blue-400 mt-4">
          {todayShoots.length + upcomingShoots.length}
        </p>

      </div>

      <div
        className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Pending Work
        </h2>

        <p className="text-4xl text-yellow-400 mt-4">
          {pending}
        </p>
      </div>

      <div
        className={`rounded-2xl p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Completed
        </h2>

        <p className="text-4xl text-green-400 mt-4">
          {completed}
        </p>
      </div>

    </div>

    {/* Today's Shoots */}
          {/* Apply Leave Modal */}

      {showLeave && (
        <ApplyLeaveModal
          employeeId={employee._id}
          onClose={() => setShowLeave(false)}
          onSuccess={() => {
            setShowLeave(false);
            toast.success("Leave Applied");
            fetchNotifications();
          }}
        />
      )}
      {/* Today's & Upcoming Shoots */}

      <div className="grid lg:grid-cols-2 gap-6 mt-8">

        {/* Today's Shoots */}

        <div
          className={`rounded-2xl border p-6 shadow-sm ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-5 ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            📅 Today's Shoots
          </h2>

          {todayShoots.length === 0 ? (
            <p
              className={`${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              No shoots scheduled today.
            </p>
          ) : (
            <div className="space-y-4">
              {todayShoots.map((shoot) => (
                <div
                  key={shoot._id}
                  className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-900"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3
                        className={`font-semibold ${
                          theme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {shoot.clientName}
                      </h3>

                      <p
                        className={`text-sm ${
                          theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {shoot.eventType}
                      </p>

                      <p
                        className={`text-sm ${
                          theme === "dark"
                            ? "text-gray-500"
                            : "text-gray-500"
                        }`}
                      >
                        {shoot.time}
                      </p>
                    </div>

                    <select
                      value={shoot.shootStatus}
                      onChange={(e) =>
                        updateShootStatus(
                          shoot._id,
                          e.target.value
                        )
                      }
                      className={`px-3 py-2 rounded-xl border font-medium outline-none transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-slate-800 border-slate-600 text-white focus:border-blue-500"
                          : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
                      }`}
                    >
                      <option value="Pending">🟡 Pending</option>
                      <option value="Started">🔵 Started</option>
                      <option value="Completed">🟢 Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Shoots */}

        <div
          className={`rounded-2xl border p-6 shadow-sm ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-5 ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            📆 Upcoming Shoots
          </h2>

          {upcomingShoots.length === 0 ? (
            <p
              className={`${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              No upcoming shoots.
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingShoots.map((shoot) => (
                <div
                  key={shoot._id}
                  className={`rounded-xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    theme === "dark"
                      ? "border-slate-700 bg-slate-900"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <h3
                    className={`font-semibold ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {shoot.clientName}
                  </h3>

                  <p
                    className={`text-sm ${
                      theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-600"
                    }`}
                  >
                    {shoot.eventType}
                  </p>

                  <p
                    className={`text-sm ${
                      theme === "dark"
                        ? "text-gray-500"
                        : "text-gray-500"
                    }`}
                  >
                    {shoot.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

export default EmployeeDashboard;


