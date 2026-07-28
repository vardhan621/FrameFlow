import { useTheme } from "../../context/ThemeContext";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Camera,
  Package,
  IndianRupee,
  User,
  Video,
  Plane,
  PenTool,
  Clock,
} from "lucide-react";

export default function ClientInfoCard({
  client,
  paidAmount = 0,
}) {
  const { theme } = useTheme();
 
  if (!client) return null;

  const pending =
    Number(client.totalAmount || 0) -
    Number(paidAmount || 0);

  return (
    <div className={`rounded-3xl shadow-2xl border p-6 transition-all duration-300 ${
      theme === "dark"
        ? "bg-slate-900 border-slate-700"
        : "bg-white border-gray-200"
    }`}>

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className={`text-2xl font-bold ${
            theme === "dark"
                ? "text-white"
                : "text-gray-900"
          }`}>
            {client.clientName}
          </h2>

          <p className={
            theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
          }>
            {client.eventType}
          </p>

        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${
            client.status === "Completed"
                ? theme === "dark"
                ? "bg-green-900/30 text-green-400"
                : "bg-green-100 text-green-700"
                : client.status === "Cancelled"
                ? theme === "dark"
                ? "bg-red-900/30 text-red-400"
                : "bg-red-100 text-red-700"
                : theme === "dark"
                ? "bg-blue-900/30 text-blue-400"
                : "bg-blue-100 text-blue-700"
            }`}
        >
          {client.status}
        </span>

      </div>

      {/* Basic Information */}

      <div className="grid lg:grid-cols-2 gap-5">

        <Info
          icon={<Phone size={18} />}
          label="Phone"
          value={client.phone}
        />

        <Info
          icon={<Mail size={18} />}
          label="Email"
          value={client.email || "-"}
        />

        <Info
          icon={<MapPin size={18} />}
          label="Address"
          value={client.address || "-"}
        />

        <Info
          icon={<Calendar size={18} />}
          label="Event Date"
          value={
            client.eventDate
              ? new Date(client.eventDate).toLocaleDateString()
              : "-"
          }
        />

        <Info
          icon={<Package size={18} />}
          label="Package"
          value={client.packageName}
        />

        <Info
          icon={<Clock size={18} />}
          label="Shoot Time"
          value={client.shootTime || "-"}
        />

      </div>

      <hr className={`my-6 ${
        theme === "dark"
            ? "border-slate-700"
            : "border-gray-200"
        }`} />

      {/* Team */}

      <h3
        className={`font-semibold text-lg mb-4 ${
            theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}
        >
        Assigned Team
      </h3>

      <div className="grid md:grid-cols-2 gap-4">

        <Info
          icon={<Camera size={18} />}
          label="Photographer"
          value={client.photographer || "-"}
        />

        <Info
          icon={<Video size={18} />}
          label="Videographer"
          value={client.videographer || "-"}
        />

        <Info
          icon={<Plane size={18} />}
          label="Drone Operator"
          value={client.droneOperator || "-"}
        />

        <Info
          icon={<PenTool size={18} />}
          label="Editor"
          value={client.editor || "-"}
        />

        <Info
          icon={<User size={18} />}
          label="Assistant"
          value={client.assistant || "-"}
        />

        <Info
          icon={<Package size={18} />}
          label="Album Designer"
          value={client.albumDesigner || "-"}
        />

      </div>

      <hr className={`my-6 ${
        theme === "dark"
            ? "border-slate-700"
            : "border-gray-200"
        }`} />

      {/* Payment */}

      <h3 className={`font-semibold text-lg mb-4 ${
        theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}>
        Payment Summary
      </h3>

      <div className="grid md:grid-cols-3 gap-4">

        <AmountCard
          title="Total"
          value={client.totalAmount}
          color="blue"
        />

        <AmountCard
          title="Paid"
          value={paidAmount}
          color="green"
        />

        <AmountCard
          title="Pending"
          value={pending}
          color="red"
        />

      </div>

    </div>
  );
}

function Info({ icon, label, value }) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex gap-3 p-3 rounded-xl transition ${
        theme === "dark"
          ? "hover:bg-slate-800"
          : "hover:bg-gray-50"
      }`}
    >
      <div
        className={
          theme === "dark"
            ? "mt-1 text-blue-400"
            : "mt-1 text-blue-600"
        }
      >
        {icon}
      </div>

      <div>
        <p
          className={`text-xs ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {label}
        </p>

        <p
          className={`font-medium break-all ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function AmountCard({
  title,
  value,
  color,
}) {
  const { theme } = useTheme();

  const styles = {
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
      className={`rounded-xl p-5 transition-all duration-300 ${styles[color]}`}
    >
      <p className="text-sm opacity-80">
        {title}
      </p>

      <h2 className="text-2xl font-bold flex items-center gap-1 mt-2">
        <IndianRupee size={20} />
        {Number(value || 0).toLocaleString()}
      </h2>
    </div>
  );
}