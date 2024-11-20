# Almacafé - Sistema de Procesamiento de Camiones y Clasificación de Café

Este proyecto es una aplicación desarrollada como parte de la asignatura **"Mantenimiento y Pruebas de Software"** de la carrera **Ingeniería de Software** en la **Universidad Surcolombiana**. El sistema está diseñado para automatizar el procesamiento de camiones y la clasificación de sacos de café en la empresa **Almacafé**.

## **Descripción del Proyecto**

El sistema permite:
- Procesar la descarga de camiones transportando café y calcular automáticamente:
  - Peso de la carga.
  - Cantidad de sacos clasificados como "Especiales" o "Defectuosos".
  - Espacios ocupados en los contenedores.
- Registrar información relevante sobre cada camión, incluyendo:
  - Fecha y hora de salida.
  - Número y placa del camión.
  - Peso vacío y cargado del camión.
- Llevar un historial detallado de los camiones procesados a través del módulo **Agenda**, donde se pueden consultar y filtrar los registros por fecha.

## **Tecnologías Utilizadas**

### **Frontend**
- **React.js**: Desarrollo de la interfaz de usuario interactiva y dinámica.
- **React Router**: Manejo de rutas y navegación entre módulos.
- **SCSS**: Estilización y diseño consistente, con colores y tipografía amigables para el usuario.

### **Backend**
- **FastAPI**: Framework para manejar las solicitudes HTTP, cálculos y lógica de negocio.
- **SQLite**: Base de datos ligera para almacenar los registros de camiones y clasificaciones.

### **Herramientas Adicionales**
- **Git y GitHub**: Control de versiones y colaboración.
- **Axios**: Para la comunicación entre el frontend y el backend.

## **Características Principales**

### **Procesamiento de Camiones**
- Cálculo automático de:
  - Peso de la carga (`peso_total - peso_vacio`).
  - Clasificación de sacos:
    - **Especiales**: Sacos con peso exacto de 70 kg.
    - **Defectuosos**: Sacos fuera de especificación.
  - Espacios ocupados en los contenedores (capacidad máxima de 1000 sacos por contenedor).
- Validación de datos ingresados, como:
  - El peso total debe ser mayor al peso vacío.
  - Formato correcto para la placa del camión (solo letras mayúsculas y números, máximo 6 caracteres).

### **Agenda**
- Registro automático de cada camión procesado.
- Visualización de una tabla con:
  - Fecha y hora de salida del camión.
  - Número y placa del camión.
  - Peso vacío, cargado y peso por saco.
- Filtrado de registros por rangos de fechas.

### **Interfaz de Usuario**
- **Pantalla de inicio**: Un mensaje de bienvenida y orientación al usuario para utilizar el menú lateral.
- **Sidebar**: Menú de navegación fijo con acceso a:
  - Inicio.
  - Procesamiento de Camiones.
  - Agenda.

## **Instalación y Ejecución**

### **Requisitos Previos**
- Node.js y npm instalados en tu máquina.
- Python 3.8 o superior instalado.
- Git instalado.

