import { useTheme } from "../../context/ThemeContext";
import {
  Download,
  Printer,
  Mail,
  MessageCircle,
  Loader2,
} from "lucide-react";

import {
  downloadInvoice,
  getInvoice,
  printInvoice,
  emailInvoice,
  whatsappInvoice,
} from "../../services/invoiceService";

export default function InvoiceToolbar({
  client,
  loading,
  setLoading,
}) {
  const { theme } = useTheme();   
  const handleDownload = async () => {
    try {
      setLoading(true);
      await downloadInvoice(client._id);
    } catch (err) {
      console.error(err);
      alert("Failed to download invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setLoading(true);

      const blob = await getInvoice(client._id);
      printInvoice(blob);
    } catch (err) {
      console.error(err);
      alert("Failed to print invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = async () => {
      try {
        setLoading(true);

        const res = await emailInvoice(client._id);

        alert(res.message || "Invoice emailed successfully");

      } catch (err) {

        console.error(err);

        alert(
          err?.response?.data?.message ||
          "Failed to send invoice"
        );

      } finally {

        setLoading(false);

      }
    };

  const handleWhatsapp = async () => {
  try {
    setLoading(true);

    const res = await whatsappInvoice(client._id);

    console.log("Response:", res);

    const phone = (res.phone || "").replace(/\D/g, "");

    const message = `Hello ${res.clientName},

Thank you for choosing FlashFrame Studio.

Your Invoice:

${res.invoiceUrl}`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    console.log("WhatsApp URL:", url);

    window.open(url, "_blank");

  } catch (err) {
    console.error(err);
    console.error(err.response);

    alert(
      err?.response?.data?.message ||
      err.message ||
      "Failed to open WhatsApp"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Download size={18} />
        )}
        Download
      </button>

      <button
        onClick={handlePrint}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
            theme === "dark"
            ? "border-slate-600 bg-slate-900 text-white hover:bg-slate-800"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        }`}
        >
        <Printer size={18} />
        Print
      </button>

      <button
        onClick={handleEmail}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
            theme === "dark"
            ? "border-slate-600 bg-slate-900 text-white hover:bg-slate-800"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        }`}
        >
        <Mail size={18} />
        Email
      </button>

      <button
        onClick={handleWhatsapp}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
            theme === "dark"
            ? "border-slate-600 bg-slate-900 text-white hover:bg-slate-800"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        }`}
        >
        <MessageCircle size={18} />
        WhatsApp
      </button>
    </div>
  );
}