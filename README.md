# SGS Supermercado — Frontend

> Aplicación web desarrollada con **Angular 20** para la gestión de un supermercado. Permite a los clientes explorar productos y a los administradores gestionar el catálogo completo con categorías.

---

## Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Vistas y Rutas](#vistas-y-rutas)
- [Autenticación](#autenticación)
- [Variables de Entorno](#variables-de-entorno)
- [Build para Producción](#build-para-producción)

---

## Características

- ✅ Registro de usuarios con verificación de cuenta por código enviado al correo
- ✅ Login con JWT — sesión persistente en `localStorage`
- ✅ Navbar dinámico según el rol del usuario (`ADMIN` / `CLIENTE`)
- ✅ Catálogo de productos con búsqueda en tiempo real, badges de stock y precio en COP
- ✅ Formulario de productos (crear / editar) con selección de categorías
- ✅ Gestión de categorías con tabla y modal integrado
- ✅ Rutas protegidas por guards: `authGuard`, `adminGuard`, `guestGuard`
- ✅ Interceptor HTTP que adjunta el token JWT automáticamente en cada petición
- ✅ Manejo de errores centralizado con mensajes descriptivos

---

## Tecnologías

| Tecnología | Versión |
|---|---|
| Angular | 20.2.0 |
| TypeScript | 5.x |
| Node.js | 22.18.0 |
| npm | 11.6.2 |
| Angular Router | Lazy Loading |
| Angular Forms | Reactive Forms |
| HttpClient | Con interceptor funcional |

---

## Requisitos Previos

- **Node.js 18+** (recomendado 22.x)
- **npm 9+**
- **Angular CLI 20+**
  ```bash
  npm install -g @angular/cli
  ```
- El **backend SGS** corriendo en `http://localhost:8080`
  → [sgs-backend](https://github.com/sebastianagudelom/sgs-backend)

---

## Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/sebastianagudelom/sgs-frontend.git
cd sgs-frontend

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
ng serve
```

La aplicación estará disponible en: **`http://localhost:4200`**

> Asegúrate de que el backend esté corriendo antes de iniciar el frontend.

---

## Estructura del Proyecto

```
src/
├── environments/
│   ├── environment.ts          # Desarrollo (apunta a localhost:8080)
│   └── environment.prod.ts     # Producción
└── app/
    ├── components/
    │   └── navbar/             # Navbar responsive con menú según rol
    ├── guards/
    │   └── auth.guard.ts       # authGuard, adminGuard, guestGuard
    ├── interceptors/
    │   └── auth.interceptor.ts # Adjunta Bearer token en cada request
    ├── models/
    │   ├── auth.model.ts       # Interfaces: AuthResponse, LoginRequest, etc.
    │   ├── categoria.model.ts
    │   └── producto.model.ts
    ├── pages/
    │   ├── login/              # Formulario de inicio de sesión
    │   ├── registro/           # Formulario de registro con validaciones
    │   ├── verificar/          # Ingreso del código de verificación
    │   ├── producto-lista/     # Catálogo público con búsqueda
    │   ├── producto-form/      # Crear / editar producto (solo ADMIN)
    │   └── categorias/         # Tabla y modal de categorías (solo ADMIN)
    ├── services/
    │   ├── auth.service.ts     # BehaviorSubject, login, logout, JWT
    │   ├── producto.service.ts # CRUD de productos
    │   └── categoria.service.ts# CRUD de categorías
    ├── app.config.ts           # Providers: HttpClient, Router
    ├── app.routes.ts           # Rutas lazy-loaded con guards
    ├── app.ts                  # Componente raíz
    └── app.html                # Layout principal: navbar + router-outlet
```

---

## Vistas y Rutas

| Ruta | Componente | Guard | Descripción |
|---|---|---|---|
| `/login` | `LoginComponent` | `guestGuard` | Inicio de sesión |
| `/registro` | `RegistroComponent` | `guestGuard` | Crear cuenta nueva |
| `/verificar` | `VerificarComponent` | — | Verificar cuenta con código |
| `/productos` | `ProductoListaComponent` | — | Catálogo público |
| `/productos/nuevo` | `ProductoFormComponent` | `adminGuard` | Crear producto |
| `/productos/editar/:id` | `ProductoFormComponent` | `adminGuard` | Editar producto |
| `/categorias` | `CategoriasComponent` | `adminGuard` | Gestionar categorías |
| `/` | — | — | Redirect a `/productos` |

---

## Autenticación

La autenticación se maneja mediante **JWT** almacenado en `localStorage`:

1. Al hacer login, el token y los datos del usuario se almacenan en `localStorage`.
2. El `authInterceptor` lee el token y agrega el header `Authorization: Bearer <token>` en cada petición HTTP.
3. Los guards verifican el estado del `AuthService` antes de activar cada ruta.

**Roles disponibles:**

| Rol | Permisos |
|---|---|
| `ADMIN` | Ver, crear, editar y eliminar productos y categorías |
| `CLIENTE` | Ver catálogo de productos |

---

## Variables de Entorno

Las URLs de la API se configuran en los archivos de entorno:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

Para cambiar el servidor de backend, modifica `apiUrl` en el archivo correspondiente.

---

## Build para Producción

```bash
ng build --configuration production
```

Los archivos compilados se generarán en `dist/sgs-frontend/browser/`.

---

## Proyecto Universitario

Desarrollado para la asignatura **Software 3** — Universidad del Quindío.
Backend: [sgs-backend](https://github.com/sebastianagudelom/sgs-backend)
