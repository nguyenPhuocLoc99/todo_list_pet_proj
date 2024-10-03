import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { RenderProvider } from "./context/RenderContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RenderProvider>
      <App />
    </RenderProvider>
  </StrictMode>
);
