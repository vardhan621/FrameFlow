import { useTheme } from "../../context/ThemeContext";
import {
  Activity,
  CalendarDays,
  Clock3,
  UserCircle2,
} from "lucide-react";

export default function ActivitySection({
  activities = [],
}) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-3xl shadow-2xl border p-6 transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}

      <div className="flex items-center gap-2 mb-6">
        <Activity
          size={22}
          className={
            theme === "dark"
              ? "text-blue-400"
              : "text-blue-600"
          }
        />

        <h2
          className={`text-xl font-bold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Activity Log
        </h2>
      </div>

      {/* Empty State */}

      {activities.length === 0 ? (
        <div
          className={`text-center py-10 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          No Activities Found
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity._id || index}
              className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 hover:bg-slate-750"
                  : "bg-gray-50 border-gray-200 hover:bg-white"
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {activity.title}
                  </h3>

                  <p
                    className={`mt-1 ${
                      theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    }`}
                  >
                    {activity.message}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    theme === "dark"
                      ? "bg-blue-900/30 text-blue-400"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {activity.type}
                </span>
              </div>

              <div
                className={`flex flex-wrap gap-5 mt-5 text-sm ${
                  theme === "dark"
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />

                  {activity.createdAt
                    ? new Date(
                        activity.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={16} />

                  {activity.createdAt
                    ? new Date(
                        activity.createdAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </div>

                <div className="flex items-center gap-2">
                  <UserCircle2 size={16} />

                  {activity.user?.name ||
                    activity.createdBy ||
                    "System"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}