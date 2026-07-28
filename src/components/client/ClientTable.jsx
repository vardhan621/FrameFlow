import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Phone,
  Mail,
} from "lucide-react";

function ClientTable({
  clients,
  loading,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const getBadge = (status) => {
    switch (status) {
      case "Completed":
      case "Ready":
      case "Delivered":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";

      case "In Progress":
      case "Printing":
      case "Designing":
      case "Editing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";

      case "Pending":
      case "Pending Shoot":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";

      case "Cancelled":
      case "Inactive":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";

      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getEventBadge = (event) => {
    switch (event) {
      case "Wedding":
        return "bg-pink-100 text-pink-700";

      case "Reception":
        return "bg-blue-100 text-blue-700";

      case "Birthday":
        return "bg-orange-100 text-orange-700";

      case "Engagement":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div
      className={`mt-6 rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="overflow-x-auto">

        <table className="w-full min-w-[1250px]">

          {/* Header */}

          <thead
            className={`sticky top-0 z-10 ${
              theme === "dark"
                ? "bg-slate-900 text-gray-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <tr>
              <th className="px-6 py-4 text-left w-[340px] font-semibold">
                Client
              </th>

              <th className="px-4 py-4 text-center">
                Shoot
              </th>

              <th className="px-4 py-4 text-center">
                Editing
              </th>

              <th className="px-4 py-4 text-center">
                Album
              </th>

              <th className="px-4 py-4 text-center">
                Delivery
              </th>

              <th className="px-4 py-4 text-center">
                Status
              </th>

              <th className="px-6 py-4 text-center w-[170px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {/* Loading */}

            {loading ? (
              [...Array(6)].map((_, index) => (
                <tr
                  key={index}
                  className={`border-t ${
                    theme === "dark"
                      ? "border-slate-700"
                      : "border-gray-200"
                  }`}
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4 animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-slate-600"></div>

                      <div className="space-y-2">
                        <div className="w-40 h-4 rounded bg-gray-300 dark:bg-slate-600"></div>

                        <div className="w-28 h-3 rounded bg-gray-200 dark:bg-slate-700"></div>

                        <div className="w-24 h-3 rounded bg-gray-200 dark:bg-slate-700"></div>
                      </div>
                    </div>
                  </td>

                  <td colSpan={6}>
                    <div className="h-10"></div>
                  </td>
                </tr>
              ))
            ) : clients.length === 0 ? (

              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center"
                >
                  <div className="text-6xl mb-4">
                    📂
                  </div>

                  <h2
                    className={`text-2xl font-bold ${
                      theme === "dark"
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    No Clients Found
                  </h2>

                  <p
                    className={`mt-2 ${
                      theme === "dark"
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    Start by adding your first client.
                  </p>
                </td>
              </tr>

            ) : (
              clients.map((client) => (
  <tr
    key={client._id}
    className={`transition-all duration-300 ${
      theme === "dark"
        ? "border-t border-slate-700 hover:bg-slate-700/40"
        : "border-t border-gray-200 hover:bg-blue-50"
    }`}
  >

    {/* Client */}

    <td className="px-6 py-5">

      <div className="flex items-center gap-4">

        {/* Avatar */}

        <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow">
          {client.clientName?.charAt(0).toUpperCase()}
        </div>

        {/* Details */}

        <div className="space-y-2">

          <h3
            className={`text-lg font-bold ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {client.clientName}
          </h3>

          {client.email && (
            <div
              className={`flex items-center gap-2 text-sm ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              <Mail size={15} />
              {client.email}
            </div>
          )}

          <div
            className={`flex items-center gap-2 text-sm ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            <Phone size={15} />
            {client.phone}
          </div>

          <div className="flex items-center gap-3 flex-wrap">

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getEventBadge(
                client.eventType
              )}`}
            >
              {client.eventType}
            </span>

            <div
              className={`flex items-center gap-1 text-xs ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              <CalendarDays size={14} />

              {new Date(
                client.eventDate
              ).toLocaleDateString()}
            </div>

          </div>

        </div>

      </div>

    </td>

    {/* Shoot */}

    <td className="text-center px-4">

      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getBadge(
          client.shootStatus
        )}`}
      >
        {client.shootStatus}
      </span>

    </td>

    {/* Editing */}

    <td className="text-center px-4">

      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getBadge(
          client.editingStatus
        )}`}
      >
        {client.editingStatus}
      </span>

    </td>

    {/* Album */}

    <td className="text-center px-4">

      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getBadge(
          client.albumStatus
        )}`}
      >
        {client.albumStatus}
      </span>

    </td>

    {/* Delivery */}

    <td className="text-center px-4">

      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getBadge(
          client.deliveryStatus
        )}`}
      >
        {client.deliveryStatus}
      </span>

    </td>

    {/* Overall Status */}

    <td className="text-center px-4">

      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getBadge(
          client.status
        )}`}
      >
        {client.status}
      </span>

    </td>

    {/* Actions */}

    <td className="px-6">

      <div className="flex justify-center gap-3">

        <button
          onClick={() =>
            navigate(`/clients/${client._id}`)
          }
          className="h-10 w-10 rounded-lg bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow"
          title="View"
        >
          <Eye size={18} />
        </button>

        <button
          onClick={() => onEdit(client)}
          className="h-10 w-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow"
          title="Edit"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={() => onDelete(client)}
          className="h-10 w-10 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow"
          title="Delete"
        >
          <Trash2 size={18} />
        </button>

      </div>

    </td>

  </tr>
  
            ))
          )}

        </tbody>
      </table>
    </div>
  </div>
);

}

export default ClientTable;