import axios from "axios";

const EmployeeAPI = axios.create({
  baseURL: "http://localhost:5000/api",
});

EmployeeAPI.interceptors.request.use((config) => {

  const token = localStorage.getItem("employeeToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default EmployeeAPI;