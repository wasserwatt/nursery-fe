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
import { ChildrenProvider } from "./contexts/childrenContext.tsx";
import { M_clinicsProvider } from "./contexts/master/M_clinicsContext.tsx";
import { M_feedingProvider } from "./contexts/master/M_feedingContext.tsx";
import { M_vaccineProvider } from "./contexts/master/M_vaccineContext.tsx";
import { M_diseaseProvider } from "./contexts/master/M_diseaseContext.tsx";



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
                    <ChildrenProvider>
                    <M_clinicsProvider>
                    <M_feedingProvider>
                    <M_vaccineProvider>
                    <M_diseaseProvider>
                      <App />
                    </M_diseaseProvider>
                    </M_vaccineProvider>
                    </M_feedingProvider>
                    </M_clinicsProvider>
                  </ChildrenProvider>
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
