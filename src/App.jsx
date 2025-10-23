import React from "react";
import AppRouter from "./router";
import "./styles/tailwind.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <AppRouter />
      <ToastContainer autoClose={2000} />
    </div>
  );
}

export default App;
