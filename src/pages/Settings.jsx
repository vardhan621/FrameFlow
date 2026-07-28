import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import API from "../services/api";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
function Settings() {
  const [form, setForm] = useState({
    studioName: "",
    ownerName: "",
    phone: "",
    email: "",
    address: "",
    website: "",
    gstNumber: "",
    invoicePrefix: "",
    currency: "",
    galleryDownload: true,
    galleryWatermark: false,
    theme: "system",
    logo: "",
    storageUsed: 0,
    storageLimit: 100,
    subscription: "Free",
    galleryPassword: "",
    galleryExpiry: 0,
    galleryDownloadLimit: 0,
    hideGalleryAfterExpiry: false,
    whatsapp: "",
    instagram: "",
    facebook: "",
    smtpHost: "",
    smtpPort: 587,
    smtpEmail: "",
    smtpPassword: "",
    smtpSenderName: "",
    emailNotifications: true,
    bookingNotifications: true,
    paymentNotifications: true,
    galleryNotifications: true,
    brandName: "",
    brandLogo: "",
    watermarkType: "logo",
  });

  const [logo, setLogo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [backupFile, setBackupFile] = useState(null);
  const [restoring, setRestoring] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [brandLogo, setBrandLogo] = useState(null);
  const { setTheme } = useTheme();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  useEffect(() => {
    loadSettings();
    loadActivityLogs();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await API.get("/settings");
      setForm(res.data.studio);
    } catch (err) {
      console.log(err);
    }
  };
  const loadActivityLogs = async () => {
    try {
      setLoadingLogs(true);

      const res = await API.get("/settings/activity-logs");

      setLogs(res.data.logs || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load activity logs");
    } finally {
      setLoadingLogs(false);
    }
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const uploadLogo = async () => {
    if (!logo) {
      return toast.error("Please select a logo");
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("logo", logo);

      await API.put("/logo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Logo Uploaded Successfully");

      loadSettings();

      setLogo(null);

    } catch (err) {
      console.log(err);
      toast.error("Logo Upload Failed");
    } finally {
      setUploading(false);
    }
  };
  const uploadBrandLogo = async () => {
    if (!brandLogo) {
      return toast.error("Select a logo");
    }

    const formData = new FormData();
    formData.append("logo", brandLogo);

    await API.put("/settings/upload-brand-logo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success("Brand Logo Uploaded");

    loadSettings();
  };
  const saveSettings = async (e) => {
    e.preventDefault();

    try {
      await API.put("/settings", form);

      setTheme(form.theme);

      toast.success("Settings Updated");
    } catch (err) {
      console.log(err);
      toast.error("Update Failed");
    }
  };
  const downloadBackup = async () => {
  try {
    const res = await API.get("/settings/backup", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "studio-backup.json");

    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Backup Downloaded");
  } catch (err) {
    console.log(err);
    toast.error("Backup Download Failed");
  }
};

const restoreBackup = async () => {
  if (!backupFile) {
    return toast.error("Please select a backup file");
  }

  try {
    setRestoring(true);

    const formData = new FormData();
    formData.append("backup", backupFile);

    const res = await API.post("/settings/restore", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    toast.success(res.data.message);

    loadSettings();
    setBackupFile(null);

  } catch (err) {
    console.log(err);
    toast.error(err.response?.data?.message || "Restore Failed");
  } finally {
    setRestoring(false);
  }
};
  const changePassword = async () => {

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return toast.error("All fields are required");
    }

    if (passwordForm.newPassword.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    if (
      passwordForm.newPassword !== passwordForm.confirmPassword
    ) {
      return toast.error("Passwords do not match");
    }

    try {

      const res = await API.put("/settings/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      toast.success(res.data.message);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {

      toast.error(
        err.response?.data?.message || "Password update failed"
      );

    }

  };
  const deleteClients = async () => {
  if (!window.confirm("Delete all clients?")) return;

  try {
    const res = await API.delete("/settings/delete-clients");
    toast.success(res.data.message);
    loadActivityLogs();
  } catch (err) {
    toast.error(err.response?.data?.message || "Delete failed");
  }
};

const deleteBookings = async () => {
  if (!window.confirm("Delete all bookings?")) return;

  try {
    const res = await API.delete("/settings/delete-bookings");
    toast.success(res.data.message);
    loadActivityLogs();
  } catch (err) {
    toast.error(err.response?.data?.message || "Delete failed");
  }
};

const deleteGalleries = async () => {
  if (!window.confirm("Delete all galleries?")) return;

  try {
    const res = await API.delete("/settings/delete-galleries");
    toast.success(res.data.message);
    loadActivityLogs();
  } catch (err) {
    toast.error(err.response?.data?.message || "Delete failed");
  }
};
const deleteAccount = async () => {
  if (
    !window.confirm(
      "This will permanently delete your studio account. Continue?"
    )
  )
    return;

  try {
    const res = await API.delete("/settings/delete-account");

    toast.success(res.data.message);

    localStorage.removeItem("token");

    window.location.href = "/login";
  } catch (err) {
    toast.error(err.response?.data?.message || "Delete failed");
  }
};
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-white mb-8">
          Studio Settings
        </h1>

        {/* Logo Upload */}

        <div className="bg-slate-900 p-8 rounded-xl mb-6">

          <h2 className="text-xl font-bold text-white mb-5">
            Studio Logo
          </h2>

          {form.logo ? (
            <img
              src={form.logo}
              alt="Studio Logo"
              className="w-40 h-40 object-contain bg-white rounded-lg p-3 mb-5"
            />
          ) : (
            <div className="w-40 h-40 rounded-lg bg-slate-800 flex justify-center items-center text-gray-400 mb-5">
              No Logo
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            className="text-white block mb-4"
          />

          <button
            type="button"
            onClick={uploadLogo}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white"
          >
            {uploading ? "Uploading..." : "Upload Logo"}
          </button>

        </div>
        <div className="bg-slate-900 p-8 rounded-xl mb-6">

          <h2 className="text-xl font-bold text-white mb-6">
            📦 Storage & Subscription
          </h2>

          <div className="mb-4">
            <div className="flex justify-between text-white mb-2">
              <span>Storage Usage</span>

              <span>
                {form.storageUsed} GB / {form.storageLimit} GB
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full"
                style={{
                  width: `${(form.storageUsed / form.storageLimit) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">

            <div>
              <p className="text-gray-400">
                Current Plan
              </p>

              <h3 className="text-2xl font-bold text-white">
                {form.subscription}
              </h3>
            </div>

            <button
              className="bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-lg text-white"
            >
              Upgrade
            </button>

          </div>

        </div>
        {/* Settings Form */}

        <form
          onSubmit={saveSettings}
          className="bg-slate-900 p-8 rounded-xl space-y-5"
        >

          <input
            name="studioName"
            value={form.studioName}
            onChange={handleChange}
            placeholder="Studio Name"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            placeholder="Owner Name"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="Website"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="gstNumber"
            value={form.gstNumber}
            onChange={handleChange}
            placeholder="GST Number"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <div className="grid grid-cols-2 gap-5">

            <input
              name="invoicePrefix"
              value={form.invoicePrefix}
              onChange={handleChange}
              placeholder="Invoice Prefix"
              className="p-3 rounded bg-slate-800 text-white"
            />

            <input
              name="currency"
              value={form.currency}
              onChange={handleChange}
              placeholder="Currency"
              className="p-3 rounded bg-slate-800 text-white"
            />

          </div>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              name="galleryDownload"
              checked={form.galleryDownload}
              onChange={handleChange}
            />
            Allow Gallery Download
          </label>

          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              name="galleryWatermark"
              checked={form.galleryWatermark}
              onChange={handleChange}
            />
            Enable Watermark
          </label>
          <input
            type="password"
            name="galleryPassword"
            value={form.galleryPassword}
            onChange={handleChange}
            placeholder="Gallery Password (Optional)"
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <div>
            <label className="block text-white mb-2 mt-4">
              Gallery Expiry
            </label>

            <select
              name="galleryExpiry"
              value={form.galleryExpiry}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-800 text-white"
            >
              <option value={0}>Never Expire</option>
              <option value={7}>7 Days</option>
              <option value={15}>15 Days</option>
              <option value={30}>30 Days</option>
              <option value={60}>60 Days</option>
              <option value={90}>90 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2 mt-4">
              Download Limit
            </label>

            <select
              name="galleryDownloadLimit"
              value={form.galleryDownloadLimit}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-800 text-white"
            >
              <option value={0}>Unlimited</option>
              <option value={50}>50 Downloads</option>
              <option value={100}>100 Downloads</option>
              <option value={500}>500 Downloads</option>
              <option value={1000}>1000 Downloads</option>
            </select>
          </div>

          <label className="flex items-center gap-3 text-white mt-4">
            <input
              type="checkbox"
              name="hideGalleryAfterExpiry"
              checked={form.hideGalleryAfterExpiry}
              onChange={handleChange}
            />
            Hide Gallery After Expiry
          </label>
          <div>
            <label className="block text-white mb-2">
              Appearance
            </label>

            <select
              name="theme"
              value={form.theme}
              onChange={handleChange}
              className="w-full p-3 rounded bg-slate-800 text-white"
            >
              <option value="system">🖥 System Default</option>
              <option value="dark">🌙 Dark</option>
              <option value="light">☀ Light</option>
            </select>
          </div>
          <div className="border-t border-slate-700 pt-6">

            <h2 className="text-xl font-bold text-white mb-5">
              📱 Social Media
            </h2>

            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="WhatsApp Number"
              className="w-full p-3 rounded bg-slate-800 text-white mb-4"
            />

            <input
              type="text"
              name="instagram"
              value={form.instagram}
              onChange={handleChange}
              placeholder="Instagram Username or Link"
              className="w-full p-3 rounded bg-slate-800 text-white mb-4"
            />

            <input
              type="text"
              name="facebook"
              value={form.facebook}
              onChange={handleChange}
              placeholder="Facebook Page Link"
              className="w-full p-3 rounded bg-slate-800 text-white"
            />

          </div>
          <div className="border-t border-slate-700 pt-6">

            <h2 className="text-xl font-bold text-white mb-5">
              📧 SMTP Email Settings
            </h2>

            <input
              name="smtpHost"
              value={form.smtpHost}
              onChange={handleChange}
              placeholder="SMTP Host (smtp.gmail.com)"
              className="w-full p-3 rounded bg-slate-800 text-white mb-4"
            />

            <input
              type="number"
              name="smtpPort"
              value={form.smtpPort}
              onChange={handleChange}
              placeholder="SMTP Port"
              className="w-full p-3 rounded bg-slate-800 text-white mb-4"
            />

            <input
              type="email"
              name="smtpEmail"
              value={form.smtpEmail}
              onChange={handleChange}
              placeholder="SMTP Email"
              className="w-full p-3 rounded bg-slate-800 text-white mb-4"
            />

            <input
              type="password"
              name="smtpPassword"
              value={form.smtpPassword}
              onChange={handleChange}
              placeholder="SMTP App Password"
              className="w-full p-3 rounded bg-slate-800 text-white mb-4"
            />

            <input
              name="smtpSenderName"
              value={form.smtpSenderName}
              onChange={handleChange}
              placeholder="Sender Name"
              className="w-full p-3 rounded bg-slate-800 text-white"
            />

          </div>
          <div className="border-t border-slate-700 pt-6">

            <h2 className="text-xl font-bold text-white mb-5">
              🔔 Notification Preferences
            </h2>

            <label className="flex items-center gap-3 text-white mb-4">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={form.emailNotifications}
                onChange={handleChange}
              />
              Enable Email Notifications
            </label>

            <label className="flex items-center gap-3 text-white mb-4">
              <input
                type="checkbox"
                name="bookingNotifications"
                checked={form.bookingNotifications}
                onChange={handleChange}
              />
              Booking Notifications
            </label>

            <label className="flex items-center gap-3 text-white mb-4">
              <input
                type="checkbox"
                name="paymentNotifications"
                checked={form.paymentNotifications}
                onChange={handleChange}
              />
              Payment Notifications
            </label>

            <label className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                name="galleryNotifications"
                checked={form.galleryNotifications}
                onChange={handleChange}
              />
              Gallery Ready Notifications
            </label>

          </div>
          <div className="border-t border-slate-700 pt-6">

            <h2 className="text-xl font-bold text-white mb-5">
              💾 Backup & Restore
            </h2>

            <div className="flex gap-4 flex-wrap">

              <input
                type="file"
                accept=".json"
                onChange={(e) => setBackupFile(e.target.files[0])}
                className="text-white mb-4"
              />

              <div className="flex gap-4 flex-wrap">

                <button
                  type="button"
                  onClick={downloadBackup}
                  className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg text-white"
                >
                  Download Backup
                </button>

                <button
                  type="button"
                  onClick={restoreBackup}
                  disabled={restoring}
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg text-white"
                >
                  {restoring ? "Restoring..." : "Restore Backup"}
                </button>

              </div>

            </div>

            <p className="text-gray-400 mt-4 text-sm">
              Backup contains clients, bookings, payments, galleries and settings.
            </p>

          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white"
          >
            Save Settings
          </button>

        </form>
        
        <div className="bg-slate-900 p-8 rounded-xl mt-8">

          <h2 className="text-xl font-bold text-white mb-6">
            🔒 Change Password
          </h2>

          <input
            type="password"
            placeholder="Current Password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          />

          <input
            type="password"
            placeholder="New Password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
            className="w-full p-3 rounded bg-slate-800 text-white mb-4"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                confirmPassword: e.target.value,
              })
            }
            className="w-full p-3 rounded bg-slate-800 text-white mb-6"
          />

          <button
            type="button"
            onClick={changePassword}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
          >
            Update Password
          </button>

        </div>
        <div className="bg-red-950 border border-red-700 p-8 rounded-xl mt-8">

          <h2 className="text-2xl font-bold text-red-400 mb-4">
            🚨 Danger Zone
          </h2>

          <p className="text-gray-300 mb-6">
            These actions are irreversible. Please proceed carefully.
          </p>

          <div className="space-y-4">

            <button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
              onClick={deleteGalleries}
            >
              Delete All Galleries
            </button>

            <button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
              onClick={deleteClients}
            >
              Delete All Clients
            </button>

            <button
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg"
              onClick={deleteBookings}
            >
              Delete All Bookings
            </button>

            <button
              type="button"
              className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-lg"
              onClick={deleteAccount}           
            >
              Delete Studio Account
            </button>

          </div>

        </div>
        {/* ================= Gallery Branding ================= */}

          <div className="bg-slate-900 p-8 rounded-xl mt-8">
            <h2 className="text-xl font-bold text-white mb-6">
              🎨 Gallery Branding
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Brand Name */}
              <div>
                <label className="block text-white mb-2">
                  Brand Name
                </label>

                <input
                  type="text"
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  placeholder="Harsha Studio"
                  className="w-full p-3 rounded bg-slate-800 text-white"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setBrandLogo(e.target.files[0])}
                className="text-white mt-4"
              />

              <button
                type="button"
                onClick={uploadBrandLogo}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-white mt-3"
              >
                Upload Brand Logo
              </button>
              {/* Watermark Type */}
              <div>
                <label className="block text-white mb-2">
                  Watermark Type
                </label>

                <select
                  name="watermarkType"
                  value={form.watermarkType}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-slate-800 text-white"
                >
                  <option value="logo">Logo</option>
                  <option value="text">Text</option>
                  <option value="none">None</option>
                </select>
              </div>

              {/* Watermark Position */}
              <div>
                <label className="block text-white mb-2">
                  Watermark Position
                </label>

                <select
                  name="watermarkPosition"
                  value={form.watermarkPosition}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-slate-800 text-white"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="center">Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>

              {/* Watermark Opacity */}
              <div>
                <label className="block text-white mb-2">
                  Watermark Opacity ({form.watermarkOpacity}%)
                </label>

                <input
                  type="range"
                  min="0"
                  max="100"
                  name="watermarkOpacity"
                  value={form.watermarkOpacity}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              {/* Gallery Theme */}
              <div>
                <label className="block text-white mb-2">
                  Gallery Theme
                </label>

                <select
                  name="galleryTheme"
                  value={form.galleryTheme}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-slate-800 text-white"
                >
                  <option value="default">Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              {/* Cover Style */}
              <div>
                <label className="block text-white mb-2">
                  Cover Style
                </label>

                <select
                  name="coverStyle"
                  value={form.coverStyle}
                  onChange={handleChange}
                  className="w-full p-3 rounded bg-slate-800 text-white"
                >
                  <option value="classic">Classic</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

            </div>

            {/* Preview */}
            <div className="mt-8 bg-slate-800 rounded-xl p-6">

              <h3 className="text-white font-semibold mb-4">
                Live Preview
              </h3>

              <div className="relative bg-gray-900 rounded-lg h-56 flex items-center justify-center overflow-hidden">

                <span className="text-gray-500 text-5xl">
                  📷
                </span>

                {form.watermarkType !== "none" && (
                  <div
                    style={{
                      opacity: form.watermarkOpacity / 100,
                    }}
                    className={`absolute text-white font-bold
                      ${
                        form.watermarkPosition === "top-left"
                          ? "top-3 left-3"
                          : form.watermarkPosition === "top-right"
                          ? "top-3 right-3"
                          : form.watermarkPosition === "bottom-left"
                          ? "bottom-3 left-3"
                          : form.watermarkPosition === "center"
                          ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          : "bottom-3 right-3"
                      }`}
                  >
                    {form.watermarkType === "text"
                      ? form.brandName || "Studio"
                      : "LOGO"}
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm mt-4">
                Preview only. Actual gallery watermark will use your saved settings.
              </p>

            </div>
          </div>
        <div className="bg-slate-900 p-8 rounded-xl mt-8">

          <h2 className="text-xl font-bold text-white mb-6">
            🌍 Localization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-white mb-2">
                Time Zone
              </label>

              <select
                name="timezone"
                className="w-full p-3 rounded bg-slate-800 text-white"
              >
                <option>Asia/Kolkata</option>
                <option>UTC</option>
                <option>America/New_York</option>
                <option>Europe/London</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">
                Language
              </label>

              <select
                name="language"
                className="w-full p-3 rounded bg-slate-800 text-white"
              >
                <option>English</option>
                <option>Telugu</option>
                <option>Hindi</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">
                Date Format
              </label>

              <select
                name="dateFormat"
                className="w-full p-3 rounded bg-slate-800 text-white"
              >
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">
                Time Format
              </label>

              <select
                name="timeFormat"
                className="w-full p-3 rounded bg-slate-800 text-white"
              >
                <option>12 Hour</option>
                <option>24 Hour</option>
              </select>
            </div>

          </div>

        </div>
        <div className="bg-slate-900 p-8 rounded-xl mt-8">

          <h2 className="text-xl font-bold text-white mb-6">
            💳 Subscription & Billing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-slate-800 p-5 rounded-lg">
              <p className="text-gray-400">Current Plan</p>
              <h3 className="text-2xl font-bold text-green-400">Free</h3>
            </div>

            <div className="bg-slate-800 p-5 rounded-lg">
              <p className="text-gray-400">Renewal Date</p>
              <h3 className="text-white">Not Applicable</h3>
            </div>

            <div className="bg-slate-800 p-5 rounded-lg">
              <p className="text-gray-400">Billing Cycle</p>
              <h3 className="text-white">Monthly</h3>
            </div>

            <div className="bg-slate-800 p-5 rounded-lg">
              <p className="text-gray-400">Storage Used</p>
              <h3 className="text-white">
                {form.storageUsed} GB / {form.storageLimit} GB
              </h3>
            </div>

          </div>

          <div className="mt-8 flex flex-wrap gap-4">

            <button
              type="button"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white"
            >
              Upgrade Plan
            </button>

            <button
              type="button"
              className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg text-white"
            >
              View Billing History
            </button>

            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
            >
              Download Invoice
            </button>

          </div>

        </div>
        <div className="bg-slate-900 p-8 rounded-xl mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              📊 Activity Logs
            </h2>

            <button
              onClick={loadActivityLogs}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              Refresh
            </button>
          </div>

          {loadingLogs ? (
            <p className="text-gray-400">Loading...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-400">No activity found.</p>
          ) : (
            <div className="space-y-4 max-h-[450px] overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log._id}
                  className="border-b border-slate-700 pb-4"
                >
                  <h3 className="text-white font-semibold">
                    {log.title}
                  </h3>

                  <p className="text-gray-400 text-sm">
                    {log.message}
                  </p>

                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{log.type}</span>
                    <span>
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </Layout>
  );
}

export default Settings;