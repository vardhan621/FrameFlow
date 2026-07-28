import { Routes, Route } from "react-router-dom";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Clients from "./pages/Clients";
import Payments from "./pages/Payments";
import ClientDetails from "./pages/ClientDetails";
import Employees from "./pages/Employees";
import Shoots from "./pages/Shoots";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Gallery from "./pages/Gallery";
import PublicGallery from "./pages/PublicGallery";
import Settings from "./pages/Settings";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Tasks from "./pages/Tasks";
import EmployeeLeaves from "./pages/EmployeeLeaves";
import EmployeeTasks from "./pages/EmployeeTasks";
import Projects from "./pages/Projects";
import AddProject from "./pages/AddProject";
import ProjectDetails from "./pages/ProjectDetails";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/employee/login" element={<EmployeeLogin />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <Clients />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route path="/clients/:id" element={<ClientDetails />} />

        <Route
          path="/employees"
          element={
            <ProtectedRoute>
              <Employees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/shoots"
          element={
            <ProtectedRoute>
              <Shoots />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/employee/leaves"
          element={<EmployeeLeaves />}
        />

        <Route path="/gallery" element={<Gallery />} />

        <Route
          path="/gallery/:token"
          element={<PublicGallery />}
        />

        <Route path="/settings" element={<Settings />} />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route path="/leave" element={<Leave />} />

        <Route path="/tasks" element={<Tasks />} />

        <Route
          path="/employee/tasks"
          element={<EmployeeTasks />}
        />

        <Route path="/projects" element={<Projects />} />

        <Route
          path="/projects/new"
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
      </Routes>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;