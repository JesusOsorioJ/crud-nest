# Task Manager

Este proyecto full-stack de administración de tareas se ha desarrollado utilizando:

- **Backend:** NestJS (con TypeORM, JWT, WebSockets, Multer para upload de archivos, etc.)
- **Frontend:** React + Vite
- **Base de Datos:** PostgreSQL
- **Contenerización:** Docker y Docker Compose

La aplicación incluye:

- `Autenticación` con JWT (registro, login, perfil) y control de roles (USER, ADMIN)
- CRUD de tareas con validaciones, filtros y paginación
- Documentación interactiva con `Swagger`
- Pruebas unitarias y E2E con `Jest y Supertest`
- Emisión de eventos en tiempo real vía `WebSockets` cuando se crea o actualiza una tarea
- `Upload de archivos`: Se utiliza Multer para adjuntar imágenes a las tareas
- `Docker Compose`: Configuración para levantar backend, frontend y PostgreSQL en contenedores

---

## Índice

- [Requisitos](#requisitos)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Ejecución](#instalación-y-ejecución)
  - [Configuración de Variables de Entorno](#configuración-de-variables-de-entorno)
  - [Ejecutar con Docker](#ejecutar-con-docker)
  - [Ejecutar con Nest CLI](#ejecutar-con-nest-cli)
- [Documentación Swagger](#documentación-swagger)
- [Testing](#testing)
  - [Tests Unitarios](#tests-unitarios)
  - [Tests E2E](#tests-e2e)
- [WebSockets](#websockets)
- [Upload de Archivos](#upload-de-archivos)
- [Diseño del Sistema](#diseño-del-sistema)

---

## Requisitos

- Node.js (v16 o superior)
- npm o yarn
- PostgreSQL
- Docker y Docker Compose (opcional)

---

## Características

- **Autenticación y Roles:**  
  Registro, login y obtención de perfil utilizando JWT. Se protege el acceso mediante guards (JwtAuthGuard, RolesGuard) y se manejan roles (USER y ADMIN).

- **CRUD de Tareas:**  
  Permite crear, leer, actualizar y eliminar tareas. Se validan los datos utilizando TypeORM y class-validator, y se implementa filtrado y paginación.

- **Swagger:**  
  La API está documentada y es interactiva en la ruta `/api`. Permite probar endpoints protegidos con JWT.

- **Testing:**  
  Se incluyen pruebas unitarias (para servicios y guards) y E2E (para flujo completo de autenticación y CRUD de tareas) usando Jest y Supertest.

- **WebSockets:**  
  Se emiten eventos en tiempo real (por ejemplo, `taskCreated` y `taskUpdated`) al crear o actualizar una tarea usando Socket.IO.

- **Upload de Archivos:**  
  Se utiliza Multer para subir imágenes asociadas a las tareas. La imagen se almacena en la carpeta `uploads/` y se expone para ser consumida desde el frontend.

- **Contenerización:**  
  Dockerfiles para el backend y frontend junto a un archivo `docker-compose.yml` permiten levantar los servicios (backend, frontend y PostgreSQL) en contenedores.

---

Estructura del Proyecto

La estructura del repositorio es la siguiente:

```
repo/
├── back/ # Código del backend (NestJS)
│ ├── src/
│ │ ├── auth/ # Módulo de autenticación (controladores, servicios, estrategias, guards, etc.)
│ │ ├── tasks/ # Módulo de tareas (controladores, servicios, DTOs, entidades, gateway de WebSockets, etc.)
│ │ ├── users/ # Módulo de usuarios (controladores, servicios, entidades)
│ │ ├── app.module.ts # Módulo principal (configura ConfigModule, TypeOrmModule, etc.)
│ │ └── main.ts # Punto de entrada del backend (configura NestExpressApplication, carga .env, sirve static assets, etc.)
│ ├── .env # Variables de entorno para el backend (SECRET_JWT, DB_HOST, etc.)
│ ├── Dockerfile # Dockerfile para construir la imagen del backend
│ └── package.json # Dependencias y scripts del backend
├── front/ # Código del frontend (Vite + React)
│ ├── src/
│ │ ├── components/ # Componentes de React (formularios, tablas, etc.)
│ │ ├── App.tsx # Componente principal de la aplicación
│ │ └── main.tsx # Punto de entrada para React/Vite
│ ├── .env # Variables de entorno para el frontend (VITE_BACKEND_URL, etc.)
│ ├── Dockerfile # Dockerfile para construir la imagen del frontend
│ ├── nginx.conf # Configuración de Nginx para producción
│ └── package.json # Dependencias y scripts del frontend
└── docker-compose.yml # Orquestador para levantar backend, frontend y PostgreSQL en contenedores
```
---

## Instalación y Ejecución

### Configuración de Variables de Entorno

En este proyecto se incluyen archivos de ejemplo para las variables de entorno.
Puedes copiarlos y renombrarlos a `.env` en cada carpeta.


1. En el backend (carpeta "back"):
   - Copia el archivo `.env.example` y renómbralo a `.env`:
    ```
     cp back/.env.example back/.env
    ```

2. En el frontend (carpeta "front"):
   - Copia el archivo `.env.example` y renómbralo a `.env`:
   ```
     cp front/.env.example front/.env
     ```

Estas variables se utilizan en el código y se referencian en el archivo docker-compose mediante la opción env_file.

### Ejecutar con Docker

Desde la raíz del repositorio, ejecuta:

Desde la raíz del proyecto (donde se encuentra `docker-compose.yml`):

1. **Levantar los contenedores:**

   ```bash
   docker-compose up --build

   ```

2. Acceso:

    - Frontend: http://localhost:5173

    - Backend: http://localhost:3000

    - Swagger: http://localhost:3000/api

    - Base de datos PostgreSQL: en localhost:5432 (según configuraste en Docker Compose)



### Ejecutar con Nest CLI

1. **Backend:**

   - Navega a la carpeta `back/`:
     ```
     cd back
     ```
   - Instala las dependencias:
     ```
     npm install
     ```
   - Levanta el servidor:
     ```
     npm run start:dev
     ```
     El backend estará disponible en `http://localhost:3000`.

2. **Frontend:**
   - Navega a la carpeta `front/`:
     ```
     cd front
     ```
   - Instala las dependencias:
     ```
     npm install
     ```
   - Levanta el servidor de Vite:
     ```
     npm run dev
     ```
     El frontend estará disponible en `http://localhost:5173`.

---

## Documentación Swagger
La API cuenta con documentación Swagger generada automáticamente a partir de los decoradores en los controladores.

- **Acceso:** [http://localhost:3000/api](http://localhost:3000/api)

- Permite probar todos los endpoints, incluidos los protegidos (usa el botón "Authorize" para agregar el token JWT en el formato Bearer <token>).

- Archivo para probar los endpoint y guia de forma de request. En `/back/example.rest`.

---

## Testing

### Tests Unitarios
Se utilizan **Jest** y **ts-jest** para pruebas unitarias de:
- Servicios (AuthService, TasksService)
- Guards (JwtAuthGuard, RolesGuard)

Ejecuta:

 ```bash
   npm run test
   ```

Las pruebas end-to-end se ejecutan con Jest y Supertest para validar el flujo completo (registro, login, CRUD de tareas, etc.).

Ejecuta:

 ```bash
   npm run test:e2e
   ```

---

## WebSockets

Se ha implementado un **WebSocketGateway** en el backend con `@nestjs/websockets` y `@nestjs/platform-socket.io` (compatibles con NestJS v9), el cual emite eventos en tiempo real:

- **Eventos:**  
  - `taskCreated`: Al crear una tarea.
  - `taskUpdated`: Al actualizar una tarea.

---

## Upload de Archivos

El backend utiliza **Multer** para procesar uploads de archivos. El endpoint de creación de tarea acepta `multipart/form-data` con:

- Campos de texto: `title`, `description`, `status`, `dueDate`
- Archivo: Campo `image` que contiene la imagen

La imagen se guarda en la carpeta `/uploads`, la cual se expone de forma estática para que el frontend la consuma.

---

## Diseño del Sistema
- **Módulos:**
    - AuthModule: Manejo de autenticación, JWT y roles.

    - TasksModule: CRUD de tareas, upload de archivos y WebSockets.

    - UsersModule: Gestión de usuarios.

- **Autenticación:** Se usa JWT, y se protegen los endpoints mediante guards personalizados (JwtAuthGuard, RolesGuard).

- **Interceptors:** Se implementa un interceptor global para logging de peticiones.

- **WebSockets:** Se emiten eventos en tiempo real para notificar la creación o actualización de tareas.

- **Upload de Archivos:** Multer se configura para almacenar archivos en disco y exponer la carpeta `uploads/`.

- **Contenerización:** Dockerfiles para backend y frontend junto a un docker-compose.yml permiten levantar todo el entorno en contenedores.

---

## Notas Finales

- Asegúrate de que las variables de entorno en los archivos .env estén correctamente configuradas.

- La carpeta `uploads/` debe existir en el backend para almacenar los archivos.

- La documentación Swagger se encuentra disponible en http://localhost:3000/api.

- Se incluyen pruebas unitarias y E2E para asegurar la calidad del código.

---