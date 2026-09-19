# Yellow Flowers — Virtual Garden

Experiencia web estática: un jardín 3D interactivo para Love & Friendship Day.

> **Estado real:** todo el contenido y el progreso viven en el navegador. La narrativa sale de [`data/stations.json`](data/stations.json); el avance se guarda en `localStorage`. No hay API, sesiones remotas ni consumo de servicios. Unreal Engine 5.6 / Pixel Streaming queda documentado como visión futura, no como runtime de este slice.

## Inicio rápido

Requisitos: Node.js 22 LTS y npm 10+.

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para validar:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run build` genera un sitio estático en `out/`.

## Docker

```bash
docker compose up --build
```

La imagen sirve `out/` con nginx en `http://localhost:3000`. No hay backend en el contenedor.

## Documentación

- [Arquitectura y outputs A–R](docs/ARCHITECTURE.md)
- [Desarrollo local](docs/SETUP.md)
- [Despliegue](docs/DEPLOYMENT.md)
- [Web](docs/WEB_SETUP.md)
- [Audio](docs/AUDIO_SETUP.md)
- [Rendimiento](docs/PERFORMANCE.md)
- [Seguridad](docs/SECURITY.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## Alcance

Implementado: jardín WebGL, ocho estaciones data-driven, progreso local, preferencias en el dispositivo, export estático, Docker/nginx y CI.

No implementado: APIs, Redis, PostgreSQL, Pixel Streaming, GPU workers ni proyecto Unreal.

## Licencia

Proyecto privado (`UNLICENSED`).
# Yellow-flowers
