import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import InputField from "../common/InputField";
import LoadingButton from "../common/LoadingButton";
import API from "../../services/api";
import toast from "react-hot-toast";

function ClientForm({
  client,
  onSuccess,
  onCancel,
}) {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    address: "",

    eventType: "",
    eventDate: "",

    packageName: "",
    totalAmount: "",
    packageDescription: "",

    firstPayment: "",
    pendingAmount: "",

    notes: "",
  });

  useEffect(() => {
    if (!client) return;

    setFormData({
      clientName: client.clientName || "",
      phone: client.phone || "",
      email: client.email || "",
      address: client.address || "",

      eventType: client.eventType || "",

      eventDate: client.eventDate
        ? client.eventDate.split("T")[0]
        : "",

      packageName: client.packageName || "",

      totalAmount: client.totalAmount || "",

      packageDescription:
        client.packageDescription || "",

      firstPayment: "",

      pendingAmount:
        client.pendingAmount || "",

      notes: client.notes || "",
    });
  }, [client]);

  const packageDetails = {
    Basic: {
      price: 15000,
      description: "Photography",
    },

    Gold: {
      price: 35000,
      description:
        "Photography + Album",
    },

    Premium: {
      price: 60000,
      description:
        "Photography + Album + Drone + Video",
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "packageName") {
      const pkg = packageDetails[value];

      if (!pkg) {
        setFormData((prev) => ({
          ...prev,
          packageName: value,
        }));

        return;
      }

      setFormData((prev) => ({
        ...prev,

        packageName: value,

        totalAmount: pkg.price,

        packageDescription:
          pkg.description,

        pendingAmount:
          pkg.price -
          Number(prev.firstPayment || 0),
      }));

      return;
    }

    if (name === "firstPayment") {
      setFormData((prev) => ({
        ...prev,

        firstPayment: value,

        pendingAmount:
          Number(prev.totalAmount || 0) -
          Number(value || 0),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (client) {
        await API.put(
          `/client/${client._id}`,
          formData
        );

        toast.success(
          "Client Updated Successfully"
        );
      } else {
        await API.post(
          "/client/add",
          formData
        );

        toast.success(
          "Client Added Successfully"
        );
      }

      if (onSuccess) {
        await onSuccess();
      }

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
          "Failed to save client"
      );

    } finally {

      setLoading(false);

    }
  };
    return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >

      {/* Client Details */}

      <div
        className={`rounded-2xl border p-6 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          👤 Client Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InputField
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Enter Client Name"
          />

          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9876543210"
          />

          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
          />

          <InputField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Client Address"
          />

        </div>
      </div>

      {/* Event Details */}

      <div
        className={`rounded-2xl border p-6 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          🎉 Event Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label
              className={`block mb-2 font-medium ${
                theme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              Event Type
            </label>

            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className={`w-full rounded-xl border p-3 transition outline-none ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">
                Select Event
              </option>

              <option value="Wedding">
                Wedding
              </option>

              <option value="Reception">
                Reception
              </option>

              <option value="Engagement">
                Engagement
              </option>

              <option value="Birthday">
                Birthday
              </option>

              <option value="Pre Wedding">
                Pre Wedding
              </option>

              <option value="Maternity">
                Maternity
              </option>

              <option value="Baby Shoot">
                Baby Shoot
              </option>

            </select>
          </div>

          <InputField
            label="Event Date"
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />

        </div>
      </div>

      {/* Package */}

      <div
        className={`rounded-2xl border p-6 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          📦 Package Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label
              className={`block mb-2 font-medium ${
                theme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              Package
            </label>

            <select
              name="packageName"
              value={formData.packageName}
              onChange={handleChange}
              className={`w-full rounded-xl border p-3 outline-none transition ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="">
                Select Package
              </option>

              <option value="Basic">
                Basic
              </option>

              <option value="Gold">
                Gold
              </option>

              <option value="Premium">
                Premium
              </option>

            </select>
          </div>

          <InputField
            label="Total Amount"
            name="totalAmount"
            type="number"
            value={formData.totalAmount}
            readOnly
          />

          <div className="md:col-span-2">

            <label
              className={`block mb-2 font-medium ${
                theme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              Package Description
            </label>

            <textarea
              rows={4}
              readOnly
              value={formData.packageDescription}
              className={`w-full rounded-xl border p-3 resize-none ${
                theme === "dark"
                  ? "bg-slate-800 border-slate-700 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />

          </div>

        </div>
      </div>
            {/* Payment Details */}

      <div
        className={`rounded-2xl border p-6 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          💰 Payment Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InputField
            label="First Payment"
            name="firstPayment"
            type="number"
            value={formData.firstPayment}
            onChange={handleChange}
            placeholder="10000"
          />

          <InputField
            label="Pending Amount"
            name="pendingAmount"
            type="number"
            value={formData.pendingAmount}
            readOnly
          />

        </div>
      </div>

      {/* Notes */}

      <div
        className={`rounded-2xl border p-6 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-gray-50 border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          📝 Additional Notes
        </h2>

        <textarea
          name="notes"
          rows={5}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter client notes..."
          className={`w-full rounded-xl border p-4 outline-none resize-none transition-all ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white placeholder:text-gray-500 focus:border-blue-500"
              : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
          }`}
        />
      </div>

      {/* Footer */}

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
          loadingText={
            client
              ? "Updating Client..."
              : "Saving Client..."
          }
          className="min-w-[220px]"
        >
          {client
            ? "Update Client"
            : "Save Client"}
        </LoadingButton>
      </div>

    </form>
  );
}

export default ClientForm;