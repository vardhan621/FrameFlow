import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getInvoice } from "../../services/invoiceService";

export default function InvoicePreview({ client }) {
  const { theme } = useTheme();

  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let objectUrl = "";

    const loadInvoice = async () => {
      try {
        setLoading(true);

        const blob = await getInvoice(client._id);

        objectUrl = URL.createObjectURL(blob);

        setPdfUrl(objectUrl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (client?._id) {
      loadInvoice();
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [client]);

  return (
    <div
      className={`rounded-3xl border shadow-xl overflow-hidden ${
        theme === "dark"
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`px-6 py-4 border-b ${
          theme === "dark"
            ? "border-slate-700"
            : "border-gray-200"
        }`}
      >
        <h2
          className={`text-xl font-bold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          Invoice Preview
        </h2>
      </div>

      <div className="h-[900px]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            Loading Invoice...
          </div>
        ) : pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="Invoice"
            className="w-full h-full"
          />
        ) : (
          <div className="flex justify-center items-center h-full">
            Failed to load invoice
          </div>
        )}
      </div>
    </div>
  );
}