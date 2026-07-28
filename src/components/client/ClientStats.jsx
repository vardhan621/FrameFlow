import {
  Images,
  CheckCircle2,
  IndianRupee,
  Clock3,
  Download,
  Activity,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ClientStats({
  client,
  paidAmount = 0,
}) {
  const { theme } = useTheme();

  if (!client) return null;

  const dark = theme === "dark";

  const totalPhotos =
    (client.rawPhotos?.length || 0) +
    (client.editedPhotos?.length || 0);

  const downloads = client.downloadCount || 0;

  const pending =
    Number(client.totalAmount || 0) -
    Number(paidAmount || 0);

  const completedSteps = [
    client.shootStatus === "Completed",
    client.editingStatus === "Completed",
    client.albumStatus === "Ready",
    client.deliveryStatus === "Delivered",
  ].filter(Boolean).length;

  const stats = [
    {
      title: "Photos",
      value: totalPhotos,
      icon: Images,
      color: "blue",
    },
    {
      title: "Workflow",
      value: `${completedSteps}/4`,
      icon: Activity,
      color: "green",
    },
    {
      title: "Paid",
      value: `₹${paidAmount}`,
      icon: IndianRupee,
      color: "emerald",
    },
    {
      title: "Pending",
      value: `₹${pending}`,
      icon: Clock3,
      color: "orange",
    },
    {
      title: "Downloads",
      value: downloads,
      icon: Download,
      color: "purple",
    },
    {
      title: "Status",
      value: client.status,
      icon: CheckCircle2,
      color: "cyan",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
      {stats.map((item) => (
        <StatCard
          key={item.title}
          {...item}
          dark={dark}
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  dark,
}) {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    emerald: "bg-emerald-500",
    orange: "bg-orange-500",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
  };

  return (
    <div
      className={`rounded-3xl border shadow-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        dark
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-center">

        <div>
          <p
            className={`text-sm ${
              dark
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            {title}
          </p>

          <h3
            className={`mt-2 text-2xl font-bold ${
              dark
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {value}
          </h3>
        </div>

        <div
          className={`h-12 w-12 rounded-2xl flex items-center justify-center text-white ${colors[color]}`}
        >
          <Icon size={22} />
        </div>

      </div>
    </div>
  );
}