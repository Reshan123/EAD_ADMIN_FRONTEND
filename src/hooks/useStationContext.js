import { useContext } from "react";
import { StationContext } from "../context/StationContext";

export const useStationContext = () => {
  const context = useContext(StationContext);
  if (!context) {
    throw new Error("useStationContext must be used within a StationProvider");
  }
  return context;
};
