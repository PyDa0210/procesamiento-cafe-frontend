import React, { useState, useEffect } from "react";
import axios from "axios";
import "../scss/Agenda.scss"; // Importar estilos SCSS

const Agenda = () => {
  const [registros, setRegistros] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  // Función para obtener registros del backend
  const obtenerRegistros = async () => {
    try {
      setMensajeError(""); // Reinicia el mensaje de error
      const params = {};
      if (fechaInicio) params.fecha_inicio = fechaInicio;
      if (fechaFin) params.fecha_fin = fechaFin;

      const response = await axios.get("http://127.0.0.1:8000/agenda/", { params });

      if (response.data.length === 0) {
        setMensajeError("No se encontraron registros para las fechas seleccionadas.");
      }

      setRegistros(response.data);
    } catch (error) {
      console.error("Error al obtener registros:", error);
      setMensajeError("Hubo un error al obtener los registros. Intenta nuevamente.");
    }
  };

  // Obtener registros al cargar el componente
  useEffect(() => {
    obtenerRegistros();
  }, []);

  return (
    <div className="agenda">
      <h2>Agenda</h2>

      <div className="filtros">
        <label>Fecha Inicio:</label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <label>Fecha Fin:</label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <button onClick={obtenerRegistros}>Filtrar</button>
      </div>

      {mensajeError && <div className="mensaje-error">{mensajeError}</div>}

      {registros.length > 0 ? (
        <table className="tabla-registros">
          <thead>
            <tr>
              <th>Fecha de Salida</th>
              <th>Hora de Salida</th>
              <th>Número de Camión</th>
              <th>Placa del Camión</th>
              <th>Peso Vacío</th>
              <th>Peso Cargado</th>
              <th>Peso por Saco</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro, index) => (
              <tr key={index}>
                <td>{registro.fecha_salida}</td>
                <td>{registro.hora_salida}</td>
                <td>{registro.camion_nro}</td>
                <td>{registro.placa_camion}</td>
                <td>{registro.peso_vacio} kg</td>
                <td>{registro.peso_total} kg</td>
                <td>{registro.peso_saco} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !mensajeError && <div className="sin-resultados">No hay registros para mostrar.</div>
      )}
    </div>
  );
};

export default Agenda;
