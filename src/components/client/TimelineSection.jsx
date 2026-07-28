import { useTheme } from "../../context/ThemeContext";
import {
  Clock3,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

export default function TimelineSection({
  timeline = [],
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
        <Clock3
          className={
            theme === "dark"
              ? "text-blue-400"
              : "text-blue-600"
          }
          size={22}
        />

        <h2
          className={`text-xl font-bold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Timeline
        </h2>
      </div>

      {/* Empty State */}

      {timeline.length === 0 ? (
        <div
          className={`text-center py-10 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          No Timeline Available
        </div>
      ) : (
        <div
          className={`relative ml-4 border-l-2 ${
            theme === "dark"
              ? "border-blue-700"
              : "border-blue-200"
          }`}
        >
          {timeline.map((item, index) => (
            <div
              key={item._id || index}
              className="relative mb-8 pl-8"
            >
              {/* Timeline Dot */}

              <div
                className="
                  absolute
                  -left-[11px]
                  top-1
                  w-5
                  h-5
                  rounded-full
                  bg-blue-600
                  flex
                  items-center
                  justify-center
                  text-white
                "
              >
                <CheckCircle2 size={12} />
              </div>

              {/* Card */}

              <div
                className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
                  theme === "dark"
                    ? "bg-slate-800 border-slate-700"
                    : "bg-gray-50 border-gray-200"
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
                      {item.title}
                    </h3>

                    <p
                      className={`mt-1 ${
                        theme === "dark"
                          ? "text-gray-300"
                          : "text-gray-600"
                      }`}
                    >
                      {item.message}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      theme === "dark"
                        ? "bg-blue-900/30 text-blue-400"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <div
                  className={`flex flex-wrap gap-5 mt-4 text-sm ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CalendarDays size={16} />

                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock3 size={16} />

                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}