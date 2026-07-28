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
  BadgeCheck,
  CreditCard,
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

  const paidPercent =
    Number(client.totalAmount || 0) > 0
      ? Math.min(
          (Number(paidAmount || 0) /
            Number(client.totalAmount || 0)) *
            100,
          100
        )
      : 0;

  return (
    <div className="space-y-6">

      

      {/* ================= MAIN GRID ================= */}

      <div className="grid xl:grid-cols-2 gap-6">
                {/* ================= CLIENT INFORMATION ================= */}

        <div
          className={`rounded-3xl border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1
            hover:shadow-xl
            hover:border-blue-500 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2
              className={`text-xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Client Information
            </h2>

            <User
              className={
                theme === "dark"
                  ? "text-blue-400"
                  : "text-blue-600"
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <Info
              icon={<Phone size={18} />}
              label="PHONE"
              value={client.phone || "Not Available"}
            />

            <Info
              icon={<Mail size={18} />}
              label="EMAIL"
              value={client.email || "Not Available"}
            />

            <Info
              icon={<MapPin size={18} />}
              label="ADDRESS"
              value={client.address || "Not Available"}
            />

            <Info
                icon={<BadgeCheck size={18} />}
                label="BOOKING ID"
                value={
                    client.bookingId ||
                    client._id?.slice(-6).toUpperCase() ||
                    "Not Available"
                }
            />

          </div>

        </div>

        {/* ================= EVENT DETAILS ================= */}

        <div
          className={`rounded-3xl border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >

          <div className="flex items-center justify-between mb-6">

            <h2
              className={`text-xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
             Event Details
            </h2>

            <Calendar
              className={
                theme === "dark"
                  ? "text-indigo-400"
                  : "text-indigo-600"
              }
            />

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <Info
              icon={<Calendar size={18} />}
              label="Event Date"
              value={
                client.eventDate
                  ? new Date(
                      client.eventDate
                    ).toLocaleDateString()
                  : "Not Available"
              }
            />

            <Info
              icon={<Package size={18} />}
              label="Package"
              value={client.packageName || "Not Available"}
            />

            <Info
              icon={<Clock size={18} />}
              label="Shoot Time"
              value={client.shootTime || "Not Available"}
            />

            <Info
              icon={<BadgeCheck size={18} />}
              label="Status"
              value={client.status || "Pending"}
            />

          </div>

        </div>
                {/* ================= ASSIGNED TEAM ================= */}

        <div
          className={`rounded-3xl border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">

            <h2
              className={`text-xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
             Assigned Team
            </h2>

            <Camera
              className={
                theme === "dark"
                  ? "text-purple-400"
                  : "text-purple-600"
              }
            />

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            <Info
              icon={<Camera size={18} />}
              label="Photographer"
              value={client.photographer || "Not Assigned"}
            />

            <Info
              icon={<Video size={18} />}
              label="Videographer"
              value={client.videographer || "Not Assigned"}
            />

            <Info
              icon={<Plane size={18} />}
              label="Drone Operator"
              value={client.droneOperator || "Not Assigned"}
            />

            <Info
              icon={<PenTool size={18} />}
              label="Editor"
              value={client.editor || "Not Assigned"}
            />

            <Info
              icon={<User size={18} />}
              label="Assistant"
              value={client.assistant || "Not Assigned"}
            />

            <Info
              icon={<Package size={18} />}
              label="Album Designer"
              value={client.albumDesigner || "Not Assigned"}
            />

          </div>

        </div>

        {/* ================= PAYMENT SUMMARY ================= */}

        <div
          className={`rounded-3xl border p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-3">

              <CreditCard
                className={
                  theme === "dark"
                    ? "text-green-400"
                    : "text-green-600"
                }
              />

              <h2
                className={`text-xl font-bold ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
               Payment Summary
              </h2>

            </div>

            <span
              className={`text-sm font-semibold ${
                theme === "dark"
                  ? "text-green-400"
                  : "text-green-600"
              }`}
            >
              {paidPercent.toFixed(0)}% Paid
            </span>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <AmountCard
              title="Total Amount"
              value={client.totalAmount}
              color="blue"
            />

            <AmountCard
              title="Paid Amount"
              value={paidAmount}
              color="green"
            />

            <AmountCard
              title="Pending Amount"
              value={pending}
              color="red"
            />

          </div>

          <div className="mt-8">

            <div
                className={`w-full h-3 rounded-full overflow-hidden ${
                    theme === "dark"
                        ? "bg-slate-700"
                        : "bg-gray-200"
                }`}
            >

                <div
                    className="h-full rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
                    style={{
                        width: `${paidPercent}%`,
                    }}
                />

            </div>

           <div className="flex justify-between mb-2 text-xs uppercase tracking-wider">
              <span>Paid</span>
              <span>{paidPercent.toFixed(0)}%</span>
          </div>

          <div className="h-3 rounded-full ...">
            ...
          </div>

          <div className="flex justify-between mt-2 text-sm">
              <span className="text-green-500 font-semibold">
                  ₹20,000
              </span>

              <span className="text-red-500 font-semibold">
                  ₹40,000
              </span>
          </div>

        </div>

        </div>

      </div>

    </div>
  );
}
function Info({ icon, label, value }) {
  const { theme } = useTheme();

  return (
    <div
      className={`group flex items-start gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400 ${
        theme === "dark"
          ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
          : "bg-gray-50 border-gray-200 hover:bg-white"
      }`}
    >
      <div
        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-700 text-blue-400 group-hover:bg-blue-600 group-hover:text-white"
            : "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-[11px] uppercase tracking-[0.2em] ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {label}
        </p>

        <p
          className={`mt-1 break-words text-base font-semibold ${
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

function AmountCard({ title, value, color }) {
  const { theme } = useTheme();

  const styles = {
    blue:
      theme === "dark"
        ? "bg-slate-800 border-blue-800 text-blue-400"
        : "bg-blue-50 border-blue-200 text-blue-700",

    green:
      theme === "dark"
        ? "bg-slate-800 border-green-800 text-green-400"
        : "bg-green-50 border-green-200 text-green-700",

    red:
      theme === "dark"
        ? "bg-slate-800 border-red-800 text-red-400"
        : "bg-red-50 border-red-200 text-red-700",
  };

  return (
    <div
      className={`rounded-2xl border p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl ${styles[color]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">
          {title}
        </p>

        <IndianRupee size={18} />
      </div>

      <h2 className="mt-4 text-4xl font-extrabold">
        ₹ {Number(value || 0).toLocaleString("en-IN")}
      </h2>
    </div>
  );
}