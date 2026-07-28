import Layout from "../components/layout/Layout.jsx";
import PriorityCenter from "../components/dashboard/PriorityCenter";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import StatCard from "../components/dashboard/StatCard";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import { formatDistanceToNow } from "date-fns";
import {
  FiUsers,
  FiCamera,
  FiDollarSign,
  FiHardDrive,
  FiCalendar,
  FiTrendingUp,
  FiEdit,
  FiBookOpen,
  FiTruck,
  FiUserCheck,
  FiUpload,
  FiCreditCard,
  FiPhone,
  FiMessageCircle,
  FiEye
} from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useTheme } from "../context/ThemeContext";
import { Line, Bar, Pie } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);
function Dashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalEmployees: 0,

    upcomingEvents: 0,
    todayEvents: 0,
    tomorrowEvents: 0,
    completedEvents: 0,

    pendingShoots: 0,
    pendingEditing: 0,
    pendingAlbum: 0,
    pendingDelivery: 0,

    totalRevenue: 0,
    totalExpense: 0,
    netProfit: 0,
    pendingPayments: 0,
    todayClients: [],
    monthlyRevenue: [],
    monthlyExpense: [],
    recentActivities: [],
    overdueEditing: [],
    thisMonthRevenue: 0,
    thisMonthExpense:0,
    activeEmployees: 0,
    storageUsed: 0,
    storageLimit: 100,
    packageChart: [],
    monthlyBookings: [],
    upcomingEventList: [],
    todayPriority: [],
    tomorrowPriority: [],
    paymentPriority: [],
    deliveryPriority: [],
  });
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [studio, setStudio] = useState(null);
  
  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [dashboardRes, studioRes] = await Promise.all([
        API.get("/dashboard"),
        API.get("/settings"),
      ]);

      setStats(dashboardRes.data);
      setStudio(studioRes.data.studio);

    } catch (error) {
      console.log(error);
    }
  };
  const chartData = {
    labels: stats.monthlyRevenue?.map(item => item.month) || [],

    datasets: [
      {
        label: "Revenue",
        data: stats.monthlyRevenue?.map(item => item.revenue) || [],
        borderColor: "#10B981",
        backgroundColor: "rgba(16,185,129,0.15)",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Expense",
        data: stats.monthlyExpense?.map(item => item.expense) || [],
        borderColor: "#EF4444",
        backgroundColor: "rgba(239,68,68,0.15)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: theme === "dark" ? "#fff" : "#111827",
          font: {
            size: 14,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: function (context) {
              return `${context.dataset.label}: ₹${context.raw.toLocaleString()}`;
          },
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#4B5563",
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.08)",
        },
      },

      y: {
        ticks: {
          color: theme === "dark" ? "#9CA3AF" : "#4B5563",
          callback: function (value) {
            return "₹" + value.toLocaleString();
          },
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.08)",
        },
      },
    },
  };
  const bookingChartData = {
    labels: stats.monthlyBookings.map((item) => item.month),

    datasets: [
      {
        label: "Bookings",

        data: stats.monthlyBookings.map(
          (item) => item.bookings
        ),

        backgroundColor: "#3B82F6",
      },
    ],
  };
  const packagePieData = {
    labels: stats.packageChart.map(
      (item) => item.name
    ),

    datasets: [
      {
        data: stats.packageChart.map(
          (item) => item.value
        ),

        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#06B6D4",
        ],
      },
    ],
  };
  const hasRevenue =
  stats.monthlyRevenue?.some(item => item.revenue > 0) ||
  stats.monthlyExpense?.some(item => item.expense > 0);
  const getActivityIcon = (type) => {
    switch (type) {
      case "payment":
        return <FiDollarSign className="text-green-500 text-xl" />;

      case "workflow":
        return <FiEdit className="text-orange-500 text-xl" />;

      case "album":
        return <FiBookOpen className="text-pink-500 text-xl" />;

      case "delivery":
        return <FiTruck className="text-yellow-500 text-xl" />;

      case "upload":
        return <FiUpload className="text-blue-500 text-xl" />;

      case "client":
        return <FiUsers className="text-cyan-500 text-xl" />;

      default:
        return <FiCamera className="text-white text-xl" />;
    }
  };
  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">

        <div className="flex items-center gap-5">

          {studio?.logo ? (

            <img
              src={studio.logo}
              alt="Studio Logo"
              className="w-20 h-20 rounded-xl bg-white object-contain p-2 shadow-lg"
            />

          ) : (

            <div
              className={`w-20 h-20 rounded-xl flex items-center justify-center text-4xl ${
                theme === "dark"
                  ? "bg-slate-800"
                  : "bg-gray-200"
              }`}
            >
              📸
            </div>

          )}

          <div>

            <h1
              className={`text-3xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {studio?.studioName || "FrameFlow Studio"}
            </h1>

            <p
              className={`mt-1 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              Welcome back, {studio?.ownerName || "Admin"} 👋
            </p>

          </div>

        </div>

      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <button
          onClick={() => navigate("/clients?new=true")}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
        >
          + Add Client
        </button>

        <button
          onClick={() => navigate("/payments?new=true")}
          className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
        >
          + Add Payment
        </button>

        <button
          onClick={() => navigate("/expenses?new=true")}
          className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
        >
          + Add Expense
        </button>

        <button
          onClick={() => navigate("/employees?new=true")}
          className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold"
        >
          + Add Employee
        </button>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          icon={<FiUsers />}
          color="text-blue-500"
        />

        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<FiUserCheck />}
          color="text-indigo-500"
        />
        <StatCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={<FiUserCheck />}
          color="text-green-500"
        />
        <StatCard
          title="Today's Shoots"
          value={stats.todayEvents}
          icon={<FiCalendar />}
          color="text-cyan-500"
        />

        <StatCard
          title="Tomorrow's Shoots"
          value={stats.tomorrowEvents}
          icon={<FiCalendar />}
          color="text-sky-500"
        />

        <StatCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={<FiCamera />}
          color="text-green-500"
        />

        <StatCard
          title="Completed Events"
          value={stats.completedEvents}
          icon={<FiHardDrive />}
          color="text-purple-500"
        />

        <StatCard
          title="Pending Shoots"
          value={stats.pendingShoots}
          icon={<FiCamera />}
          color="text-red-500"
        />

        <StatCard
          title="Pending Editing"
          value={stats.pendingEditing}
          icon={<FiEdit />}
          color="text-orange-500"
        />

        <StatCard
          title="Pending Album"
          value={stats.pendingAlbum}
          icon={<FiBookOpen />}
          color="text-pink-500"
        />

        <StatCard
          title="Pending Delivery"
          value={stats.pendingDelivery}
          icon={<FiTruck />}
          color="text-yellow-500"
        />

        <StatCard
          title="Pending Payments"
          value={`₹${stats.pendingPayments.toLocaleString()}`}
          icon={<FiDollarSign />}
          color="text-amber-500"
        />
        <StatCard
          title="This Month Revenue"
          value={`₹${stats.thisMonthRevenue.toLocaleString()}`}
          icon={<FiTrendingUp />}
          color="text-lime-500"
        />
        <StatCard
          title="This Month Expense"
          value={`₹${stats.thisMonthExpense.toLocaleString()}`}
          icon={<FiCreditCard />}
          color="text-orange-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<FiTrendingUp />}
          color="text-emerald-500"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${stats.totalExpense.toLocaleString()}`}
          icon={<FiCreditCard />}
          color="text-red-500"
        />

        <StatCard
          title="Net Profit"
          value={`₹${stats.netProfit.toLocaleString()}`}
          icon={<FiTrendingUp />}
          color={
            stats.netProfit >= 0
              ? "text-green-500"
              : "text-red-500"
          }
        />

      </div>
      <PriorityCenter stats={stats} />
      <div
        className={`mt-10 rounded-xl p-6 border transition-colors ${
          theme === "dark"
            ? "bg-[#111827] border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Workflow Progress
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <div className={`flex justify-between mb-2 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
            }`}>
              <span>Pending Shoots</span>
              <span>{stats.pendingShoots}</span>
            </div>

            <div className={`w-full rounded-full h-3 ${
              theme === "dark"
                ? "bg-gray-700"
                : "bg-gray-300"
            }`}>
              <div
                className="bg-red-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (stats.pendingShoots /
                      Math.max(stats.totalClients, 1)) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div
              className={`flex justify-between mb-2 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              <span>Pending Editing</span>
              <span>{stats.pendingEditing}</span>
            </div>

            <div
              className={`w-full rounded-full h-3 ${
                theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-300"
              }`}
            >
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (stats.pendingEditing /
                      Math.max(stats.totalClients, 1)) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div
              className={`flex justify-between mb-2 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              <span>Pending Album</span>
              <span>{stats.pendingAlbum}</span>
            </div>

            <div
              className={`w-full rounded-full h-3 ${
                theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-300"
              }`}
            >
              <div
                className="bg-pink-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (stats.pendingAlbum /
                      Math.max(stats.totalClients, 1)) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div
              className={`flex justify-between mb-2 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              <span>Pending Delivery</span>
              <span>{stats.pendingDelivery}</span>
            </div>

            <div
              className={`w-full rounded-full h-3 ${
                theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-300"
              }`}
            >
              <div
                className="bg-yellow-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    (stats.pendingDelivery /
                      Math.max(stats.totalClients, 1)) *
                      100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

        </div>
      </div>
            <TodaySchedule clients={stats.todayClients} />
      <div
        className={`mt-10 rounded-xl p-6 transition-colors ${
          theme === "dark"
            ? "bg-[#111827]"
            : "bg-white border border-gray-200"
        }`}
      >

        <h2
          className={`text-xl font-semibold mb-5 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Upcoming Events
        </h2>

        {stats.upcomingEventList.length === 0 ? (

          <p
            className={
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }
          >
            No upcoming events
          </p>

        ) : (

          stats.upcomingEventList.map((client) => (

            <div
              key={client._id}
              className={`border-b py-5 ${
              theme === "dark"
                ? "border-gray-700"
                : "border-gray-200"
             }`}
            >

            {/* Top Row */}
            <div className="flex justify-between items-center">

              <div>
                <h3 className={`text-xl font-semibold ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}>
                  {client.clientName}
                </h3>
              </div>

              <div className="flex items-center gap-6">

                <span className="text-cyan-400 font-medium whitespace-nowrap">
                  {new Date(client.eventDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                  🟢 {Math.ceil(
                    (new Date(client.eventDate) - new Date()) /
                    (1000 * 60 * 60 * 24)
                  )} Days Left
                </span>

              </div>

            </div>

            {/* Event */}
            <p className={`mt-2 ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }`}>
              {client.eventType}
            </p>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">

              <a
                href={`tel:${client.phone}`}
                className="bg-green-600 hover:bg-green-700 px-5 h-11 rounded-lg flex items-center gap-2 text-white"
              >
                <FiPhone />
                Call
              </a>

              <a
                href={`https://wa.me/91${client.phone}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 px-5 h-11 rounded-lg flex items-center gap-2 text-white"
              >
                <FiMessageCircle />
                WhatsApp
              </a>

              <button
                onClick={() => navigate(`/clients/${client._id}`)}
                className="bg-blue-600 hover:bg-blue-700 px-5 h-11 rounded-lg flex items-center gap-2 text-white"
              >
                <FiEye />
                Open
              </button>

            </div>

          </div>

          ))

        )}
       
      </div>
      <div
        className={`mt-10 rounded-xl p-6 transition-colors ${
          theme === "dark"
            ? "bg-[#111827]"
            : "bg-white border border-gray-200"
        }`}
      >

        <div className="flex justify-between items-center mb-5">
          <h2
            className={`text-xl font-semibold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Revenue vs Expense
          </h2>
          <div className="flex gap-6">
            <span className="text-green-400">
              Revenue ₹{stats.totalRevenue.toLocaleString()}
            </span>

            <span className="text-red-400">
              Expense ₹{stats.totalExpense.toLocaleString()}
            </span>

            <span
              className={
                stats.netProfit >= 0
                  ? "text-blue-400"
                  : "text-red-400"
              }
            >
              Profit ₹{stats.netProfit.toLocaleString()}
            </span>
          </div>

        </div>
                
        {hasRevenue ? (
          <div className="h-96">
              <Line
                data={chartData}
                options={chartOptions}
              />
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center text-gray-400">
              No revenue or expense data available
          </div>
        )}

      </div>
      <div className="grid lg:grid-cols-2 gap-6 mt-10">

        <div
          className={`rounded-xl p-6 ${
            theme === "dark"
              ? "bg-[#111827]"
              : "bg-white border border-gray-200"
          }`}
        >

          <h2
            className={`text-xl mb-5 ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Monthly Bookings
          </h2>

          <Bar data={bookingChartData} />

        </div>

        <div
          className={`rounded-xl p-6 ${
            theme === "dark"
              ? "bg-[#111827]"
              : "bg-white border border-gray-200"
          }`}
        >

          <h2
            className={`text-xl mb-5 ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Package Distribution
          </h2>

          <Pie data={packagePieData} />

        </div>

      </div>
      <div
        className={`mt-10 rounded-xl p-6 border transition-colors ${
          theme === "dark"
            ? "bg-[#111827] border-red-600"
            : "bg-white border-red-300"
        }`}
      >

        <h2 className="text-xl font-semibold text-red-400 mb-5">
          ⚠ Overdue Editing
        </h2>

        {stats.overdueEditing.length === 0 ? (

          <p
            className={
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }
          >
            No overdue editing work.
          </p>

        ) : (

          <div className="space-y-4">

            {stats.overdueEditing.map(client => (

              <div
                key={client._id}
                className={`flex justify-between border-b pb-3 ${
                  theme === "dark"
                    ? "border-gray-700"
                    : "border-gray-200"
                }`}
              >

                <div>

                  <p className={`font-medium ${
                    theme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}>
                    {client.clientName}
                  </p>

                  <p className={`text-sm ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}>
                    {client.eventType}
                  </p>

                </div>

                <span className="text-red-400 font-semibold">
                  {client.days} days
                </span>

              </div>

            ))}

          </div>

        )}

      </div>
      <div
        className={`mt-10 rounded-xl p-6 ${
          theme === "dark"
            ? "bg-[#111827]"
            : "bg-white border border-gray-200"
        }`}
      >

        <h2
          className={`text-xl font-semibold mb-5 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Storage Usage
        </h2>

        <div className={`w-full rounded-full h-4 ${
          theme === "dark"
            ? "bg-gray-700"
            : "bg-gray-300"
        }`}>

          <div
            className="bg-cyan-500 h-4 rounded-full"
            style={{
              width: `${Math.min(
                (stats.storageUsed /Math.max(stats.storageLimit,1)) * 100,
                100
              )}%`,
            }}
          />

        </div>

        <p className="text-cyan-400 mt-2">
          {Math.round(
            (stats.storageUsed /
            Math.max(stats.storageLimit,1))*100
          )}
          % Used
        </p>

      </div>

      <div
        className={`mt-10 rounded-xl p-6 border transition-colors ${
          theme === "dark"
            ? "bg-[#111827] border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >

        <h2
          className={`text-xl font-semibold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Recent Activity
        </h2>

        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">

          {stats.recentActivities.length === 0 ? (

            <p
              className={`text-center py-8 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-600"
              }`}
            >
              No recent activity
            </p>

          ) : (

            stats.recentActivities.map((item) => (

              <div
                key={item._id}
                onClick={() => {
                  if (item.client?._id) {
                    navigate(`/clients/${item.client._id}`);
                  }
                }}
                className={`flex items-start gap-4 border-b pb-4 rounded-lg p-2 transition cursor-pointer ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-slate-800"
                    : "border-gray-200 hover:bg-gray-100"
                }`}
              >

                <div>
                  {getActivityIcon(item.type)}
                </div>

                <div className="flex-1">

                  <p className={`font-semibold ${
                    theme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}>
                    {item.title}
                  </p>

                  <p className={`text-sm mt-1 ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}>
                    {item.message}
                  </p>

                </div>

                <span className={`text-xs whitespace-nowrap ${
                  theme === "dark"
                    ? "text-gray-500"
                    : "text-gray-500"
                }`}>
                  {formatDistanceToNow(
                    new Date(item.createdAt),
                    { addSuffix: true }
                  )}
                </span>

              </div>

            ))

          )}

        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;