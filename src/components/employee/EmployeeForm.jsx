import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import API from "../../services/api";
import InputField from "../common/InputField";
import LoadingButton from "../common/LoadingButton";
import toast from "react-hot-toast";

function EmployeeForm({
  employee,
  onSuccess,
  onCancel,
}) {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "Photographer",
    phone: "",
    email: "",
    username: "",
    password: "",
    salary: "",
    status: "Active",
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        role: employee.role || "Photographer",
        phone: employee.phone || "",
        email: employee.email || "",
        username: employee.username || "",
        password: "",
        salary: employee.salary || "",
        status: employee.status || "Active",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = { ...formData };

      if (employee && !data.password) {
        delete data.password;
      }

      if (employee) {
        await API.put(
          `/employee/${employee._id}`,
          data
        );

        toast.success(
          "Employee Updated Successfully"
        );
      } else {
        await API.post(
          "/employee/add",
          data
        );

        toast.success(
          "Employee Added Successfully"
        );
      }

      if (typeof onSuccess === "function") {
        await onSuccess();
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to save employee"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-7"
    >

      {/* Form Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Name */}
        <InputField
          label="Employee Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Phone */}
        <InputField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        {/* Username */}
        <InputField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        {/* Role */}
        <div>
          <label
            className={`block mb-2 font-medium ${
              theme === "dark"
                ? "text-gray-200"
                : "text-gray-700"
            }`}
          >
            Role
          </label>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={`w-full rounded-xl border p-3 outline-none transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            }`}
          >
            <option>Photographer</option>
            <option>Videographer</option>
            <option>Editor</option>
            <option>Drone Operator</option>
            <option>Album Designer</option>
            <option>Assistant</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label
            className={`block mb-2 font-medium ${
              theme === "dark"
                ? "text-gray-200"
                : "text-gray-700"
            }`}
          >
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={`w-full rounded-xl border p-3 outline-none transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"
            }`}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        {/* Salary */}
        <InputField
          label="Salary"
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />

        {/* Password */}
        <InputField
          label={
            employee
              ? "New Password (Optional)"
              : "Password"
          }
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

      </div>

      {/* Footer Buttons */}

      <div
        className={`flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t ${
          theme === "dark"
            ? "border-slate-700"
            : "border-gray-200"
        }`}
      >
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3 rounded-xl transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-700 text-white hover:bg-slate-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
        )}

        <LoadingButton
          loading={loading}
          type="submit"
          fullWidth={false}
          loadingText={
            employee
              ? "Updating Employee..."
              : "Adding Employee..."
          }
          className="min-w-[190px]"
        >
          {employee ? "Update Employee" : "Add Employee"}
        </LoadingButton>
      </div>

    </form>
  );
}

export default EmployeeForm;