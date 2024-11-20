from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from datetime import date

router = APIRouter()

# Modelo de entrada
class RegistroCamion(BaseModel):
    fecha_salida: str
    hora_salida: str
    camion_nro: int
    placa_camion: str
    peso_vacio: float
    peso_total: float
    peso_saco: Optional[float] = 70

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
            peso_saco REAL
        )
    """)
    conn.commit()
    conn.close()

create_table()

# Endpoint para guardar datos
@router.post("/agenda/")
def guardar_registro(registro: RegistroCamion):
    conn = sqlite3.connect("agenda.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO camiones (fecha_salida, hora_salida, camion_nro, placa_camion, peso_vacio, peso_total, peso_saco)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        registro.fecha_salida,
        registro.hora_salida,
        registro.camion_nro,
        registro.placa_camion,
        registro.peso_vacio,
        registro.peso_total,
        registro.peso_saco
    ))
    conn.commit()
    conn.close()
    return {"message": "Registro guardado exitosamente"}

# Endpoint para obtener registros filtrados por fecha
@router.get("/agenda/", response_model=List[RegistroCamion])
def obtener_registros(fecha_inicio: Optional[str] = Query(None), fecha_fin: Optional[str] = Query(None)):
    conn = sqlite3.connect("agenda.db")
    cursor = conn.cursor()

    query = "SELECT fecha_salida, hora_salida, camion_nro, placa_camion, peso_vacio, peso_total, peso_saco FROM camiones"
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
        }
        for r in registros
    ]
