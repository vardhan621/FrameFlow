import { useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
  FileText,
  IndianRupee,
  Wallet,
  AlertCircle,
} from "lucide-react";

export default function InvoiceSummary({
  client,
}) {
  const { theme } = useTheme();

  const paidAmount = useMemo(() => {
    return (
      Number(client.totalAmount || 0) -
      Number(client.pendingAmount || 0)
    );
  }, [client]);

  const invoiceNumber =
    client?.invoice?.invoiceNumber ||
    `INV-${client.clientId}`;

  const cards = [
    {
      title: "Invoice No",
      value: invoiceNumber,
      icon: FileText,
      color: "blue",
    },
    {
      title: "Total Amount",
      value: `₹${Number(
        client.totalAmount || 0
      ).toLocaleString()}`,
      icon: IndianRupee,
      color: "green",
    },
    {
      title: "Paid Amount",
      value: `₹${paidAmount.toLocaleString()}`,
      icon: Wallet,
      color: "emerald",
    },
    {
      title: "Pending Amount",
      value: `₹${Number(
        client.pendingAmount || 0
      ).toLocaleString()}`,
      icon: AlertCircle,
      color: "red",
    },
  ];

  const getColor = (color) => {
    if (theme === "dark") {
      switch (color) {
        case "blue":
          return "bg-slate-800 border-blue-700 text-blue-400";
        case "green":
          return "bg-slate-800 border-green-700 text-green-400";
        case "emerald":
          return "bg-slate-800 border-emerald-700 text-emerald-400";
        case "red":
          return "bg-slate-800 border-red-700 text-red-400";
        default:
          return "bg-slate-800";
      }
    }

    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-700";
      case "green":
        return "bg-green-50 text-green-700";
      case "emerald":
        return "bg-emerald-50 text-emerald-700";
      case "red":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`rounded-2xl border shadow-lg p-5 transition ${
              theme === "dark"
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  {card.title}
                </p>

                <h2
                  className={`mt-2 text-xl font-bold break-all ${
                    theme === "dark"
                      ? "text-white"
                      : "text-gray-900"
                  }`}
                >
                  {card.value}
                </h2>
              </div>

              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center ${getColor(
                  card.color
                )}`}
              >
                <Icon size={22} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}