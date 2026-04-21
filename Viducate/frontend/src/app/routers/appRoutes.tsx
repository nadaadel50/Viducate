import { BrowserRouter, Route, Routes } from "react-router";
import { ProtectedRoute } from "./protextedRoutes";
import App from "../../App";
import { MainPage } from "../../features/watch_video/presentation/pages/main_page";
import { SelectedTopicProvider } from "../../features/watch_video/presentation/context/topic_provider";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        /* here we will put all the public routes that don't need authentication
        to access them like landing page, signup */
        <Route
          path="/"
          element={
            <SelectedTopicProvider>
              <MainPage />
            </SelectedTopicProvider>
          }
        />{" "}
        /* for example */
        <Route element={<ProtectedRoute />}>
          {" "}
          // will prmove "/protected" soon /* here we will put all the protected
          routes that need authentication to access them */
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
