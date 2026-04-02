import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import CommandCenter from "./pages/CommandCenter";
import ClinicalHub from "./pages/IncidentsHub";
import Finance from "./pages/Finance";
import GDriveSync from "./pages/GDriveSync";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/clinical" element={<ClinicalHub />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/sync" element={<GDriveSync />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
