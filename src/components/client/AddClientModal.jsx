import { FiX } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import ClientForm from "./ClientForm";

function AddClientModal({
  onClose,
  onSuccess,
  client = null,
}) {
  const { theme } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease] ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Header */}

        <div
          className={`flex items-center justify-between px-8 py-6 border-b ${
            theme === "dark"
              ? "border-slate-700"
              : "border-gray-200"
          }`}
        >
          <div>
            <h2
              className={`text-3xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              {client ? "Edit Client" : "Add New Client"}
            </h2>

            <p
              className={`mt-2 text-sm ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {client
                ? "Update client information and save the changes."
                : "Fill in the details below to register a new client."}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              theme === "dark"
                ? "hover:bg-slate-800 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
            }`}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}

        <div className="max-h-[78vh] overflow-y-auto px-8 py-8">
          <ClientForm
            client={client}
            onSuccess={onSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}

export default AddClientModal;