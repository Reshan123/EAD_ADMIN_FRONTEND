import React, { useState, useEffect } from "react";
import { useStationContext } from "../../hooks/useStationContext";
import { useAuth } from "../../hooks/useAuth";
import { Loader2 } from "lucide-react";
import showToast from "../../utils/toastNotification";

const SlotsModal = ({ isOpen, onClose, station }) => {
  const { checkSlotAvailability, updateSlotAvailability } = useStationContext();
  const { user } = useAuth();

  const [updatingSlotId, setUpdatingSlotId] = useState(null);

  const isOperator =
    user?.role === "StationOperator" || user?.role === "BackOffice";

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const getInitialStartTime = () => {
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = minutes < 30 ? 30 : 60;
    if (roundedMinutes === 60) {
      now.setHours(now.getHours() + 1);
      now.setMinutes(0, 0, 0);
    } else {
      now.setMinutes(roundedMinutes, 0, 0);
    }
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  };

  const getEndTime = (startTimeString) => {
    const end = new Date(startTimeString);
    end.setHours(end.getHours() + 1);
    return end.toISOString().slice(0, 16);
  };

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    setEndTime(getEndTime(newStartTime));
  };

  const handleToggleSlot = async (slot) => {
    if (!isOperator) return;

    setUpdatingSlotId(slot.slotId);
    const newStatus = !slot.isAvailable;
    const result = await updateSlotAvailability(
      station.id,
      slot.slotId,
      newStatus
    );

    if (result.success) {
      showToast(
        "success",
        `Slot ${slot.slotId} is now ${
          newStatus ? "Available" : "Out of Service"
        }.`
      );
    } else {
      showToast("error", result.error);
    }
    setUpdatingSlotId(null);
  };

  const handleCheckAvailability = async () => {
    if (!station) return;
    setHasChecked(true);
    setIsLoading(true);
    const desiredStartTime = new Date(startTime);
    const desiredEndTime = new Date(endTime);

    if (desiredStartTime >= desiredEndTime) {
      showToast("error", "End time must be after start time.");
      setIsLoading(false);
      return;
    }
    const result = await checkSlotAvailability(station.id, {
      desiredStartTime,
      desiredEndTime,
    });
    if (result.success) {
      setAvailableSlots(result.availableSlots);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      const initialStart = getInitialStartTime();
      setStartTime(initialStart);
      setEndTime(getEndTime(initialStart));
    } else {
      setHasChecked(false);
      setAvailableSlots([]);
    }
  }, [isOpen]);

  if (!isOpen || !station) {
    return null;
  }

  const allSlots = station.slots || [];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Slot Status & Availability
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          For Station:{" "}
          <span className="font-medium text-indigo-600">{station.name}</span>
        </p>

        <div className="border-t border-b border-gray-200 py-4 my-4">
          <h3 className="text-md font-medium text-gray-800 mb-2">
            Check Future Availability
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  className="w-full mt-1 pr-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  value={endTime}
                  min={startTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full mt-1 pr-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleCheckAvailability}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Checking...
                </>
              ) : (
                <>Check Availability</>
              )}
            </button>
            {hasChecked && !isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {allSlots.map((slot) => {
                  const isAvailable = availableSlots.includes(slot.slotId);
                  return (
                    <div
                      key={slot.slotId}
                      className={`p-2 rounded-lg border text-center ${
                        isAvailable
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-100 border-gray-200 text-gray-400"
                      }`}
                    >
                      <p className="font-bold text-lg">Slot {slot.slotId}</p>
                      <p className="text-sm font-semibold">
                        {isAvailable ? "Available" : "Booked"}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-md font-medium text-gray-800 mb-2">
            {isOperator
              ? "Manual Slot Status (Click to Toggle)"
              : "Current Slot Status"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {allSlots.map((slot) => (
              <button
                key={slot.slotId}
                disabled={!isOperator || updatingSlotId === slot.slotId}
                onClick={() => handleToggleSlot(slot)}
                className={`p-4 rounded-lg border text-center relative ${
                  slot.isAvailable
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                } ${
                  isOperator
                    ? "cursor-pointer hover:opacity-75"
                    : "cursor-not-allowed"
                } transition-opacity`}
              >
                {updatingSlotId === slot.slotId && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                    <Loader2 className="animate-spin text-gray-600" />
                  </div>
                )}
                <p className="font-bold text-lg text-gray-700">
                  Slot {slot.slotId}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    slot.isAvailable ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {slot.isAvailable ? "Available" : "Out of Service"}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotsModal;
