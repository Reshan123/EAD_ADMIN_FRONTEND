import React, { createContext, useState, useCallback } from "react";
import { stationApi } from "../api/stationApi";
import showToast from "../utils/toastNotification";

export const StationContext = createContext();

export const StationProvider = ({ children }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stationApi.getAllStations();
      setStations(response.data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      setError("Could not fetch stations. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getStationById = useCallback(async (stationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await stationApi.getStationById(stationId);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to fetch station:", err);
      setError("Failed to fetch station details.");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const createStation = useCallback(async (stationData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await stationApi.createStation(stationData);
      // Add the new station to the existing list instead of refetching
      setStations((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to create station:", err);
      setError("Failed to create station.");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStation = useCallback(async (stationId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await stationApi.updateStation(stationId, updateData);
      // Update the specific station in the list
      setStations((prev) =>
        prev.map((station) =>
          station.id === stationId ? { ...station, ...response.data } : station
        )
      );
      return { success: true, data: response.data };
    } catch (err) {
      console.error("Failed to update station:", err);
      setError("Failed to update station.");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const deactivateStation = useCallback(async (stationId) => {
    setLoading(true);
    setError(null);
    try {
      await stationApi.deactivateStation(stationId);
      setStations((prev) =>
        prev.map((station) =>
          station.id === stationId ? { ...station, isActive: false } : station
        )
      );
      return { success: true };
    } catch (err) {
      console.error("Failed to deactivate station:", err);
      const errorMessage = err.data || "Failed to deactivate station.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const activateStation = useCallback(async (stationId) => {
    setLoading(true);
    setError(null);
    try {
      await stationApi.activateStation(stationId);
      setStations((prev) =>
        prev.map((station) =>
          station.id === stationId ? { ...station, isActive: true } : station
        )
      );
      return { success: true };
    } catch (err) {
      console.error("Failed to activate station:", err);
      setError("Failed to activate station.");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  const checkSlotAvailability = useCallback(
    async (stationId, { desiredStartTime, desiredEndTime }) => {
      try {
        const response = await stationApi.getAvailableSlots(stationId, {
          desiredStartTime,
          desiredEndTime,
        });
        return { success: true, availableSlots: response.data };
      } catch (err) {
        console.error("Failed to check slot availability:", err);
        showToast("error", "Could not check slot availability.");
        return { success: false, availableSlots: [] };
      }
    },
    []
  );

  const updateSlotAvailability = useCallback(
    async (stationId, slotId, isAvailable) => {
      // This action sets its own loading state locally, not the main context loading.
      try {
        await stationApi.updateSlotStatus(stationId, slotId, isAvailable);

        // Update the local state for an instant UI change
        setStations((prevStations) =>
          prevStations.map((station) => {
            if (station.id === stationId) {
              const updatedSlots = station.slots.map((slot) =>
                slot.slotId === slotId ? { ...slot, isAvailable } : slot
              );
              return { ...station, slots: updatedSlots };
            }
            return station;
          })
        );
        return { success: true };
      } catch (err) {
        console.error("Failed to update slot status:", err);
        // Return the specific error message from the backend
        return {
          success: false,
          error: err.response?.data || "Failed to update slot.",
        };
      }
    },
    []
  );

  const value = {
    stations,
    loading,
    error,
    fetchStations,
    createStation,
    updateStation,
    deactivateStation,
    activateStation,
    checkSlotAvailability,
    getStationById,
    updateSlotAvailability,
  };

  return (
    <StationContext.Provider value={value}>{children}</StationContext.Provider>
  );
};
