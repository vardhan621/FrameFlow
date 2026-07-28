import { useTheme } from "../../context/ThemeContext";
import {
  Camera,
  Wand2,
  BookOpen,
  Truck,
} from "lucide-react";

const getStatusColor = (status, theme) => {
  switch (status) {
    case "Completed":
    case "Ready":
    case "Delivered":
      return theme === "dark"
        ? "bg-green-900/30 text-green-400"
        : "bg-green-100 text-green-700";

    case "In Progress":
      return theme === "dark"
        ? "bg-yellow-900/30 text-yellow-400"
        : "bg-yellow-100 text-yellow-700";

    case "Designing":
      return theme === "dark"
        ? "bg-blue-900/30 text-blue-400"
        : "bg-blue-100 text-blue-700";

    case "Printing":
      return theme === "dark"
        ? "bg-purple-900/30 text-purple-400"
        : "bg-purple-100 text-purple-700";

    default:
      return theme === "dark"
        ? "bg-slate-700 text-gray-300"
        : "bg-gray-100 text-gray-700";
  }
};

export default function WorkflowSection({
  client,
  updateWorkflow,
}) {
  const { theme } = useTheme();

  if (!client) return null;

  return (
    <div
      className={`rounded-3xl shadow-2xl border p-6 transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <h2
        className={`text-xl font-bold mb-6 ${
          theme === "dark"
            ? "text-white"
            : "text-gray-900"
        }`}
      >
        Workflow Progress
      </h2>

      <div className="grid lg:grid-cols-2 gap-6">

        <WorkflowCard
          title="Shoot"
          icon={<Camera size={20} />}
          value={client.shootStatus}
          options={[
            "Pending",
            "In Progress",
            "Completed",
          ]}
          field="shootStatus"
          updateWorkflow={updateWorkflow}
        />

        <WorkflowCard
          title="Editing"
          icon={<Wand2 size={20} />}
          value={client.editingStatus}
          options={[
            "Pending",
            "In Progress",
            "Completed",
          ]}
          field="editingStatus"
          updateWorkflow={updateWorkflow}
        />

        <WorkflowCard
          title="Album"
          icon={<BookOpen size={20} />}
          value={client.albumStatus}
          options={[
            "Pending",
            "Designing",
            "Printing",
            "Ready",
          ]}
          field="albumStatus"
          updateWorkflow={updateWorkflow}
        />

        <WorkflowCard
          title="Delivery"
          icon={<Truck size={20} />}
          value={client.deliveryStatus}
          options={[
            "Pending",
            "Delivered",
          ]}
          field="deliveryStatus"
          updateWorkflow={updateWorkflow}
        />

      </div>
    </div>
  );
}
function WorkflowCard({
  title,
  icon,
  value,
  options,
  field,
  updateWorkflow,
}) {
  const { theme } = useTheme();

  const handleChange = async (e) => {
    await updateWorkflow({
      [field]: e.target.value,
    });
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${
        theme === "dark"
          ? "bg-slate-800 border-slate-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">

        <div
          className={
            theme === "dark"
              ? "text-blue-400"
              : "text-blue-600"
          }
        >
          {icon}
        </div>

        <div className="flex-1">

          <h3
            className={`font-semibold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {title}
          </h3>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              value,
              theme
            )}`}
          >
            {value || "Pending"}
          </span>

        </div>

      </div>

      <select
        value={value || "Pending"}
        onChange={handleChange}
        className={`w-full rounded-xl border px-3 py-3 outline-none transition-all ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700 text-white focus:border-blue-500"
            : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
        }`}
      >
        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}
      </select>

    </div>
  );
}