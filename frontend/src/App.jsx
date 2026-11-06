import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import MemberRoute from "./components/MemberRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import ApplicationDetails from "./pages/admin/ApplicationDetails";
import PendingApproval from "./pages/PendingApproval";
import Navbar from "./components/Navbar";
import InvitationManagement from "./pages/admin/InvitationManagement";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/applications/:id"
            element={
              <AdminRoute>
                <ApplicationDetails />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/invitations"
            element={
              <AdminRoute>
                <InvitationManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <MemberRoute>
                <Dashboard />
              </MemberRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
