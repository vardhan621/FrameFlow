import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Package,
  Hash,
  MoreVertical,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

export default function ClientHero({ client }) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  if (!client) return null;

  const isDark = theme === "dark";

  const statusConfig = {
    Active: {
      icon: <Clock3 size={14} />,
      className: isDark
        ? "bg-blue-500/20 text-blue-400"
        : "bg-blue-100 text-blue-700",
    },
    Completed: {
      icon: <CheckCircle2 size={14} />,
      className: isDark
        ? "bg-green-500/20 text-green-400"
        : "bg-green-100 text-green-700",
    },
    Cancelled: {
      icon: <XCircle size={14} />,
      className: isDark
        ? "bg-red-500/20 text-red-400"
        : "bg-red-100 text-red-700",
    },
  };

  const badge =
    statusConfig[client.status] || statusConfig.Active;

  return (
    <div
      className={`rounded-3xl overflow-hidden border shadow-xl ${
        isDark
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Top Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">

        <div className="flex flex-wrap justify-between gap-6">

          {/* Left */}

          <div className="flex gap-5">

            <button
              onClick={() => navigate(-1)}
              className="h-12 w-12 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="h-20 w-20 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">
              {client.clientName?.charAt(0)}
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                {client.clientName}
              </h1>

              <div className="mt-2 flex flex-wrap gap-4 text-white/90">

                <span className="flex items-center gap-2">
                  <Hash size={16} />
                  {client.clientId}
                </span>

                <span className="flex items-center gap-2">
                  <Package size={16} />
                  {client.packageName}
                </span>

                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {client.eventDate
                    ? new Date(
                        client.eventDate
                      ).toLocaleDateString()
                    : "-"}
                </span>

              </div>

            </div>

          </div>

          {/* Right */}

          <div className="flex flex-col items-end gap-4">

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${badge.className}`}
            >
              {badge.icon}
              {client.status}
            </span>

            <div className="flex gap-3">

              <button className="h-11 w-11 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center">
                <Phone size={18} />
              </button>

              <button className="h-11 w-11 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center">
                <MessageCircle size={18} />
              </button>

              <button className="h-11 w-11 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center">
                <Mail size={18} />
              </button>

              <button className="h-11 w-11 rounded-xl bg-white/20 hover:bg-white/30 transition flex items-center justify-center">
                <MoreVertical size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div
        className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-6 ${
          isDark ? "bg-slate-900" : "bg-white"
        }`}
      >

        <InfoCard
          title="Phone"
          value={client.phone || "-"}
          dark={isDark}
        />

        <InfoCard
          title="Email"
          value={client.email || "-"}
          dark={isDark}
        />

        <InfoCard
          title="Event"
          value={client.eventType || "-"}
          dark={isDark}
        />

        <InfoCard
          title="Package"
          value={client.packageName || "-"}
          dark={isDark}
        />

      </div>

    </div>
  );
}

function InfoCard({ title, value, dark }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        dark
          ? "border-slate-700 bg-slate-800"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <p
        className={`text-xs uppercase tracking-wide ${
          dark ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-2 font-semibold break-all ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}