import React, { useState, useMemo, useContext } from "react";
import { User, ChevronLeft, ChevronRight, RefreshCw, Loader2 } from "lucide-react";
import { useUserContext } from "../../hooks/useUserContext";

const DeactivatedUserList = ({ filteredUsers, allUsers, loading }) => {
  // Get the necessary functions from the context
  const { reactivateEmployee, getDeactivatedUsers } = useUserContext();

  const users = filteredUsers || allUsers;

  const [currentPage, setCurrentPage] = useState(1);
  // State to track the ID of the user being reactivated
  const [reactivatingId, setReactivatingId] = useState(null);
  const itemsPerPage = 10;

  const displayedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  }, [users, currentPage, itemsPerPage]);

  const totalPages = Array.isArray(users)
    ? Math.ceil(users.length / itemsPerPage)
    : 1;

  // Handler for the reactivate action
  const handleReactivate = async (userId) => {
    console.log(userId);
    if (!window.confirm("Are you sure you want to reactivate this user?")) {
      return;
    }

    setReactivatingId(userId);
    try {
      const result = await reactivateEmployee(userId);
      if (result.success) {
        alert('User reactivated successfully!');
        // Refresh the list to remove the reactivated user
        await getDeactivatedUsers();
      } else {
        throw new Error(result.error?.response?.data?.message || 'Failed to reactivate user.');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setReactivatingId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Deactivated Users
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and reactivate user accounts
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto bg-white">
        <div className="min-w-[800px]">
          <table className="w-full table-fixed">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="w-[250px] px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Name
                </th>
                <th className="flex-1 px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="flex-1 px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                  Deactivated At
                </th>
                <th className="w-[150px] px-4 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
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
                      <div className="h-3 bg-gray-200 rounded w-48"></div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-6 w-24 mx-auto bg-gray-200 rounded-md"></div>
                    </td>
                  </tr>
                ))
              ) : displayedUsers.length > 0 ? (
                displayedUsers.map((user) => {
                  const id = user._id || user.id;
                  const isReactivating = reactivatingId === id;
                  return (
                    <tr key={id} className="hover:bg-gray-50 transition-colors">
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
                          className="text-sm text-gray-600 truncate block"
                          title={user.deactivatedAt}
                        >
                          {new Date(user.deactivatedAt).toLocaleDateString() + " | " + new Date(user.deactivatedAt).toLocaleTimeString() || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleReactivate(id)}
                          disabled={isReactivating}
                          className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                          title="Reactivate User"
                        >
                          {isReactivating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          <span>{isReactivating ? 'Processing...' : 'Reactivate'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-base font-medium text-gray-900">
                          No deactivated users found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          All user accounts are currently active.
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
      {/* Pagination */}
      {!loading && (
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
                of <span className="font-medium">{users.length}</span> results
              </>
            ) : (
              <span className="font-medium">No results to display</span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages <= 1}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
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
    </div>
  );
};

export default DeactivatedUserList;