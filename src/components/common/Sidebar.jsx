import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Zap, Users, UserCheck } from "lucide-react";

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: LayoutDashboard,
      active: location.pathname === "/dashboard" || location.pathname === "/",
      available: true,
    },
    {
      path: "/bookings",
      name: "Bookings",
      icon: Calendar,
      active: location.pathname.startsWith("/bookings"),
      available: true,
    },
    {
      path: "/stations",
      name: "Stations",
      icon: Zap,
      active: location.pathname.startsWith("/stations"),
      available: true,
    },
    {
      path: "/users",
      name: "Users",
      icon: Users,
      active: location.pathname.startsWith("/users"),
      available: true,
    },
    {
      path: "/deactivated-users",
      name: "Deactivated Users",
      icon: UserCheck,
      active: location.pathname.startsWith("/deactivated-users"),
      available: true,
    },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand Section */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-center">
          <div className="w-40 h-40 overflow-hidden">
            <img
              src="/assets/logo.png"
              alt="EV Admin Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.available) {
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      item.active
                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                        : "text-gray-300 hover:bg-gray-800/70 hover:text-white hover:translate-x-1"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.active ? "stroke-2" : ""}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            } else {
              return (
                <li key={item.path}>
                  <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 cursor-not-allowed opacity-50">
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-xs bg-gray-800 text-gray-400 px-2.5 py-1 rounded-lg font-medium border border-gray-700">
                      Soon
                    </span>
                  </div>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={closeMobileMenu}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800 w-64 min-w-64 max-w-64 h-full shadow-2xl flex-shrink-0 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-40 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-r border-gray-800 w-64 h-full shadow-2xl flex-col transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0 flex" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
