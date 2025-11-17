import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { PhilosophyProvider } from "./contexts/master/PhilosophyContext.tsx";
import { PolicyProvider } from "./contexts/master/PolicyContext.tsx";
import { Development_areasProvider } from "./contexts/master/development_areasContext.tsx";
import { SubareaContextProvider } from "./contexts/master/SubareaContext.tsx";
import { CompetenciesProvider } from "./contexts/master/CompetenciesContext.tsx";
import { FiguresProvider } from "./contexts/master/FiguresContext.tsx";
import { OverallPlanProvider } from "./contexts/OverallplanContext.tsx";

import "./i18n";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <PhilosophyProvider>
        <PolicyProvider>
          <Development_areasProvider>
            <SubareaContextProvider>
              <CompetenciesProvider>
                <FiguresProvider>
                  <OverallPlanProvider>
                    <App />
                  </OverallPlanProvider>
                </FiguresProvider>
              </CompetenciesProvider>
            </SubareaContextProvider>
          </Development_areasProvider>
        </PolicyProvider>
      </PhilosophyProvider>
    </AuthProvider>
  </React.StrictMode>
);
