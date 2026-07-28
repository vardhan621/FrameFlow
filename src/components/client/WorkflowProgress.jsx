import {
  CheckCircle2,
  Camera,
  Wand2,
  BookOpen,
  Truck,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function WorkflowProgress({ client }) {
  const { theme } = useTheme();

  if (!client) return null;

  const dark = theme === "dark";

  const steps = [
    {
      title: "Booking",
      status: "Completed",
      icon: CheckCircle2,
    },
    {
      title: "Shoot",
      status: client.shootStatus || "Pending",
      icon: Camera,
    },
    {
      title: "Editing",
      status: client.editingStatus || "Pending",
      icon: Wand2,
    },
    {
      title: "Album",
      status: client.albumStatus || "Pending",
      icon: BookOpen,
    },
    {
      title: "Delivery",
      status: client.deliveryStatus || "Pending",
      icon: Truck,
    },
  ];

  const getStatus = (status) => {
    if (
      status === "Completed" ||
      status === "Ready" ||
      status === "Delivered"
    )
      return "completed";

    if (
      status === "In Progress" ||
      status === "Designing" ||
      status === "Printing"
    )
      return "progress";

    return "pending";
  };

  return (
    <div
      className={`rounded-3xl border shadow-xl p-6 ${
        dark
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-8 ${
          dark ? "text-white" : "text-gray-900"
        }`}
      >
        Workflow Progress
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">

        {steps.map((step, index) => {

          const Icon = step.icon;

          const state = getStatus(step.status);

          const bg =
            state === "completed"
              ? "bg-green-500"
              : state === "progress"
              ? "bg-blue-500"
              : "bg-gray-400";

          return (
            <div
              key={step.title}
              className="relative flex flex-col items-center"
            >

              <div
                className={`h-16 w-16 rounded-full ${bg} flex items-center justify-center text-white shadow-lg`}
              >
                <Icon size={28} />
              </div>

              <h3
                className={`mt-4 font-semibold ${
                  dark
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                {step.title}
              </h3>

              <p
                className={`text-sm mt-1 ${
                  state === "completed"
                    ? "text-green-500"
                    : state === "progress"
                    ? "text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {step.status}
              </p>

              {index !== steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-8 left-[60%] w-full h-1 bg-gray-300"
                />
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}