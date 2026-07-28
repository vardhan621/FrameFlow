import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { getProject } from "../services/projectService";
import FilesTab from "../components/Projects/FilesTab";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";

function ProjectDetails() {
  const { id } = useParams();
  const { theme } = useTheme();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {
    try {
      const res = await getProject(id);
      setProject(res.data.project);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen p-6 ${
          theme === "dark"
            ? "bg-slate-900 text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        Loading Project...
      </div>
    );
  }

  if (!project) {
    return (
      <div
        className={`min-h-screen p-6 ${
          theme === "dark"
            ? "bg-slate-900 text-white"
            : "bg-gray-50 text-gray-800"
        }`}
      >
        Project Not Found
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 space-y-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900"
          : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`rounded-xl shadow p-6 ${
          theme === "dark"
            ? "bg-slate-800"
            : "bg-white"
        }`}
      >
        <h1
          className={`text-3xl font-bold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-900"
          }`}
        >
          {project.projectName}
        </h1>

        <p
          className={`mt-2 ${
            theme === "dark"
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {project.projectType}
        </p>
      </div>

      {/* Tabs */}
      <div
        className={`rounded-xl shadow p-3 flex gap-3 ${
          theme === "dark"
            ? "bg-slate-800"
            : "bg-white"
        }`}
      >
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "overview"
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "bg-slate-700 text-gray-200 hover:bg-slate-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab("files")}
          className={`px-5 py-2 rounded-lg transition ${
            activeTab === "files"
              ? "bg-blue-600 text-white"
              : theme === "dark"
              ? "bg-slate-700 text-gray-200 hover:bg-slate-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Files
        </button>
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <>
          <div className="grid md:grid-cols-2 gap-6">

            {/* Project Information */}
            <div
              className={`rounded-xl shadow p-5 ${
                theme === "dark"
                  ? "bg-slate-800 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Project Information
              </h2>

              <div className="space-y-3">
                <p>
                  <strong>Status :</strong> {project.status}
                </p>

                <p>
                  <strong>Shoot Date :</strong>{" "}
                  {project.shootDate
                    ? project.shootDate.substring(0, 10)
                    : "-"}
                </p>

                <p>
                  <strong>Delivery Date :</strong>{" "}
                  {project.deliveryDate
                    ? project.deliveryDate.substring(0, 10)
                    : "-"}
                </p>

                <p>
                  <strong>Payment :</strong>{" "}
                  {project.paymentStatus || "-"}
                </p>
              </div>
            </div>

            {/* Client Information */}
            <div
              className={`rounded-xl shadow p-5 ${
                theme === "dark"
                  ? "bg-slate-800 text-gray-200"
                  : "bg-white text-gray-800"
              }`}
            >
              <h2
                className={`text-xl font-bold mb-4 ${
                  theme === "dark"
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Client Information
              </h2>

              <div className="space-y-3">
                <p>
                  <strong>Name :</strong>{" "}
                  {project.client?.clientName || "-"}
                </p>

                <p>
                  <strong>Phone :</strong>{" "}
                  {project.client?.phone || "-"}
                </p>

                <p>
                  <strong>Client ID :</strong>{" "}
                  {project.client?.clientId || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div
            className={`rounded-xl shadow p-5 ${
              theme === "dark"
                ? "bg-slate-800"
                : "bg-white"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                theme === "dark"
                  ? "text-white"
                  : "text-gray-900"
              }`}
            >
              Notes
            </h2>

            <p
              className={`${
                theme === "dark"
                  ? "text-gray-300"
                  : "text-gray-700"
              }`}
            >
              {project.notes || "No Notes Available"}
            </p>
          </div>

          {/* Activity Timeline */}
          <ActivityTimeline projectId={project._id} />
        </>
      )}

      {/* Files */}
      {activeTab === "files" && (
        <FilesTab projectId={id} />
      )}
    </div>
  );
}

export default ProjectDetails;