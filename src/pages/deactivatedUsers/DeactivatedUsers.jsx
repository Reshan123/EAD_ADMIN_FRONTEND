import React, { useState, useMemo, useEffect } from "react";
import { Plus, Download, Search, Users } from "lucide-react";
import { useUserContext } from "../../hooks/useUserContext";
import DeactivatedUserList from "../../components/deactivated-users/DeactivatedUserList";
import UserModal from "../../components/users/UserModal";

const DeactivatedUsers = () => {
  const {
    users,
    getDeactivatedUsers,
  } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getDeactivatedUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return (users || []).filter((user) => {
      const id = user.id || user._id || "";
      const name = user.name || "";
      const email = user.email || "";
      const role = user.role || "";
      const createdAt = user.createdAt || user.created_at;

      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        String(id).toLowerCase().includes(searchLower) ||
        name.toLowerCase().includes(searchLower) ||
        email.toLowerCase().includes(searchLower) ||
        role.toLowerCase().includes(searchLower);

      return matchesSearch;
    });
  }, [users, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
  };

  const exportToCSV = () => {
    if (filteredUsers.length === 0) return;
    const headers = ["ID", "Name", "Email", "Role", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) => {
        const id = user.id || user._id || "";
        const name = `"${user.name || ""}"`; // Handle commas in names
        const email = user.email || "";
        const role = user.role || "";
        const createdAt = user.createdAt || user.created_at || "";
        return [id, name, email, role, createdAt].join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full w-full overflow-x-hidden">
      <div className="p-4 lg:p-6 xl:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Deactivated Users
            </h1>
            <p className="text-gray-600 mt-1">Manage all ev-owner accounts</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportToCSV}
              disabled={filteredUsers.length === 0}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={
                filteredUsers.length === 0
                  ? "No data to export"
                  : `Export ${filteredUsers.length} users`
              }
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Export</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Email, or Role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              {searchTerm && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors whitespace-nowrap"
                >
                  Clear Filters
                </button>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap gap-2 lg:gap-3"></div>
              {searchTerm && (
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  Showing{" "}
                  <span className="font-medium text-gray-900">
                    {filteredUsers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-900">
                    {users.length}
                  </span>{" "}
                  users
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-w-0 overflow-hidden">
          <DeactivatedUserList
            filteredUsers={filteredUsers}
            allUsers={users}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default DeactivatedUsers;
