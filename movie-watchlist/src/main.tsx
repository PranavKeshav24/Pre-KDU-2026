import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import ThemeRegistry from "../components/theme-registry";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeRegistry>
      <App />
    </ThemeRegistry>
  </StrictMode>
);
