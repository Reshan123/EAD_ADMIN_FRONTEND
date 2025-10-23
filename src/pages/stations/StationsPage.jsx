import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStationContext } from "../../hooks/useStationContext";
import SlotsModal from "../../components/stations/SlotsModal";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import showToast from "../../utils/toastNotification";
import { Search, Power, PowerOff, Zap, Download } from "lucide-react";

const StationsPage = () => {
  const {
    stations,
    loading,
    error,
    fetchStations,
    deactivateStation,
    activateStation,
  } = useStationContext();

  const [slotsModalStation, setSlotsModalStation] = useState(null);
  const [actionTarget, setActionTarget] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  useEffect(() => {
    if (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error.data || error.message || "An unknown error occurred.";
      showToast("error", errorMessage);
    }
  }, [error]);

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const name = station?.name || "";
      const type = station?.type || "";
      const id = station?.id || "";
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        name.toLowerCase().includes(searchLower) ||
        type.toLowerCase().includes(searchLower) ||
        id.toLowerCase().includes(searchLower);
      const matchesStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && station.isActive) ||
        (selectedStatus === "inactive" && !station.isActive);
      const matchesType =
        selectedType === "all" ||
        type.toLowerCase() === selectedType.toLowerCase();
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [stations, searchTerm, selectedStatus, selectedType]);

  const statistics = useMemo(() => {
    const total = stations.length;
    const active = stations.filter((s) => s.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [stations]);

  const handleViewSlots = (station) => {
    setSlotsModalStation(station);
  };

  const handleCloseSlotsModal = () => {
    setSlotsModalStation(null);
  };

  const openActionModal = (station) => setActionTarget(station);
  const closeActionModal = () => setActionTarget(null);

  const confirmAction = async () => {
    if (actionTarget) {
      const isDeactivating = actionTarget.isActive;
      const action = isDeactivating ? deactivateStation : activateStation;
      const actionName = isDeactivating ? "deactivated" : "activated";
      const result = await action(actionTarget.id);
      if (result.success) {
        showToast("success", `Station "${actionTarget.name}" ${actionName}.`);
      } else {
        showToast("error", result.data);
      }
      closeActionModal();
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedType("all");
  };

  const exportToCSV = () => {
    if (filteredStations.length === 0) return;
    const headers = [
      "ID",
      "Name",
      "Type",
      "Latitude",
      "Longitude",
      "Status",
      "Total Slots",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredStations.map((s) => {
        const row = [
          s.id,
          `"${s.name.replace(/"/g, '""')}"`,
          s.type,
          s.location?.coordinates?.[1] || 0,
          s.location?.coordinates?.[0] || 0,
          s.isActive ? "Active" : "Inactive",
          s.slots?.length || 0,
        ];
        return row.join(",");
      }),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `stations-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading && stations.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Stations Management
          </h1>
          <p className="text-sm text-gray-600">
            Oversee all registered charging stations.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToCSV}
            className="inline-flex items-center justify-center px-4 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="h-4 w-4 mr-2" /> Export
          </button>
          <Link
            to="/stations/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white font-medium rounded-lg shadow-sm hover:bg-black transition-colors"
          >
            Create Station
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Stations</p>
              <p className="text-xl font-bold text-gray-900">
                {statistics.total}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-3">
              <Power className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-xl font-bold text-green-600">
                {statistics.active}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mr-3">
              <PowerOff className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-xl font-bold text-red-600">
                {statistics.inactive}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by ID, Name, or Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 border rounded-lg transition-colors whitespace-nowrap"
          >
            Clear Filters
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Types</option>
              <option value="ac">AC</option>
              <option value="dc">DC</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredStations.length} of {stations.length} stations
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location (Lng, Lat)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slots
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStations.map((station) => {
              const availableSlots =
                station?.slots?.filter((slot) => slot.isAvailable).length || 0;
              const totalSlots = station?.slots?.length || 0;
              const longitude = station?.location?.coordinates?.[0] || 0;
              const latitude = station?.location?.coordinates?.[1] || 0;
              return (
                <tr key={station.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {station.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        station.type === "DC"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {station.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {longitude.toFixed(4)}, {latitude.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span
                      className={`font-medium ${
                        availableSlots > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {availableSlots}/{totalSlots}
                    </span>
                    <span className="text-gray-500 ml-1"> available</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {station.isActive ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    <button
                      onClick={() => handleViewSlots(station)}
                      className="text-gray-600 hover:text-gray-900 mr-4 font-medium"
                    >
                      View Slots
                    </button>
                    <Link
                      to={`/stations/edit/${station.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    {station.isActive ? (
                      <button
                        onClick={() => openActionModal(station)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => openActionModal(station)}
                        className="text-green-600 hover:text-green-900 font-medium"
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SlotsModal
        isOpen={!!slotsModalStation}
        onClose={handleCloseSlotsModal}
        station={slotsModalStation}
      />
      <ConfirmationModal
        isOpen={!!actionTarget}
        onClose={closeActionModal}
        onConfirm={confirmAction}
        title={`${
          actionTarget?.isActive ? "Deactivate" : "Reactivate"
        } Station`}
        message={`Are you sure you want to ${
          actionTarget?.isActive ? "deactivate" : "reactivate"
        } "${actionTarget?.name}"?`}
        confirmText={actionTarget?.isActive ? "Deactivate" : "Reactivate"}
        isLoading={loading}
      />
    </div>
  );
};

export default StationsPage;
