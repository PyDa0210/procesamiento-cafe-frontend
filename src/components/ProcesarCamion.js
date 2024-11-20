import React, { useState } from "react";
import axios from "axios";
import "./scss/ProcesarCamion.scss"; // Importar los estilos SCSS

const ProcesarCamion = () => {
  const [pesoVacio, setPesoVacio] = useState("");
  const [pesoTotal, setPesoTotal] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

  const procesarCamion = async () => {
    try {
      setMensajeError("");
      const response = await axios.post("http://127.0.0.1:8000/procesar-camion/", {
        peso_vacio: parseFloat(pesoVacio),
        peso_total: parseFloat(pesoTotal),
      });
      setResultado(response.data);
    } catch (error) {
      console.error("Error al procesar el camión:", error);
      setMensajeError(
        "Hubo un error al procesar el camión. Por favor, verifica los datos e inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="procesar-camion">
      <h2>Procesar Camión</h2>
      <div>
        <label>
          Peso del camión vacío (kg):
          <input
            type="number"
            value={pesoVacio}
            onChange={(e) => setPesoVacio(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Peso total del camión (kg):
          <input
            type="number"
            value={pesoTotal}
            onChange={(e) => setPesoTotal(e.target.value)}
          />
        </label>
      </div>
      <button onClick={procesarCamion}>Procesar</button>

      {mensajeError && <div className="error-message">{mensajeError}</div>}

      {resultado && (
        <div className="resultados">
          <h3>Resultados:</h3>
          <p>
            <strong>Peso exacto de la carga:</strong> {resultado.peso_carga} kg
          </p>
          <p>
            <strong>Cantidad de sacos:</strong> {resultado.sacos_carga}
          </p>
          <p>
            <strong>Sacos defectuosos:</strong> {resultado.sacos_defectuosos}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProcesarCamion;
