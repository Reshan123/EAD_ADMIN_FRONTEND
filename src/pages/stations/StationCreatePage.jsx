import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStationContext } from "../../hooks/useStationContext";
import showToast from "../../utils/toastNotification";
import MapPicker from "../../components/stations/MapPicker"; 

const StationCreatePage = () => {
  const navigate = useNavigate();
  const { createStation, loading } = useStationContext();

  const [name, setName] = useState("");
  const [type, setType] = useState("AC");
  const [latitude, setLatitude] = useState(6.9147); 
  const [longitude, setLongitude] = useState(79.9729);
  const [numberOfSlots, setNumberOfSlots] = useState(1);

  const handleLocationChange = (newLocation) => {
    setLatitude(newLocation.lat);
    setLongitude(newLocation.lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      showToast("error", "Please provide a station name.");
      return;
    }

    const stationData = {
      name,
      type,
      latitude,
      longitude,
      numberOfSlots: parseInt(numberOfSlots, 10),
    };

    const result = await createStation(stationData);

    if (result.success) {
      showToast("success", "Station created successfully!");
      navigate("/stations");
    } else {
      showToast("error", result.error?.message || "Failed to create station.");
    }
  };

  return (
    <div className="h-full w-full">
      <div className="p-6">
        <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Station</h1>
        <p className="text-sm text-gray-600">
          Add a new charging station to the network
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
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="e.g. SLIIT Campus North Gate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Location
              </label>
              <p className="text-xs text-gray-500 mb-2">
                Drag the pin to set the exact station location.
              </p>
              <MapPicker
                center={{ lat: latitude, lng: longitude }}
                onLocationChange={handleLocationChange}
              />
              <div className="mt-2 text-xs text-gray-600">
                Selected Coordinates: Lat: {latitude.toFixed(4)}, Lng:{" "}
                {longitude.toFixed(4)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Station Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option>AC</option>
                  <option>DC</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="slots"
                  className="block text-sm font-medium text-gray-700"
                >
                  Number of Slots
                </label>
                <input
                  id="slots"
                  type="number"
                  value={numberOfSlots}
                  onChange={(e) => setNumberOfSlots(e.target.value)}
                  min={1}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Station"}
              </button>
            </div>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default StationCreatePage;
