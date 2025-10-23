import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStationContext } from "../../hooks/useStationContext";
import showToast from "../../utils/toastNotification";
import MapPicker from "../../components/stations/MapPicker";

const StationEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    stations,
    updateStation,
    loading: contextLoading,
  } = useStationContext();

  const [name, setName] = useState("");
  const [type, setType] = useState("AC");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [initialStation, setInitialStation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log(initialStation);
  useEffect(() => {
    const stationToEdit = stations.find((s) => s.id === id);
    if (stationToEdit) {
      setInitialStation(stationToEdit);
      setName(stationToEdit.name);
      setType(stationToEdit.type);
      setLatitude(stationToEdit.location.coordinates[1]);
      setLongitude(stationToEdit.location.coordinates[0]);
      setIsLoading(false);
    } else if (stations.length > 0 && !stationToEdit) {
      showToast("error", "Station not found.");
      navigate("/stations");
    }
  }, [id, stations, navigate]);

  const handleLocationChange = (newLocation) => {
    setLatitude(newLocation.lat);
    setLongitude(newLocation.lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) {
      showToast("error", "Station name cannot be empty.");
      return;
    }

    const updateDto = {
      name: name,
      type: type,
      latitude: latitude,
      longitude: longitude,
    };

    console.log("Sending Update DTO:", updateDto);

    const result = await updateStation(id, updateDto);

    if (result.success) {
      showToast("success", "Station updated successfully!");
      navigate("/stations");
    } else {
      showToast("error", result.error?.message || "Failed to update station.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit Station: <span className="text-indigo-600">{name}</span>
        </h1>
        <p className="text-sm text-gray-600">
          Update the details for this charging station.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Station Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Update Location
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Drag the pin to correct the station location.
              </p>
              <MapPicker
                center={{ lat: latitude, lng: longitude }}
                onLocationChange={handleLocationChange}
              />
              <div className="mt-2 text-xs text-gray-600">
                Current Coordinates: Lat: {latitude.toFixed(4)}, Lng:{" "}
                {longitude.toFixed(4)}
              </div>
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700"
              >
                Station Type
              </label>
              <select
                id="type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option>AC</option>
                <option>DC</option>
              </select>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={contextLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {contextLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StationEditPage;
