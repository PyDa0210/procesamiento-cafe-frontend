from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelo de entrada para datos de los camiones
class CamionData(BaseModel):
    fecha_salida: str
    hora_salida: str
    camion_nro: int
    placa_camion: str
    peso_vacio: float
    peso_total: float
    peso_saco: float = 70  # Peso estándar por saco

# Crear la base de datos y la tabla
def create_table():
    conn = sqlite3.connect("agenda.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS camiones (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha_salida TEXT,
            hora_salida TEXT,
            camion_nro INTEGER,
            placa_camion TEXT,
            peso_vacio REAL,
            peso_total REAL,
            peso_saco REAL,
            peso_carga REAL,
            sacos_carga INTEGER,
            sacos_defectuosos INTEGER,
            sacos_especiales INTEGER,
            peso_restante REAL
        )
    """)
    conn.commit()
    conn.close()

create_table()

# Endpoint para procesar camión y guardar en la base de datos
@app.post("/procesar-camion/")
def procesar_camion(data: CamionData):
    # Calcular la carga exacta
    carga = data.peso_total - data.peso_vacio
    if carga < 0:
        raise HTTPException(status_code=400, detail="El peso total no puede ser menor al peso vacío del camión.")
    
    # Calcular cantidad de sacos y el peso restante
    sacos_carga = int(carga // data.peso_saco)
    peso_restante = carga % data.peso_saco

    # Contadores para tipos de sacos
    sacos_defectuosos = 0
    sacos_especiales = 0

    # Clasificar sacos
    if data.peso_saco == 70:
        sacos_especiales = sacos_carga
    else:
        sacos_defectuosos = sacos_carga

    # Guardar en la base de datos
    conn = sqlite3.connect("agenda.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO camiones (fecha_salida, hora_salida, camion_nro, placa_camion, peso_vacio, peso_total, peso_saco,
                              peso_carga, sacos_carga, sacos_defectuosos, sacos_especiales, peso_restante)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.fecha_salida,
        data.hora_salida,
        data.camion_nro,
        data.placa_camion,
        data.peso_vacio,
        data.peso_total,
        data.peso_saco,
        carga,
        sacos_carga,
        sacos_defectuosos,
        sacos_especiales,
        peso_restante
    ))
    conn.commit()
    conn.close()

    # Generar resultado
    resultado = {
        "peso_carga": carga,
        "sacos_carga": sacos_carga,
        "sacos_defectuosos": sacos_defectuosos,
        "sacos_especiales": sacos_especiales,
        "peso_restante": peso_restante,
    }

    # Mensajes adicionales
    mensajes = []
    if sacos_especiales > 0:
        mensajes.append("Hay sacos especiales - Guardarlos en un contenedor especial.")
    if sacos_defectuosos > 0:
        mensajes.append("Hay sacos defectuosos - Guardarlos en un contenedor normal.")
    if sacos_carga >= 1000:
        mensajes.append("Cambio de contenedor necesario. El límite de 1000 sacos ha sido alcanzado.")
    if peso_restante > 0:
        mensajes.append(f"Peso restante no clasificado: {peso_restante} kg.")

    resultado["mensajes"] = mensajes

    return resultado

# Endpoint para obtener registros de la agenda
@app.get("/agenda/")
def obtener_registros(fecha_inicio: Optional[str] = Query(None), fecha_fin: Optional[str] = Query(None)):
    conn = sqlite3.connect("agenda.db")
    cursor = conn.cursor()

    query = """
        SELECT fecha_salida, hora_salida, camion_nro, placa_camion, peso_vacio, peso_total, peso_saco,
               peso_carga, sacos_carga, sacos_defectuosos, sacos_especiales, peso_restante
        FROM camiones
    """
    params = []

    if fecha_inicio and fecha_fin:
        query += " WHERE fecha_salida BETWEEN ? AND ?"
        params.extend([fecha_inicio, fecha_fin])

    cursor.execute(query, params)
    registros = cursor.fetchall()
    conn.close()

    return [
        {
            "fecha_salida": r[0],
            "hora_salida": r[1],
            "camion_nro": r[2],
            "placa_camion": r[3],
            "peso_vacio": r[4],
            "peso_total": r[5],
            "peso_saco": r[6],
            "peso_carga": r[7],
            "sacos_carga": r[8],
            "sacos_defectuosos": r[9],
            "sacos_especiales": r[10],
            "peso_restante": r[11],
        }
        for r in registros
    ]
