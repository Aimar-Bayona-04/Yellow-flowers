# Seguridad

## Alcance y límites de confianza

Actual: browser no confiable → CDN/LB → contenedor Next. Futuro: browser → API/signalling/TURN → control plane → worker GPU. Redis, base de datos y interfaces administrativas nunca son públicas.

## Controles

- HTTPS y WSS con TLS moderno; HSTS en producción.
- WebRTC protegido por mecanismos estándar negociados (DTLS-SRTP); no desactivar validaciones.
- Tokens de sesión aleatorios, cortos, ligados a sesión/worker/audiencia y con expiración/revocación.
- Cookies, si se usan: `Secure`, `HttpOnly`, `SameSite`; protección CSRF según flujo.
- CORS allowlist exacta; CSP sin comodines y endurecida respecto al desarrollo.
- Validación de esquema/tamaño/rate para HTTP, WebSocket y Data Channel.
- Rate limit por IP/riesgo/cuenta, límites globales y cola para proteger GPU.
- TURN con credenciales temporales, cuotas y puertos/rangos mínimos.
- RBAC/identidad de workload, mínimo privilegio, segmentación y egress controlado.
- Secret manager, rotación y escaneo; imágenes fijadas por digest, SBOM y vulnerability scanning.
- Logs estructurados con correlation ID, redacción y retención limitada.

La CSP actual de Next permite constructos de desarrollo (`unsafe-eval`/`unsafe-inline`); antes de producción hay que medir y migrar a nonces/hashes donde Next y las bibliotecas lo permitan. No declarar CSP “cerrada” mientras permanezcan esas excepciones.

## Variables

| Variable | Clase | Uso |
|---|---|---|
| `NEXT_PUBLIC_ENVIRONMENT` | pública | etiqueta de entorno |
| `NEXT_PUBLIC_API_URL` | pública/futura | origen público de API |
| `NEXT_PUBLIC_PIXEL_STREAMING_URL` | pública/futura | solo laboratorio; preferir URL por sesión |
| `REDIS_URL`, `DATABASE_URL` | secreta/futura | backend privado |
| `TURN_SERVER_URL` | configuración/futura | endpoint público |
| `TURN_USERNAME`, `TURN_CREDENTIAL` | secretas/futuras | credenciales temporales; nunca build web |
| `SESSION_TIMEOUT`, `MAX_SESSIONS_PER_WORKER` | privada/futura | política backend |

Nada con `NEXT_PUBLIC_` es secreto.

## Threat model resumido

| Amenaza | Control |
|---|---|
| robo/replay de sesión | TLS, TTL corto, nonce/audiencia, revocación |
| agotamiento de GPU | rate limit, challenge, cuotas, cola y circuit breaker |
| inyección por mensajes | esquema allowlist, límites, no ejecutar strings |
| acceso a otro worker | autorización por sesión y red privada |
| abuso de TURN | credenciales temporales, cuotas y realm |
| XSS/clickjacking | encoding, CSP, `frame-ancestors`, headers |
| SSRF/control plane | allowlist de destinos y egress, sin URL arbitraria |
| supply chain | lockfile, `npm ci`, scanning, provenance/SBOM |
| fuga en telemetría | minimización, redacción, retención y acceso |
| imagen/worker comprometido | inmutable, parcheado, sin secretos persistentes |

## Datos y privacidad

Recolectar solo eventos anónimos necesarios. No guardar texto libre, audio/video, IP completa o device fingerprint sin base legal y consentimiento. Definir responsable, finalidad, región, retención y eliminación. Hash no convierte automáticamente PII en anónima.

## CI/CD

Proteger ramas y environments, permisos mínimos de workflow, acciones fijadas a versiones/digests aprobados, OIDC en vez de claves cloud duraderas, revisión para producción y rollback. Este CI no publica ni despliega.

## Respuesta a incidentes

1. contener: revocar tokens/credenciales, drenar workers, bloquear origen;
2. preservar evidencia redactada y timestamps;
3. erradicar y rotar;
4. recuperar con artefacto conocido;
5. comunicar según obligaciones;
6. postmortem y controles verificables.

Nunca reporte secretos en issues ni los “corrija” solo borrándolos de la última revisión: deben revocarse.
