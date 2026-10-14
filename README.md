# Nestrr Template

Nestrr es una aplicacion monolito organizada como monorepo con workspaces de pnpm.
Combina:

- API backend con NestJS en apps/api
- App web con React Router en apps/web

## Personalizar el Nombre del Proyecto

Se recomienda cambiar el nombre de `nestrr` por el nombre deseado al comenzar a usar esta plantilla. Puedes hacerlo con ayuda de una IA o con la busqueda y reemplazo de tu editor, revisando las coincidencias antes de aplicar cambios globales.

Como minimo, actualiza el nombre visible del proyecto y el campo `name` del `package.json` raiz (`nestrr-template`). Si tambien quieres personalizar los nombres de los paquetes del monorepo, cambia `@nestrr/api` y `@nestrr/web` por el scope elegido en los `package.json` de cada app.

Para un renombrado completo:

1. Elige un nombre para mostrar y una variante corta, en minusculas y sin espacios, para paquetes y comandos. Por ejemplo, `mi-proyecto` y `@mi-proyecto/api`.
2. Busca en todo el workspace `Nestrr`, `nestrr`, `nestrr-template` y `@nestrr`. Reemplaza cada coincidencia segun su uso; no todas representan el mismo nombre. Incluye los scripts de la raiz, los filtros de pnpm en Dockerfiles, los nombres de contenedor y los textos de la interfaz.
3. Si cambiaste los nombres de los paquetes de las apps, actualiza tambien los filtros `--filter` en comandos y documentacion para que coincidan exactamente con sus nuevos campos `name`.
4. Ejecuta `pnpm install` para actualizar el lockfile y luego prueba los comandos de desarrollo y build.
5. Vuelve a buscar los nombres anteriores en el workspace para detectar referencias que hayan quedado pendientes.

Como alternativa, puedes pedirle a una IA que renombre el proyecto en todo el workspace, indicando el nombre visible y el scope deseados. Pidele que conserve la estructura y dependencias, actualice todos los filtros de pnpm y Docker, y reporte los archivos modificados; despues revisa el diff y ejecuta las mismas comprobaciones.

## Arquitectura General

Este repositorio usa una sola base de codigo para varias apps.
Cada app tiene su propio package.json, scripts y dependencias, pero comparte instalacion y manejo desde la raiz con pnpm workspaces.

Estructura principal:

- apps/api: Backend NestJS
- apps/web: Frontend React Router + Vite
- packages: Espacio para librerias compartidas

## Requisitos

- Node.js
- pnpm

## Instalacion de Dependencias

Instalar todo el monorepo:

```bash
pnpm install
```

Ejemplos para instalar dependencias por app:

```bash
# Dependencia solo para API
pnpm add zod --filter @nestrr/api

# Dependencia solo para Web
pnpm add dayjs --filter @nestrr/web

# Dependencia de desarrollo en la raiz del workspace
pnpm add -D typescript -w
```

## Comandos de Uso

Desde la raiz del proyecto:

```bash
# Levantar API en modo desarrollo
pnpm run dev:api

# Levantar Web en modo desarrollo
pnpm run dev:web
```

Comandos utiles de API:

```bash
# Build con pruebas
pnpm --filter @nestrr/api build

# Build sin pruebas
pnpm --filter @nestrr/api build:no-tests

# Tests unitarios
pnpm --filter @nestrr/api test

# Tests e2e
pnpm --filter @nestrr/api test:e2e
```

Comandos utiles de Web:

```bash
# Desarrollo
pnpm --filter @nestrr/web dev

# Build
pnpm --filter @nestrr/web build

# Typecheck
pnpm --filter @nestrr/web typecheck
```

## Cambio de Nombre en package.json por App

Puedes cambiar el campo name en:

- apps/api/package.json
- apps/web/package.json

Ejemplo actual:

- API: @nestrr/api
- Web: @nestrr/web

Si cambias estos nombres, actualiza tambien los filtros usados en scripts de la raiz (package.json), por ejemplo:

- dev:api usa pnpm --filter @nestrr/api start:dev
- dev:web usa pnpm --filter @nestrr/web dev

## Configuracion de Observe

La API esta preparada para usar Observe.
Si SI usas Observe, debes definir estas variables de entorno:

- OBSERVE_APP_KEY
- OBSERVE_APP_SECRET
- OBSERVE_SERVICE_ID (opcional, por defecto api)

### Si NO usas Observe

Comenta las lineas apropiadas para desactivar la integracion:

1. En apps/api/src/app.module.ts
- Comentar el bloque ObserveModule.forRootAsync(...)

2. En apps/api/src/main.ts
- Quitar ObserveInstrument del import de AppModule
- Comentar la opcion instrument: ObserveInstrument dentro de NestFactory.create

3. En apps/api/src/config/validation.schema.ts
- Comentar o eliminar:
  - OBSERVE_APP_KEY: Joi.string().required()
  - OBSERVE_APP_SECRET: Joi.string().required()
  - OBSERVE_SERVICE_ID: Joi.string().default('api')

Con esto podras ejecutar la API sin requerir claves de Observe.

## Notas de Desarrollo

- La API expone health check en /api/health
- La app web ya incluye proxy de desarrollo en Vite para enrutar /api hacia http://localhost:3000
- El proxy aplica solo en desarrollo
