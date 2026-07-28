import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import API from "../../services/api";

const projectTypes = [
  "Wedding",
  "Pre Wedding",
  "Birthday",
  "Reception",
  "Engagement",
  "Maternity",
  "Baby Shoot",
  "Corporate",
  "Other",
];

const projectStatus = [
  "New Booking",
  "Shoot Scheduled",
  "Shoot Completed",
  "Editing",
  "Client Selection",
  "Album Designing",
  "Printing",
  "Ready For Delivery",
  "Delivered",
  "Completed",
];

function ProjectForm({
  onSubmit,
  initialData = {},
  loading = false,
}) {
  const { theme } = useTheme();

  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
    client: initialData.client?._id || "",
    projectName: initialData.projectName || "",
    projectType: initialData.projectType || "",
    shootDate: initialData.shootDate?.substring(0, 10) || "",
    deliveryDate:
      initialData.deliveryDate?.substring(0, 10) || "",
    status: initialData.status || "New Booking",
    notes: initialData.notes || "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);

      const res = await API.get("/client");

      console.log("CLIENT RESPONSE:", res.data);

      setClients(res.data.clients || []);
    } catch (err) {
      console.log("CLIENT ERROR:", err.response?.data);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = `w-full rounded-lg p-2 border transition ${
    theme === "dark"
      ? "bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
      : "bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:outline-none"
  }`;

  const labelClass = `block mb-1 font-medium ${
    theme === "dark"
      ? "text-gray-200"
      : "text-gray-700"
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl shadow-md p-6 space-y-5 transition-all ${
        theme === "dark"
          ? "bg-slate-800"
          : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold ${
          theme === "dark"
            ? "text-white"
            : "text-gray-800"
        }`}
      >
        {initialData._id
          ? "Edit Project"
          : "Add Project"}
      </h2>

      {/* Client */}
      <div>
        <label className={labelClass}>
          Client
        </label>

        <select
          name="client"
          value={formData.client}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Select Client</option>

          {clients.map((client) => (
            <option
              key={client._id}
              value={client._id}
            >
              {client.clientName}
            </option>
          ))}
        </select>
      </div>

      {/* Project Name */}
      <div>
        <label className={labelClass}>
          Project Name
        </label>

        <input
          type="text"
          name="projectName"
          value={formData.projectName}
          onChange={handleChange}
          className={inputClass}
          required
        />
      </div>

      {/* Project Type */}
      <div>
        <label className={labelClass}>
          Project Type
        </label>

        <select
          name="projectType"
          value={formData.projectType}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Select Type</option>

          {projectTypes.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Shoot Date
          </label>

          <input
            type="date"
            name="shootDate"
            value={formData.shootDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>
            Delivery Date
          </label>

          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      {/* Status */}
      <div>
        <label className={labelClass}>
          Status
        </label>

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className={inputClass}
        >
          {projectStatus.map((status) => (
            <option
              key={status}
              value={status}
            >
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className={labelClass}>
          Notes
        </label>

        <textarea
          rows="4"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg transition"
      >
        {loading
          ? "Saving..."
          : "Save Project"}
      </button>
    </form>
  );
}

export default ProjectForm;