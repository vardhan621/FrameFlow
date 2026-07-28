import { useState } from "react";

import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import useClient from "../hooks/useClient";

import ClientInfoCard from "../components/client/ClientInfoCard";
import WorkflowSection from "../components/client/WorkflowSection";
import PaymentSection from "../components/client/PaymentSection";
import TimelineSection from "../components/client/TimelineSection";
import ActivitySection from "../components/client/ActivitySection";
import GallerySection from "../components/client/gallery/GallerySection";
import InvoiceSection from "../components/invoice/InvoiceSection";
import ClientHero from "../components/client/ClientHero";
import ClientStats from "../components/client/ClientStats";
import WorkflowProgress from "../components/client/WorkflowProgress";
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
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-slate-950"
          : "bg-gray-50"
      }`}
    >
      <div className="max-w-[1700px] mx-auto p-6">

        <div className="animate-pulse space-y-6">

          <div className="h-56 rounded-3xl bg-gray-300 dark:bg-slate-800"></div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">

            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-3xl bg-gray-300 dark:bg-slate-800"
              />
            ))}

          </div>

          <div className="h-48 rounded-3xl bg-gray-300 dark:bg-slate-800"></div>

        </div>

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
            : "bg-gray-50"
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
          : "bg-gray-50"
      }`}
    >

      <div className="max-w-[1700px] mx-auto p-4 md:p-6">
        {/* Hero Section */}

        <ClientHero client={client} />

        {/* Statistics */}

        <div className="mt-8">
          <ClientStats
            client={client}
            paidAmount={paidAmount}
          />
        </div>

        {/* Workflow Progress */}

        <div className="mt-10 mb-8">
          <WorkflowProgress
            client={client}
          />
        </div>
        {/* Tabs */}

        <div
          className={`sticky top-4 z-20 flex gap-3 overflow-x-auto py-4 mt-10 mb-8 backdrop-blur-md ${
            theme === "dark"
            ? "bg-slate-950/80"
            : "bg-gray-50/80"
          }`}
        >

          {tabs.map((tab) => (

            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
                ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-xl ring-2 ring-blue-300/30"
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
          <div className="animate-fadeIn">
            <ClientInfoCard
              client={client}
              paidAmount={paidAmount}
            />
          </div>
        )}

        {/* Gallery */}

        {activeTab === "Gallery" && (
          <div className="animate-fadeIn">
            <GallerySection
              client={client}
              uploadFiles={uploadFiles}
              deleteFile={deleteFile}
              downloadGallery={downloadGallery}
              downloading={downloading}
            />
          </div>
        )}

        {/* Workflow */}

        {activeTab === "Workflow" && (
          <div className="animate-fadeIn">
            <WorkflowSection
              client={client}
              updateWorkflow={updateWorkflow}
            />
          </div>
        )}

        {/* Payments */}

        {activeTab === "Payments" && (
          <div className="animate-fadeIn">
            <PaymentSection
              client={client}
              payments={payments}
              paidAmount={paidAmount}
              addPayment={addPayment}
              deletePayment={deletePayment}
            />
          </div>
        )}

        {/* Timeline */}

        {activeTab === "Timeline" && (
          <div className="animate-fadeIn">
            <TimelineSection timeline={timeline} />
          </div>
        )}

        {/* Activity */}

       {activeTab === "Activity" && (
          <div className="animate-fadeIn">
            <ActivitySection activities={activities} />
          </div>
        )}
        {/* Invoice */}

        {activeTab === "Invoice" && (
          <div className="animate-fadeIn">
            <InvoiceSection client={client} />
          </div>
        )}

      </div>

    </div>
  );
}