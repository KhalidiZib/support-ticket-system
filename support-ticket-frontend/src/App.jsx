import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/AuthProvider";
import NotificationProvider from "./context/NotificationProvider";
import Layout from "./components/layout/Layout";
import RoleRoute from "./components/auth/RoleRoute";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ResetPassword from "./pages/auth/ResetPassword";
import Landing from "./pages/public/Landing";
// import Unauthorized from "./pages/auth/Unauthorized";

// Customer Pages
import CustomerDashboard from "./pages/customer/Dashboard";
import CreateTicket from "./pages/customer/CreateTicket";
import MyTickets from "./pages/customer/MyTickets";

// Agent Pages
import AgentDashboard from "./pages/agent/Dashboard";
import AgentTickets from "./pages/agent/AssignedTickets";

// Shared Pages
import TicketDetails from "./pages/shared/TicketDetails";
import SearchResults from "./pages/shared/SearchResults";
import SharedProfile from "./pages/shared/SharedProfile";
import Notifications from "./pages/shared/Notifications";
import HelpSupport from "./pages/shared/HelpSupport";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import Tickets from "./pages/admin/Tickets";
import Users from "./pages/admin/Users";
import UserDetails from "./pages/admin/UserDetails";
import Agents from "./pages/admin/Agents";
import CreateAgent from "./pages/admin/CreateAgent";
import Categories from "./pages/admin/Categories";
import Locations from "./pages/admin/Locations";
// import AuditLog from "./pages/admin/AuditLog";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster position="top-right" />
        <Routes>

          {/* =======================
              PUBLIC ROUTES
          ======================= */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* =======================
              PROTECTED ROUTES
          ======================= */}
          <Route
            element={
              <RoleRoute role={["ADMIN", "AGENT", "CUSTOMER"]}>
                <Layout />
              </RoleRoute>
            }
          >
            {/* ---------- DEFAULT REDIRECT REMOVED to allow Landing Page ---------- */}
            {/* <Route index element={<Navigate to="customer/dashboard" />} /> */}

            {/* ---------- ADMIN ---------- */}
            <Route
              path="admin/dashboard"
              element={
                <RoleRoute role="ADMIN">
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="admin/tickets"
              element={
                <RoleRoute role="ADMIN">
                  <Tickets />
                </RoleRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <RoleRoute role="ADMIN">
                  <Users />
                </RoleRoute>
              }
            />
            <Route
              path="admin/users/:id"
              element={
                <RoleRoute role="ADMIN">
                  <UserDetails />
                </RoleRoute>
              }
            />
            <Route
              path="admin/agents"
              element={
                <RoleRoute role="ADMIN">
                  <Agents />
                </RoleRoute>
              }
            />
            <Route
              path="admin/agents/new"
              element={
                <RoleRoute role="ADMIN">
                  <CreateAgent />
                </RoleRoute>
              }
            />
            <Route
              path="admin/categories"
              element={
                <RoleRoute role="ADMIN">
                  <Categories />
                </RoleRoute>
              }
            />
            <Route
              path="admin/locations"
              element={
                <RoleRoute role="ADMIN">
                  <Locations />
                </RoleRoute>
              }
            />

            {/* ---------- AGENT ---------- */}
            <Route
              path="agent/dashboard"
              element={
                <RoleRoute role="AGENT">
                  <AgentDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="agent/tickets"
              element={
                <RoleRoute role="AGENT">
                  <AgentTickets />
                </RoleRoute>
              }
            />
            {/* <Route
      path="agent/profile"
      element={
        <RoleRoute role="AGENT">
          <AgentProfile />
        </RoleRoute>
      }
    /> */}

            {/* ---------- CUSTOMER ---------- */}
            <Route
              path="customer/dashboard"
              element={
                <RoleRoute role="CUSTOMER">
                  <CustomerDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="customer/tickets"
              element={
                <RoleRoute role="CUSTOMER">
                  <MyTickets />
                </RoleRoute>
              }
            />
            <Route
              path="customer/create-ticket"
              element={
                <RoleRoute role="CUSTOMER">
                  <CreateTicket />
                </RoleRoute>
              }
            />
            {/* <Route
      path="customer/profile"
      element={
        <RoleRoute role="CUSTOMER">
          <CustomerProfile />
        </RoleRoute>
      }
    /> */}

            {/* ---------- SHARED ---------- */}
            <Route
              path="tickets/:id"
              element={
                <RoleRoute role={["ADMIN", "AGENT", "CUSTOMER"]}>
                  <TicketDetails />
                </RoleRoute>
              }
            />
            <Route
              path="search"
              element={
                <RoleRoute role={["ADMIN", "AGENT", "CUSTOMER"]}>
                  <SearchResults />
                </RoleRoute>
              }
            />
            <Route
              path="notifications"
              element={
                <RoleRoute role={["ADMIN", "AGENT", "CUSTOMER"]}>
                  <Notifications />
                </RoleRoute>
              }
            />
            <Route
              path="help"
              element={
                <RoleRoute role={["ADMIN", "AGENT", "CUSTOMER"]}>
                  <HelpSupport />
                </RoleRoute>
              }
            />
            <Route
              path="profile"
              element={
                <RoleRoute role={["ADMIN", "AGENT", "CUSTOMER"]}>
                  <SharedProfile />
                </RoleRoute>
              }
            />
            <Route
              path="users/:id"
              element={
                <RoleRoute role={["ADMIN", "AGENT"]}>
                  <UserDetails />
                </RoleRoute>
              }
            />
          </Route>

          {/* =======================
              NOT FOUND
          ======================= */}
          <Route path="*" element={<Login />} />

        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}
