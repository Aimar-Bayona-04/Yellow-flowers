# Web

## Implementación actual

Next.js sirve la experiencia y React Three Fiber/Three.js renderizan el jardín mediante WebGL en la GPU del dispositivo. No hay vídeo Unreal ni conexión Pixel Streaming actualmente.

Comandos:

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Estados UX objetivo

Landing → preparación → experiencia WebGL. Cuando exista la integración futura: capability check → solicitud de sesión → cola/asignación → signalling → conexión → experiencia → reconexión/finalización.

Cada estado debe incluir copy no técnico, timeout, cancelación y acción siguiente. La UI debe conservar navegación por teclado, foco visible, lector de pantalla, captions, tamaño de texto, alto contraste y reduced motion.

## Integración futura

Encapsular el cliente compatible con UE 5.6 en un adapter/hook; no acoplar componentes a APIs del proveedor. El contrato expone estado, connect/disconnect/reconnect, calidad, input y mensajería validada. Cargarlo dinámicamente solo en la ruta de experiencia para mantener ligera la landing.

Nunca incluya secretos en `NEXT_PUBLIC_*`. URL pública de API puede ser configurable; signalling y token de sesión deberían venir de una respuesta autorizada, no de una dirección interna hard-coded.

## Capability detection

Comprobar APIs/capacidades en runtime: WebGL2 actual; WebRTC, Data Channel, codec negociado, touch/pointer, tamaño, DPR, autoplay y estado de red en el futuro. `userAgent` no es prueba suficiente. Ofrecer una pantalla alternativa si falta capacidad.

## Matriz mínima de QA

- Chrome/Edge/Firefox, dos últimas versiones, Windows y macOS.
- Safari, dos últimas versiones, macOS e iOS.
- Chrome Android en teléfono/tablet reales.
- teclado, mouse, touch, orientación y gamepad si se declara soporte;
- red doméstica, móvil, alta latencia/pérdida y red corporativa con TURN;
- zoom 200%, lector de pantalla, reduced motion y solo teclado.

La compatibilidad definitiva depende del codec y la infraestructura Pixel Streaming que se validen con UE 5.6.
