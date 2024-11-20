import React, { useState } from "react";
import axios from "axios";
import "../scss/ProcesarCamionForm.scss";

const ProcesarCamionForm = () => {
  const [camionNro, setCamionNro] = useState("");
  const [placaCamion, setPlacaCamion] = useState("");
  const [pesoVacio, setPesoVacio] = useState("");
  const [pesoTotal, setPesoTotal] = useState("");
  const [pesoSaco, setPesoSaco] = useState(70);
  const [fechaSalida, setFechaSalida] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [resultado, setResultado] = useState(null);
  const [mensajeError, setMensajeError] = useState("");

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensajeError("");
    setResultado(null);

    // Validaciones adicionales
    if (parseFloat(pesoTotal) <= parseFloat(pesoVacio)) {
      setMensajeError("El peso total del camión debe ser mayor que el peso vacío.");
      return;
    }

    if (!/^[A-Z0-9]{1,6}$/.test(placaCamion)) {
      setMensajeError("La placa debe contener solo letras mayúsculas y números, con un máximo de 6 caracteres.");
      return;
    }

    if (camionNro <= 0 || !Number.isInteger(Number(camionNro))) {
      setMensajeError("El número de camión debe ser un número entero positivo.");
      return;
    }

    if (!fechaSalida) {
      setMensajeError("La fecha de salida es obligatoria.");
      return;
    }

    if (!horaSalida) {
      setMensajeError("La hora de salida es obligatoria.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/procesar-camion/", {
        camion_nro: parseInt(camionNro),
        placa_camion: placaCamion,
        peso_vacio: parseFloat(pesoVacio),
        peso_total: parseFloat(pesoTotal),
        peso_saco: parseFloat(pesoSaco),
        fecha_salida: fechaSalida,
        hora_salida: horaSalida,
      });

      setResultado(response.data);
    } catch (error) {
      console.error("Error al procesar el camión:", error);
      setMensajeError("Hubo un error al procesar los datos. Verifica los valores ingresados.");
    }
  };

  return (
    <div className="procesar-camion-form">
      <h2>Procesar Camión</h2>
      <form onSubmit={manejarEnvio}>
        <div>
          <label>Camión Nro:</label>
          <input
            type="number"
            value={camionNro}
            onChange={(e) => setCamionNro(e.target.value)}
            min="1"
            required
          />
        </div>
        <div>
          <label>Placa del camión (máximo 6 caracteres):</label>
          <input
            type="text"
            value={placaCamion}
            onChange={(e) => setPlacaCamion(e.target.value.toUpperCase())}
            maxLength={6}
            required
          />
        </div>
        <div>
          <label>Peso del camión vacío (kg):</label>
          <input
            type="number"
            value={pesoVacio}
            onChange={(e) => setPesoVacio(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Peso total del camión (kg):</label>
          <input
            type="number"
            value={pesoTotal}
            onChange={(e) => setPesoTotal(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Peso de cada saco (kg) (opcional, por defecto es 70):</label>
          <input
            type="number"
            value={pesoSaco}
            onChange={(e) => setPesoSaco(e.target.value)}
          />
        </div>
        <div>
          <label>Fecha de salida:</label>
          <input
            type="date"
            value={fechaSalida}
            onChange={(e) => setFechaSalida(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Hora de salida:</label>
          <input
            type="time"
            value={horaSalida}
            onChange={(e) => setHoraSalida(e.target.value)}
            required
          />
        </div>
        <button type="submit">Procesar</button>
      </form>

      {mensajeError && <div className="error-message">{mensajeError}</div>}

      {resultado && (
        <div className="resultados">
          <h3>Resultados:</h3>
          <p><strong>Peso exacto de la carga:</strong> {resultado.peso_carga} kg</p>
          <p><strong>Cantidad de sacos:</strong> {resultado.sacos_carga}</p>
          <p><strong>Sacos defectuosos:</strong> {resultado.sacos_defectuosos}</p>
          <p><strong>Sacos especiales:</strong> {resultado.sacos_especiales}</p>
          <p><strong>Peso restante:</strong> {resultado.peso_restante} kg</p>
          <h4>Mensajes:</h4>
          <ul>
            {resultado.mensajes.map((mensaje, index) => (
              <li key={index}>{mensaje}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProcesarCamionForm;
