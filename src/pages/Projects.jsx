import React, { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const { theme } = useTheme();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900"
          : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1
          className={`text-3xl font-bold ${
            theme === "dark"
              ? "text-white"
              : "text-gray-800"
          }`}
        >
          Projects
        </h1>

        <Link
          to="/projects/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FiPlus />
          New Project
        </Link>
      </div>

      {/* Table */}
      <div
        className={`rounded-xl shadow overflow-hidden ${
          theme === "dark"
            ? "bg-slate-800"
            : "bg-white"
        }`}
      >
        <table
          className={`w-full ${
            theme === "dark"
              ? "text-gray-200"
              : "text-gray-800"
          }`}
        >
          <thead
            className={`${
              theme === "dark"
                ? "bg-slate-700"
                : "bg-gray-100"
            }`}
          >
            <tr>
              <th className="text-left px-5 py-3">Project</th>
              <th className="text-left px-5 py-3">Client</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Shoot Date</th>
              <th className="text-left px-5 py-3">Payment</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="5"
                  className={`text-center py-8 ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Loading Projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className={`text-center py-8 ${
                    theme === "dark"
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  No Projects Found
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr
                  key={project._id}
                  className={`border-t transition ${
                    theme === "dark"
                      ? "border-slate-700 hover:bg-slate-700"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <td className="px-5 py-3 font-medium">
                    <Link
                      to={`/projects/${project._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {project.projectName}
                    </Link>
                  </td>

                  <td className="px-5 py-3">
                    {project.client?.clientName || "-"}
                  </td>

                  <td className="px-5 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        theme === "dark"
                          ? "bg-blue-900/40 text-blue-300"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="px-5 py-3">
                    {project.shootDate
                      ? new Date(
                          project.shootDate
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="px-5 py-3">
                    {project.paymentStatus || "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Projects;