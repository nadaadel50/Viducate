import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { AppProviders } from "./app/providers/app_provider.tsx";
import { AppRoutes } from "./app/routers/appRoutes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <AppRoutes/>
    </AppProviders>
  </StrictMode>,
);
