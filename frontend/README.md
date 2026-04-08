# User Explorer - Frontend

El frontend de **User Explorer** es una aplicación moderna de una sola página (SPA) construida con **Next.js 15** y **React**. Está diseñada para ofrecer una experiencia de usuario fluida, rápida y accesible en cualquier dispositivo.

## ✨ Características Principales

- **Gestión Completa de Usuarios:** Listado, visualización detallada, creación, edición y eliminación (CRUD).
- **Búsqueda Avanzada:** Filtrado en tiempo real por nombre, correo, empresa y ciudad.
- **Diseño Responsivo:** Interfaz optimizada para móviles, tablets y desktops utilizando Tailwind CSS.
- **Modo Oscuro/Claro:** Soporte nativo para temas visuales.
- **Internacionalización (i18n):** Soporte multi-idioma para Inglés y Español.
- **Optimización de Carga:** Uso de *Skeletons* de carga para una mejor percepción de velocidad.

## 🛠️ Stack Tecnológico

- **Next.js 15 (App Router):** Framework de React para el renderizado y enrutamiento.
- **TypeScript:** Tipado estático para mayor seguridad en el código.
- **Tailwind CSS:** Framework de estilos basado en utilidades.
- **Shadcn UI:** Librería de componentes de alta calidad (basada en Radix UI).
- **TanStack Query (React Query):** Gestión de estado asíncrono y caché de servidor.
- **React Hook Form + Zod:** Manejo y validación robusta de formularios.
- **Lucide React:** Set de iconos modernos y consistentes.

## 🚀 Ejecución Local (Sin Docker)

Si deseas ejecutar el frontend de forma independiente:

1.  **Requisitos:** Node.js 18 o superior.
2.  **Instalar Dependencias:**
    ```bash
    cd frontend
    npm install
    ```
3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env.local` con:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```
4.  **Iniciar Desarrollo:**
    ```bash
    npm run dev
    ```

## 📂 Estructura de Carpetas

- `app/`: Rutas y páginas de la aplicación (Next.js App Router).
- `components/`: Componentes de UI reutilizables y específicos de lógica.
- `hooks/`: Custom hooks para lógica compartida y consumo de API.
- `lib/`: Utilidades, tipos de TypeScript y configuración de i18n.
- `public/`: Activos estáticos.

## 🌍 Internacionalización

La aplicación detecta el idioma del navegador o permite al usuario cambiarlo manualmente a través de un selector en la barra de navegación. Los archivos de traducción se encuentran en `lib/i18n/`.
