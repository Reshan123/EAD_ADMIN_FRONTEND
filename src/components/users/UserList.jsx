import React, { useState, useMemo } from "react";
import {
  Edit2,
  Trash2,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import UserEditModal from "./UserEditModal";
import { useUserContext } from "../../hooks/useUserContext";
import ConfirmationModal from "../common/ConfirmationModal";

const UserList = ({ filteredUsers, allUsers, loading, error }) => {
  const { deleteUser, fetchUsers } = useUserContext();

  const users = filteredUsers || allUsers;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const displayedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  }, [users, currentPage, itemsPerPage]);

  const totalPages = Array.isArray(users)
    ? Math.ceil(users.length / itemsPerPage)
    : 1;

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // Role badge styling function
  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-50 text-red-700 border border-red-200";
      case "StationOperator":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "EVOwner":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  // Placeholder action handler
  const handleUserAction = (action, userId) => {
    console.log(`${action} user:`, userId);
    // TODO: Implement view details modal or delete functionality
  };

  const formatDateOnly = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    if (isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            User Management
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Oversee all registered users
          </p>
        </div>
      </div>

      {error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-lg font-medium">{error}</div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-x-auto bg-white">
            <div className="min-w-[800px]">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr className="border-b border-gray-200">
                    <th className="w-[180px] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Name
                    </th>
                    <th className="w-[220px] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    <th className="w-[150px] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Role
                    </th>
                    <th className="w-[120px] px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    Array.from({ length: itemsPerPage }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 bg-gray-200 rounded w-40"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-4 bg-gray-200 rounded-full w-20"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-2">
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : displayedUsers.length > 0 ? (
                    displayedUsers.map((user) => {
                      const id = user._id || user.id;
                      const createdAt = user.createdAt || user.created_at;
                      return (
                        <tr
                          key={id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="text-sm font-medium text-gray-900 truncate"
                              title={user.name}
                            >
                              {user.name || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className="text-sm text-gray-600 truncate block"
                              title={user.email}
                            >
                              {user.email || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(
                                user.role
                              )}`}
                            >
                              {user.role || "Unknown"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center justify-center gap-0.5">
                              <button
                                onClick={() => handleOpenEditModal(user)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                                title="Edit User"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenDeleteModal(user)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-all"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-base font-medium text-gray-900">
                              No users found
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {!loading && !error && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
              <p className="text-sm text-gray-700">
                {users.length > 0 ? (
                  <>
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, users.length)}
                    </span>{" "}
                    of <span className="font-medium">{users.length}</span>{" "}
                    results
                  </>
                ) : (
                  <span className="font-medium">No results to display</span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1 || totalPages <= 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(Math.max(totalPages, 1), 7) },
                    (_, i) => {
                      let pageNum;
                      if (totalPages <= 7) pageNum = i + 1;
                      else if (currentPage <= 4) pageNum = i + 1;
                      else if (currentPage >= totalPages - 3)
                        pageNum = totalPages - 6 + i;
                      else pageNum = currentPage - 3 + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`min-w-[2.5rem] px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages <= 1}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={selectedUser}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => handleCloseDeleteModal()}
        confirmText={"Delete User"}
        message={"Are you sure you want to delete this user?"}
        title={"Confirm Delete"}
        isLoading={loading}
        onConfirm={async () => {
          await deleteUser(selectedUser?.id);
          handleCloseDeleteModal();
          await fetchUsers();
        }}
      />
    </div>
  );
};

export default UserList;
