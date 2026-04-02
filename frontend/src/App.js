import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import CommandCenter from "./pages/CommandCenter";
import SmartOutreach from "./pages/SmartOutreach";
import IncidentsHub from "./pages/IncidentsHub";
import GDriveSync from "./pages/GDriveSync";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/crm" element={<SmartOutreach />} />
          <Route path="/clinical" element={<IncidentsHub />} />
          <Route path="/sync" element={<GDriveSync />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
