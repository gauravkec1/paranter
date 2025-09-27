import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

console.log("🚀 Main.tsx executing - starting app...");

const rootElement = document.getElementById("root");
console.log("📍 Root element found:", !!rootElement);

if (!rootElement) {
  console.error("❌ Root element not found!");
  document.body.innerHTML = '<div style="padding: 20px; color: red;">ERROR: Root element not found!</div>';
} else {
  console.log("✅ Creating React root...");
  const root = createRoot(rootElement);
  
  try {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log("✅ React app rendered successfully");
  } catch (error) {
    console.error("❌ Error rendering React app:", error);
    rootElement.innerHTML = '<div style="padding: 20px; color: red;">ERROR: Failed to render app!</div>';
  }
}