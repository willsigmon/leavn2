import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initTheme } from "./lib/theme";

// Initialize theme based on user preference or system settings
initTheme();

createRoot(document.getElementById("root")!).render(<App />);
