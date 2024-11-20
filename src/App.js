import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainScreen from "./components/MainScreen";
import ProcesarCamionForm from "./components/ProcesarCamionForm";
import Agenda from "./components/Agenda";

const App = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: "200px", padding: "20px", width: "100%" }}>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/procesar-camiones" element={<ProcesarCamionForm />} />
          <Route path="/agenda" element={<Agenda />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
