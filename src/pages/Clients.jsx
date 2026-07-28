import Layout from "../components/layout/Layout";
import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import API from "../services/api";
import AddClientModal from "../components/client/AddClientModal";
import ClientTable from "../components/client/ClientTable";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
function Clients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const [summary, setSummary] = useState({
    totalClients: 0,
    pendingAmount: 0,
    pendingShoot: 0,
    pendingDelivery: 0,
  });
  const [eventTypes, setEventTypes] = useState(["All"]);
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const location = useLocation();
  const { theme } = useTheme();
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("new") === "true") {
      setShowModal(true);
    }
  }, [location]);
  useEffect(() => {
    fetchClients();
  }, [page, limit, search, eventFilter, filter]);

  const fetchClients = async () => {
    setLoading(true);

    try {
      const res = await API.get(
        `/client?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}&eventType=${encodeURIComponent(eventFilter)}&status=${encodeURIComponent(filter)}`
      );

      const clientData = res.data.clients;

      setClients(clientData);
      setTotalPages(res.data.totalPages);
      setEventTypes([
        "All",
        ...res.data.eventTypes,
      ]);
      setSummary({
        totalClients: res.data.totalClients,

        pendingAmount: clientData.reduce(
          (sum, c) => sum + Number(c.pendingAmount || 0),
          0
        ),

        pendingShoot: clientData.filter(
          (c) => c.shootStatus !== "Completed"
        ).length,

        pendingDelivery: clientData.filter(
          (c) => c.deliveryStatus !== "Delivered"
        ).length,
      });

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (client) => {
    if (!window.confirm(`Delete ${client.clientName}?`)) return;

    try {
      await API.delete(`/client/${client._id}`);

      toast.success("Client Deleted Successfully");

      fetchClients();

    } catch (err) {
      toast.error("Failed to delete client");
    }
  };

  return (
    <Layout>
      <div
        className={`p-6 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-slate-900"
            : "bg-slate-100"
        }`}
      >

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-6">

        <div>
          <p
            className={`text-sm ${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Dashboard / Clients
          </p>

          <h1
            className={`text-3xl font-bold mt-1 ${
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            Clients
          </h1>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 hover:shadow-lg transition-all duration-200 text-white px-5 py-3 rounded-xl shadow-md"
        >
          + Add Client
        </button>

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">

        <div className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}>

          <p className={`${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}>
            Total Clients
          </p>

          <h2 className="text-3xl font-bold text-blue-400 mt-2">
            {summary.totalClients}
          </h2>

        </div>

        <div
          className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >

          <p
            className={
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }
          >
            Pending Amount
          </p>

          <h2 className="text-3xl font-bold text-yellow-400 mt-2">
            ₹{summary.pendingAmount.toLocaleString()}
          </h2>

        </div>

        <div
          className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >

          <p
            className={`${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Shoots Pending
          </p>

          <h2 className="text-3xl font-bold text-red-400 mt-2">
            {summary.pendingShoot}
          </h2>

        </div>

        <div
          className={`rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700"
              : "bg-white border-gray-200"
          }`}
        >

          <p
            className={`${
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-500"
            }`}
          >
            Delivery Pending
          </p>

          <h2 className="text-3xl font-bold text-green-400 mt-2">
            {summary.pendingDelivery}
          </h2>

        </div>

      </div>

      {/* Search */}

      <div
        className={`rounded-2xl border p-6 shadow-sm mb-5 ${
          theme === "dark"
            ? "bg-slate-800 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >

        <input
          type="text"
          placeholder="🔍 Search Client..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className={`w-full p-3 rounded-xl border outline-none transition focus:ring-2 focus:ring-blue-500 ${
            theme === "dark"
              ? "bg-slate-900 border-slate-700 text-white"
              : "bg-gray-50 border-gray-300 text-gray-900"
          }`}
        />

      </div>
      <div className="flex flex-wrap gap-4 mt-5">

        <select
          value={eventFilter}
          onChange={(e) => {
             setEventFilter(e.target.value);
             setPage(1);
          }}
          className={`rounded-xl border px-4 py-2 transition focus:ring-2 focus:ring-blue-500 ${
            theme === "dark"
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}
        >
          {eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {[
          "All",
          "Pending Shoot",
          "Completed Shoot",
          "Editing",
          "Album",
          "Pending Delivery",
          "Delivered",
        ].map((item) => (
          <button
            key={item}
            onClick={() => {
              setFilter(item);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl transition-all duration-200 ${
              filter === item
                ? "bg-blue-600 text-white"
                : theme === "dark"
                ? "bg-slate-800 text-gray-300"
                : "bg-white border border-gray-300 text-gray-700"
            }`}
          >
            {item}
          </button>
        ))}

      </div>
      {/* Client Table */}

      <ClientTable
        clients={clients}
        loading={loading}
        onEdit={(client) => {
          setSelectedClient(client);
          setShowModal(true);
        }}
        onDelete={handleDelete}
      />
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">

        <div className="flex items-center gap-2">

          <span
            className={
              theme === "dark"
                ? "text-gray-400"
                : "text-gray-600"
            }
          >
            Rows
          </span>

          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className={`rounded-lg border px-2 py-1 transition focus:ring-2 focus:ring-blue-500 ${
              theme === "dark"
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

        </div>

        <div className="flex items-center gap-3">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg transition disabled:opacity-40 ${
              theme === "dark"
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>

          <span
            className={
              theme === "dark"
                ? "text-white"
                : "text-gray-900"
            }
          >
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg transition disabled:opacity-40 ${
              theme === "dark"
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-white border border-gray-300 text-gray-900 hover:bg-gray-100"
            }`}
          >
            Next
          </button>

        </div>

      </div>

      {/* Modal */}

      {showModal && (
        <AddClientModal
          client={selectedClient}
          onClose={() => {
            setShowModal(false);
            setSelectedClient(null);
          }}
          onSuccess={async () => {
            await fetchClients();

            setShowModal(false);
            setSelectedClient(null);

            if (location.search.includes("new=true")) {
              navigate("/dashboard");
            }
            
          }}
        />
      )}
      </div>
    </Layout>
  );
}

export default Clients;