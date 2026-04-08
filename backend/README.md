# User Explorer - Backend API

Esta es la API REST central para el sistema **User Explorer**, desarrollada con **.NET 9** y **C#**. Proporciona una interfaz robusta para la gestión de usuarios con persistencia en **PostgreSQL**.

## 🛠️ Tecnologías y Librerías

- **ASP.NET Core Web API:** Framework principal.
- **Entity Framework Core (EF Core):** ORM para interacción con la base de datos.
- **Npgsql:** Proveedor de base de datos PostgreSQL para EF Core.
- **AutoMapper:** Mapeo automático entre Entidades y DTOs.
- **Data Annotations:** Validaciones de entrada de datos.
- **CORS:** Configurado para permitir integración fluida con el frontend.

## 📂 Arquitectura

La solución sigue principios de **Clean Architecture** simplificada:

- **Controllers:** Endpoints de la API y manejo de peticiones HTTP.
- **Services:** Lógica de negocio y orquestación de datos.
- **Models:** Entidades del dominio representadas en la base de datos.
- **DTOs (Data Transfer Objects):** Objetos para transferencia de datos entre cliente y servidor.
- **Data:** Contexto de la base de datos y configuraciones de EF.

## 🚀 Ejecución Local (Sin Docker)

Si deseas ejecutar el backend de forma independiente para desarrollo:

1.  **Requisitos:** .NET 9 SDK y una instancia de PostgreSQL corriendo.
2.  **Configuración:** Actualiza la cadena de conexión en `appsettings.json` o mediante variables de entorno.
3.  **Ejecutar:**
    ```bash
    cd backend/UserExplorerApi
    dotnet run
    ```

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api/users` | Listar usuarios (soporta búsqueda, filtrado y paginación) |
| **GET** | `/api/users/{id}` | Obtener detalle de un usuario específico |
| **POST** | `/api/users` | Crear un nuevo usuario |
| **PUT** | `/api/users/{id}` | Actualizar un usuario existente |
| **DELETE** | `/api/users/{id}` | Eliminar un usuario |

### Ejemplo de Filtros (GET)
- `?search=pedro`: Busca por nombre o email.
- `?city=Santo Domingo`: Filtra por ciudad.
- `?company=Tech`: Filtra por empresa.
- `?page=1&pageSize=10`: Control de paginación.

## ✅ Validaciones Implementadas

- **Nombre:** Requerido, máximo 100 caracteres.
- **Email:** Requerido, formato válido de correo electrónico, máximo 150 caracteres.
- **Teléfono/Empresa/Ciudad:** Opcionales, con límites de longitud para integridad de datos.
