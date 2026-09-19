# Pixel Streaming UE 5.6 — integración futura

> Pixel Streaming no está implementado ni desplegado en este repositorio. El vertical slice actual usa WebGL local. Esta guía describe un experimento y arquitectura objetivo para UE 5.6.

## Componentes

- runtime UE 5.6 empaquetado en worker NVIDIA;
- plugin Pixel Streaming de la versión fijada;
- frontend/biblioteca web compatible con esa misma distribución;
- signalling sobre WSS;
- STUN para descubrimiento y TURN regional para relay;
- Session API/scheduler para asignación;
- WebRTC para media e input; Data Channel para mensajes versionados.

No mezcle frontend o signalling de otra versión sin una prueba de compatibilidad.

## Laboratorio de validación

1. Complete [UNREAL_SETUP.md](UNREAL_SETUP.md) y registre la fuente oficial UE 5.6.
2. Use la infraestructura de referencia distribuida/recomendada para esa versión, sin asumir rutas, scripts o flags.
3. Ejecute un build empaquetado en una GPU/driver soportados.
4. Pruebe primero navegador y worker en una red controlada.
5. Añada TLS válido y WSS.
6. Añada STUN; luego fuerce una red que requiera TURN y confirme relay.
7. Valide audio, teclado, mouse, touch, resize, fullscreen y Data Channel.
8. Capture SDP/ICE de forma redactada, candidate type, RTT, jitter, packet loss, bitrate, codec, FPS y latencia de input.
9. Repita Chrome, Edge, Firefox y Safari/dispositivos reales.

## Flujo de sesión

El browser solicita sesión con un token antiabuso. La API reserva worker saludable y devuelve `sessionId`, token efímero y URL pública de signalling. El browser y worker negocian SDP/ICE. La API nunca revela IP privada, credenciales cloud o token TURN duradero. Heartbeats renuevan TTL; al cerrar se revoca token, termina proceso y limpia estado.

## Mensajería

Envelope:

```json
{
  "version": 1,
  "id": "msg_01",
  "type": "SetAccessibility",
  "payload": { "reducedMotion": true }
}
```

Allowlist inicial Browser→UE: `Interact`, `SetAudio`, `SetAccessibility`, `SetQualityProfile`. UE→Browser: `LoadingState`, `StationActivated`, `NarrativeText`, `StationCompleted`, `ExperienceCompleted`, `AnalyticsEvent`.

Límites iniciales: 16 KiB por mensaje, 20 mensajes/s por sesión para comandos de aplicación y profundidad máxima 8; ajustar tras medir. Movimiento/look debe usar el mecanismo de input soportado, no inundar mensajes JSON. Rechazar versión/tipo/esquema inválido y no interpretar contenido como comandos de sistema.

## NAT, firewall y TLS

- HTTPS/WSS en 443.
- WebRTC prefiere UDP; documentar rango de puertos del despliegue validado.
- TURN sobre UDP y fallback TLS/TCP 443 donde el diseño lo permita.
- Credenciales TURN temporales y realm aislado.
- Limitar egress/ingress por security group y no publicar puertos administrativos.

## Escala

Modelo inicial: un usuario por proceso UE. Scheduler mantiene capacidad por región, warm pool, estados de worker y backpressure. Al no haber GPU, la web muestra cola/estimación o error amistoso. SFU solo entra si el caso cambia a espectadores compartiendo stream.

## Criterios de aprobación

- ≥98% de conexiones en matriz objetivo de staging;
- TURN probado, no solo configurado;
- frame/bitrate/RTT dentro de [PERFORMANCE.md](PERFORMANCE.md);
- input, audio y reconexión validados;
- aislamiento entre dos sesiones demostrado;
- caída de worker no filtra estado;
- logs sin SDP sensible, IP completa, tokens ni mensajes narrativos privados.

## Depuración

Clasifique el fallo: API/asignación, WSS, SDP, ICE, DTLS, codec/decode, media negra, audio/autoplay, input o Data Channel. Use herramientas WebRTC del navegador y logs de infraestructura con un correlation ID. No muestre “ICE negotiation failed” al visitante; traduzca a una acción útil y conserve detalle redactado para soporte.
