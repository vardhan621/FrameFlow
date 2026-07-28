import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

import InvoiceToolbar from "./InvoiceToolbar";
import InvoiceSummary from "./InvoiceSummary";
import InvoicePreview from "./InvoicePreview";

export default function InvoiceSection({
  client,
}) {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">

      {/* Header */}

      <div
        className={`rounded-3xl border shadow-xl p-6 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">

          <div>

            <h1
              className={`text-2xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Invoice
            </h1>

            <p
              className={`mt-1 ${
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Generate, Preview and Download Client Invoice
            </p>

          </div>

          <InvoiceToolbar
            client={client}
            loading={loading}
            setLoading={setLoading}
          />

        </div>

      </div>

      {/* Summary */}

      <InvoiceSummary client={client} />

      {/* Preview */}

      <InvoicePreview client={client} />

    </div>
  );
}