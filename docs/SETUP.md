# Setup local

## Web actual

Requisitos:

- Node.js 22 LTS.
- npm 10 o superior.
- Navegador moderno con WebGL2.

```bash
git clone <url-del-repositorio>
cd Yellow-flowers
npm ci
npm run dev
```

Visite `http://localhost:3000`. El flujo reproducible usa `npm ci`, no `npm install`. La app no requiere `.env`: el contenido está en `data/stations.json` y el progreso en `localStorage`.

## Validación

```bash
npm run typecheck
npm test
npm run build
```

El build produce HTML/JS/CSS estáticos en `out/`. Puede servirlos con cualquier hosting de archivos. No hay `npm start` de API.

El navegador debe permitir WebGL2. Pruebe navegación, teclado, touch, audio con gesto de usuario, reduced motion y redimensionado.

`npm run lint` usa ESLint 9 y TypeScript 6, versiones fijadas en `package-lock.json` y compatibles con las reglas actuales. Debe permanecer como gate de CI.

## Docker

```bash
docker compose build
docker compose up
docker compose ps
docker compose down
```

Compruebe `http://localhost:3000`. Compose sirve únicamente el sitio estático (nginx + `out/`).

## Entornos

No hay secretos ni endpoints de servicio. CI ejecuta typecheck, lint, tests y export estático.

## Unreal futuro

No hay `.uproject`, fuentes C++ ni assets UE en este repositorio. No instale Unreal para trabajar en el vertical slice actual. Para iniciar el spike futuro, siga [UNREAL_SETUP.md](UNREAL_SETUP.md) en un cambio separado y con validación oficial UE 5.6.
