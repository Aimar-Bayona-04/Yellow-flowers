# Deployment

## Web actual

La imagen contiene el output `standalone` de Next.js.

```bash
docker build -t yellow-flowers-web:local .
docker run --rm -p 3000:3000 --env-file .env.example yellow-flowers-web:local
```

Requisitos de plataforma:

- contenedor Linux amd64/arm64 compatible con Node 22;
- puerto interno 3000;
- al menos 0.5 vCPU y 512 MiB para comenzar, ajustados con métricas;
- HTTPS terminado en load balancer/reverse proxy;
- CDN para recursos estáticos;
- una sonda HTTP sobre `/` mientras no exista endpoint dedicado;
- filesystem de solo lectura cuando la plataforma lo permita y `/tmp` temporal.

Proceso recomendado: construir una vez, escanear, firmar, promover el mismo digest a staging y producción, smoke test, rollout gradual y rollback al digest anterior. Las variables públicas requeridas en cliente deben fijarse durante el build.

## Cloud objetivo con Pixel Streaming

Esta sección es diseño futuro, no infraestructura desplegada.

1. Aprovisionar red por zonas, subredes públicas solo para LB/TURN y privadas para API, datos y workers.
2. Desplegar web/CDN, API, Redis HA y PostgreSQL solo si se necesita persistencia.
3. Desplegar signalling compatible con la distribución UE 5.6 validada.
4. Desplegar TURN regional con UDP y fallback TLS; limitar relay y rotar credenciales.
5. Crear imagen inmutable de worker NVIDIA con driver, runtime empaquetado y agente de salud.
6. Mantener warm pool y autoscaling por sesiones pendientes, startup p95 y GPU.
7. Enviar logs, métricas y trazas sin tokens/PII.

### Capacidad y scaling

Comenzar con una sesión interactiva por proceso UE y medir si una GPU admite múltiples procesos sin violar budgets. Capacidad segura:

```text
capacidad_regional = workers_saludables × sesiones_por_worker - reserva
```

Escalar antes de saturar; drenar workers antes de actualizarlos. No reutilizar un proceso entre usuarios sin demostrar aislamiento y limpieza de estado.

### Observabilidad y SLO inicial

- disponibilidad web ≥ 99.9%;
- creación de sesión exitosa ≥ 99%;
- conexión WebRTC exitosa ≥ 98% por navegador/red objetivo;
- session-start p95 ≤ 45 s con warm pool (hipótesis);
- crash-free sessions ≥ 99%;
- alarmas por cola, worker unhealthy, TURN allocation, bitrate, packet loss, RTT, FPS y coste/sesión.

Los umbrales deben recalibrarse con staging.

## Recuperación

Web/API son reemplazables. Redis necesita réplica/failover si sostiene sesiones; PostgreSQL requiere backups cifrados y restauración ensayada. Un worker perdido fuerza reconexión o reasignación, no restauración desde su disco. Documentar RTO/RPO antes de producción.
