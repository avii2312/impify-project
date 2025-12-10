import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import GamificationProvider from "@/components/gamify/GamificationProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppRoutes from "@/AppRoutes";
import "./index.css";

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <GamificationProvider>
            <Router>
              <AppRoutes />
            </Router>
          </GamificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;