# User Explorer - Fullstack Challenge

User Explorer es una aplicación web robusta diseñada para la gestión y consulta de usuarios. Este proyecto ha sido desarrollado como respuesta a un desafío técnico, implementando una arquitectura moderna de microservicios contenerizados.

## 🚀 Inicio Rápido con Docker

La forma más sencilla de ejecutar el proyecto completo es utilizando **Docker Compose**. Esto levantará automáticamente la base de datos PostgreSQL, la API de .NET y el frontend de Next.js.

### Requisitos Previos
- [Docker](https://www.docker.com/get-started) instalado.
- [Docker Compose](https://docs.docker.com/compose/install/) instalado.

### Instrucciones de Despliegue

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd UserExplorer
    ```

2.  **Levantar los servicios:**
    ```bash
    docker-compose up --build
    ```

3.  **Acceder a la aplicación:**
    - **Frontend:** [http://localhost:3000](http://localhost:3000)
    - **Backend API:** [http://localhost:5000](http://localhost:5000)
    - **API Documentation (Swagger):** [http://localhost:5000/swagger](http://localhost:5000/swagger) (Disponible en modo desarrollo)

---

## 🏗️ Arquitectura del Sistema

El proyecto está dividido en dos componentes principales:

### 1. Backend (ASP.NET Core 9)
Una API RESTful construida con C# que maneja la lógica de negocio, persistencia de datos y validaciones.
- **Base de Datos:** PostgreSQL.
- **ORM:** Entity Framework Core.
- **Patrones:** Repository/Service pattern, DTOs, AutoMapper.

### 2. Frontend (Next.js 15)
Una interfaz de usuario moderna y responsiva construida con React.
- **Estilos:** Tailwind CSS + Shadcn UI.
- **Estado:** React Query (TanStack Query) para sincronización de servidor.
- **UX:** Soporte para modo oscuro, internacionalización (EN/ES) y diseño adaptativo.

---

## 🛠️ Estructura del Repositorio

```text
UserExplorer/
├── backend/            # API REST en .NET 9
├── frontend/           # Aplicación Next.js (App Router)
├── docker-compose.yml  # Orquestación de contenedores
```

## 📝 Notas de Implementación
- **Migraciones Automáticas:** El backend está configurado para aplicar las migraciones de la base de datos automáticamente al iniciar, por lo que no es necesario ejecutar comandos manuales de SQL.
- **Datos de Ejemplo:** Al iniciar por primera vez, la base de datos estará vacía y lista para que crees tu primer usuario a través del formulario.

---
Desarrollado como parte de un Challenge Técnico Fullstack.
