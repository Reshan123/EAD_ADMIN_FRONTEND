import axiosInstance from "./axiosConfig";

export const stationApi = {
  // GET /api/stations
  getAllStations: () => axiosInstance.get("/stations"),

  // GET /api/stations/{id}
  getStationById: (id) => axiosInstance.get(`/stations/${id}`),

  // GET /api/stations/nearby
  getNearbyStations: ({ latitude, longitude }) =>
    axiosInstance.get("/stations/nearby", { params: { latitude, longitude } }),

  // POST /api/stations
  createStation: (stationData) => axiosInstance.post("/stations", stationData),

  // PUT /api/stations/{id}
  updateStation: (id, stationData) =>
    axiosInstance.put(`/stations/${id}`, stationData),

  // PATCH /api/stations/{id}/deactivate
  deactivateStation: (id) => axiosInstance.patch(`/stations/${id}/deactivate`),

  // GET /api/stations/{id}/available-slots
  getAvailableSlots: (stationId, { desiredStartTime, desiredEndTime }) =>
    axiosInstance.get(`/stations/${stationId}/available-slots`, {
      params: {
        desiredStartTime: desiredStartTime.toISOString(),
        desiredEndTime: desiredEndTime.toISOString(),
      },
    }),

  // PATCH /api/stations/{id}/activate
  activateStation: (id) => axiosInstance.patch(`/stations/${id}/activate`),

  // PATCH /api/stations/{stationId}/slots/{slotId}
  updateSlotStatus: (stationId, slotId, isAvailable) =>
    axiosInstance.patch(`/stations/${stationId}/slots/${slotId}`, {
      isAvailable,
    }),
};
