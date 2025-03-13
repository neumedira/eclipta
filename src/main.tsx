import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initializeFirebaseData } from "./firebase";

// Inisialisasi data Firebase
initializeFirebaseData().catch((error) => {
  console.error("Failed to initialize Firebase data:", error);
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
