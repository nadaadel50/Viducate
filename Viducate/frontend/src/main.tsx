import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { AppProviders } from "./app/providers/app_provider.tsx";
import { AppRoutes } from "./app/routers/appRoutes.tsx";


import { ErrorBoundary } from "./app/providers/ErrorBoundary";
import { setUpApiInterceptors } from "./core/api/apiInterceptors";

setUpApiInterceptors();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppProviders>
        <AppRoutes/>
      </AppProviders>
    </ErrorBoundary>
  </StrictMode>,
);
