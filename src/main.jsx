import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // ✅ import Router
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { seedDemoData } from "./api/mockApi";
import "./styles.css";

// ✅ Seed mock data for demo users/courses
seedDemoData();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* ✅ Wrap App in BrowserRouter */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
