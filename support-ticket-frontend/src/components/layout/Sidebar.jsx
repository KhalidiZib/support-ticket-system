import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Ticket,
  Users,
  Folder,
  MapPin,
  LogOut,
  Bell,
  User,
  Menu,
  X,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../hooks/useAuth";
import NotificationContext from "../../context/NotificationContext";
import ThemeToggle from "../ui/ThemeToggle";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = React.useContext(NotificationContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/admin/tickets", label: "All Tickets", icon: <Ticket size={20} /> },
    { path: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { path: "/admin/agents", label: "Agents", icon: <User size={20} /> },
    { path: "/admin/categories", label: "Categories", icon: <Folder size={20} /> },
    { path: "/admin/locations", label: "Locations", icon: <MapPin size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> }, // Added Shared Profile
  ];

  const agentMenuItems = [
    { path: "/agent/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/agent/tickets", label: "My Tickets", icon: <Ticket size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  const customerMenuItems = [
    { path: "/customer/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { path: "/customer/tickets", label: "My Tickets", icon: <Ticket size={20} /> },
    {
      path: "/customer/create-ticket",
      label: "New Ticket",
      icon: <MessageSquare size={20} />,
    },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "ADMIN":
        return adminMenuItems;
      case "AGENT":
        return agentMenuItems;
      case "CUSTOMER":
        return customerMenuItems;
      default:
        return [];
    }
  };

  const getRoleName = () => {
    switch (user?.role) {
      case "ADMIN":
        return "Administrator";
      case "AGENT":
        return "Support Agent";
      case "CUSTOMER":
        return "Customer";
      default:
        return "User";
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white text-secondary-800 rounded-md shadow-md"
        onClick={() => setIsMobileMenuOpen((v) => !v)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-secondary-900/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-secondary-950 text-white transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col shadow-2xl`}
      >
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-secondary-800/50 bg-secondary-950/50 backdrop-blur-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 mr-3">
            <Ticket size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">SupportHub</h1>
            <p className="text-[10px] text-secondary-400 font-medium tracking-wide uppercase">Workspace</p>
          </div>
        </div>

        {/* User Card */}
        <div className="px-4 py-6">
          <div className="flex items-center p-3 rounded-xl bg-secondary-900/50 border border-secondary-800/50">
            <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center text-secondary-200 border-2 border-secondary-700">
              {user?.avatarUrl ? (
                <img src={`http://localhost:8085/support-api${user.avatarUrl}`} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : <User size={18} />}
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <div className="flex items-center mt-0.5">
                <span className={`w-2 h-2 rounded-full mr-1.5 ${user?.role === 'ADMIN' ? 'bg-rose-500' : 'bg-primary-500'}`}></span>
                <p className="text-xs text-secondary-400 font-medium truncate capitalize">{getRoleName()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 overflow-y-auto space-y-1 custom-scrollbar">
          {getMenuItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive(item.path)
                ? "bg-primary-600 text-white shadow-lg shadow-primary-900/20"
                : "text-secondary-400 hover:bg-secondary-800 hover:text-white"
                }`}
            >
              <div className={`mr-3 p-1.5 rounded-lg transition-colors ${isActive(item.path) ? "bg-white/10" : "group-hover:bg-secondary-700"}`}>
                {React.cloneElement(item.icon, { size: 18 })}
              </div>
              {item.label}
            </Link>
          ))}

          <div className="pt-6 mt-6 border-t border-secondary-800/50">
            <p className="px-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider mb-2">Support</p>

            <Link to="/notifications" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-secondary-400 hover:bg-secondary-800 hover:text-white transition-all">
              <div className="mr-3 p-1.5 rounded-lg group-hover:bg-secondary-700 transition-colors relative">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
              </div>
              Notifications
              {unreadCount > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md self-center">{unreadCount > 99 ? '99+' : unreadCount}</span>}
            </Link>

            <Link to="/help" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-secondary-400 hover:bg-secondary-800 hover:text-white transition-all">
              <div className="mr-3 p-1.5 rounded-lg group-hover:bg-secondary-700 transition-colors">
                <HelpCircle size={18} />
              </div>
              Help Center
            </Link>
          </div>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-secondary-800/50 bg-secondary-950">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-medium text-secondary-500 uppercase tracking-wider">Theme</span>
            <ThemeToggle className="text-secondary-400 hover:text-white" />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 group"
          >
            <LogOut size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
