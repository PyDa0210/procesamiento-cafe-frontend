import React from "react";
import { Link } from "react-router-dom";
import "../scss/Sidebar.scss";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>Almacafé</h3>
      <nav>
        <ul>
          {/* Botón para ir a MainScreen */}
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/procesar-camiones">Procesamiento de Camiones</Link>
          </li>
          <li>
            <Link to="/agenda">Agenda</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
