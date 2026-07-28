import API from "./api";

// Get All Projects
export const getProjects = () => API.get("/project");

// Get Single Project
export const getProject = (id) => API.get(`/project/${id}`);

// Get Projects By Client
export const getProjectsByClient = (clientId) =>
  API.get(`/project/client/${clientId}`);

// Create Project
export const createProject = (data) =>
  API.post("/project", data);

// Update Project
export const updateProject = (id, data) =>
  API.put(`/project/${id}`, data);

// Delete Project
export const deleteProject = (id) =>
  API.delete(`/project/${id}`);