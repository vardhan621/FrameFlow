import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ProjectForm from "../components/Projects/ProjectForm";
import { createProject } from "../services/projectService";

function AddProject() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);

  const handleCreate = async (formData) => {
    try {
      setLoading(true);

      await createProject(formData);

      alert("Project created successfully");

      navigate("/projects");
    } catch (error) {
      console.error(error);

      alert(
        error?.response?.data?.message ||
          "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-slate-900"
          : "bg-gray-50"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto rounded-xl shadow-lg p-6 ${
          theme === "dark"
            ? "bg-slate-800"
            : "bg-white"
        }`}
      >
        <h1
          className={`text-3xl font-bold mb-6 ${
            theme === "dark"
              ? "text-white"
              : "text-gray-800"
          }`}
        >
          Add New Project
        </h1>

        <ProjectForm
          onSubmit={handleCreate}
          loading={loading}
        />
      </div>
    </div>
  );
}

export default AddProject;