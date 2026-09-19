# Troubleshooting

## Web actual

### `npm ci` falla

Use Node 22 LTS, confirme que `package-lock.json` acompaña a `package.json`, limpie solo artefactos locales no versionados y repita. No regenere el lockfile como primera respuesta.

### Pantalla vacía o WebGL no disponible

Revise consola, aceleración por hardware y soporte WebGL2. Pruebe perfil limpio y driver actualizado. Si el contexto se pierde, capture GPU, navegador, escena y memoria; ofrezca error accesible, no un loop de recarga.

### Audio no inicia

Solicite un gesto explícito, revise mute/volumen y reanude el contexto tras volver a la pestaña. Safari/iOS requiere prueba en dispositivo real.

### Build Docker falla

```bash
docker build --progress=plain -t yellow-flowers-web .
docker run --rm -p 3000:3000 yellow-flowers-web
```

Verifique espacio, acceso al registry y que el build de Next genera `.next/standalone`. No copie `node_modules` del host.

## Pixel Streaming futuro

No aplique esta sección a la web actual.

### No se asigna sesión

Revise capacidad regional, estados/heartbeats, cola, cuota cloud y startup p95. Distinga “sin capacidad” de fallo de API.

### WSS no conecta

Compruebe DNS, certificado/cadena, origen permitido, proxy upgrade, timeout y URL pública. No exponga logs con token.

### ICE/WebRTC falla

Compruebe candidates redactados, UDP, NAT, rango de puertos y credenciales TURN temporales. Fuerce relay en staging para probar TURN. Si solo funciona en una LAN, no está validado para Internet.

### Vídeo negro

Separe: proceso UE no renderiza, encoder no disponible, codec no negociado, track no recibido o autoplay. Correlacione logs del worker y estadísticas WebRTC; valide driver/GPU y build empaquetado contra UE 5.6.

### Audio ausente/desincronizado

Confirme track, gesto de reproducción, dispositivo de salida, codec, jitter y mezcla en worker. Compare captura local del worker con browser.

### Input o mensajes no llegan

Valide foco/pointer lock, estado de Data Channel, versión y esquema JSON, rate limits y autorización. No reenvíe input arbitrario fuera de allowlist.

### Latencia o pixelación

Capture RTT, jitter, pérdida, available bitrate, resolución/FPS y carga encoder/GPU. Acerque región, habilite TURN adecuado o reduzca perfil; más bitrate no corrige pérdida/congestión.

### Worker cae/reconecta

Revise salud, VRAM/RAM, crash dump redactado, drain y TTL. El cliente debe mostrar reconexión y el scheduler puede reasignar; no reutilice un worker unhealthy.

## Paquete mínimo para soporte

Correlation ID, timestamp UTC, entorno/build, navegador/SO, región, estado visible, pasos, red aproximada y métricas redactadas. Nunca adjunte tokens, credenciales, IP completa, SDP completo, cookies ni URLs firmadas.
