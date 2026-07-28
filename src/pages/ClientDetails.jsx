import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import useClient from "../hooks/useClient";

import ClientInfoCard from "../components/client/ClientInfoCard";
import WorkflowSection from "../components/client/WorkflowSection";
import PaymentSection from "../components/client/PaymentSection";
import TimelineSection from "../components/client/TimelineSection";
import ActivitySection from "../components/client/ActivitySection";
import GallerySection from "../components/client/gallery/GallerySection";
import InvoiceSection from "../components/invoice/InvoiceSection";
const tabs = [
  "Overview",
  "Gallery",
  "Workflow",
  "Payments",
  "Timeline",
  "Activity",
  "Invoice",
];

export default function ClientDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("Overview");

  const {
    loading,
    client,
    payments,
    activities,
    timeline,
    paidAmount,
    uploadFiles,
    deleteFile,
    updateWorkflow,
    addPayment,
    deletePayment,
    downloadGallery,
    downloading,
  } = useClient(id);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-950"
            : "bg-gray-100"
        }`}
      >
        <div
          className={`text-xl font-semibold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-800"
          }`}
        >
          Loading...
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div
        className={`min-h-screen flex justify-center items-center transition-all duration-300 ${
          theme === "dark"
            ? "bg-slate-950"
            : "bg-gray-100"
        }`}
      >
        <div
          className={`text-xl font-semibold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-800"
          }`}
        >
          Client not found
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark"
          ? "bg-slate-950"
          : "bg-gray-100"
      }`}
    >

      <div className="max-w-7xl mx-auto p-6">

        {/* Header */}

        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate(-1)}
              className={`p-2 rounded-xl shadow transition-all duration-300 hover:scale-105 ${
                theme === "dark"
                  ? "bg-slate-800 border border-slate-700 text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              <ArrowLeft
                size={20}
                className={
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-800"
                }
              />
            </button>

            <div>
              <h1 className={`text-3xl font-bold ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}>
                {client.clientName}
              </h1>

              <p className={
                theme === "dark"
                  ? "text-gray-400"
                  : "text-gray-500"
              }>
                {client.eventType}
              </p>
            </div>

          </div>

          <span
            className={`px-5 py-2 rounded-full font-semibold ${
              client.status === "Completed"
                ? theme === "dark"
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-700"
                : client.status === "Cancelled"
                ? theme === "dark"
                  ? "bg-red-900/30 text-red-400"
                  : "bg-red-100 text-red-700"
                : theme === "dark"
                ? "bg-blue-900/30 text-blue-400"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {client.status}
          </span>

        </div>

        {/* Tabs */}

        <div className="flex gap-3 overflow-x-auto mb-8">

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl whitespace-nowrap transition-all duration-200
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-lg"
                    : theme === "dark"
                    ? "bg-slate-800 border border-slate-700 text-gray-300 hover:bg-slate-700"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
            >
              {tab}
            </button>

          ))}

        </div>

        {/* Overview */}

        {activeTab === "Overview" && (
          <ClientInfoCard
            client={client}
            paidAmount={paidAmount}
          />
        )}

        {/* Gallery */}

        {activeTab === "Gallery" && (
          <GallerySection
            client={client}
            uploadFiles={uploadFiles}
            deleteFile={deleteFile}
            downloadGallery={downloadGallery}
            downloading={downloading}
          />
        )}

        {/* Workflow */}

        {activeTab === "Workflow" && (
          <WorkflowSection
            client={client}
            updateWorkflow={updateWorkflow}
          />
        )}

        {/* Payments */}

        {activeTab === "Payments" && (
          <PaymentSection
            client={client}
            payments={payments}
            paidAmount={paidAmount}
            addPayment={addPayment}
            deletePayment={deletePayment}
          />
        )}

        {/* Timeline */}

        {activeTab === "Timeline" && (
          <TimelineSection
            timeline={timeline}
          />
        )}

        {/* Activity */}

        {activeTab === "Activity" && (
          <ActivitySection
            activities={activities}
          />
        )}
        {/* Invoice */}

        {activeTab === "Invoice" && (
          <InvoiceSection
            client={client}
          />
        )}

      </div>

    </div>
  );
}