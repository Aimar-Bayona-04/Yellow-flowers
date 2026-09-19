# PROYECTO: LOVE & FRIENDSHIP DAY — HYPER-REALISTIC INTERACTIVE VIRTUAL GARDEN

Diseña y desarrolla un proyecto de producción para un jardín virtual 3D cinematográfico e interactivo creado con Unreal Engine 5, destinado a ser experimentado directamente desde cualquier navegador web mediante Unreal Engine Pixel Streaming.

El resultado debe sentirse como una experiencia emocional premium, similar a recorrer un cortometraje interactivo en tiempo real. No debe parecer un videojuego genérico ni una demo técnica. La prioridad es combinar fotorealismo, narrativa ambiental, interacción intuitiva, audio espacial y una experiencia web extremadamente sencilla: el usuario recibe un enlace, abre el navegador y entra al jardín sin instalar ningún cliente.

==================================================

1. OBJETIVO PRINCIPAL  
==================================================

Crear un "Virtual Love & Friendship Garden", un entorno natural cinematográfico ambientado durante una tarde de golden hour.

El usuario aparece al inicio de un sendero de piedra y puede recorrer libremente el jardín. A medida que avanza, diferentes estaciones arquitectónicas y naturales activan experiencias narrativas.

Cada estación debe representar una idea emocional:

- Bienvenida
- Recuerdo
- Gratitud
- Amistad
- Amor
- Promesa
- Esperanza
- Despedida / mensaje final

Las estaciones deben activarse mediante proximidad, interacción directa o ambos.

La experiencia completa debe durar aproximadamente 5-15 minutos dependiendo del ritmo del usuario.

# ==================================================  
2. STACK TECNOLÓGICO COMPLETO

CORE 3D:

- Unreal Engine 5.x
- C++
- Blueprints
- Unreal Engine Enhanced Input
- World Partition cuando sea conveniente
- Nanite
- Lumen Global Illumination
- Lumen Reflections
- Virtual Shadow Maps
- Niagara VFX
- Exponential Height Fog
- Volumetric Fog
- Post Process Volumes
- Level Instances
- Data Assets
- Gameplay Tags
- Unreal Motion Graphics / UMG
- Sequencer
- Control Rig cuando sea necesario
- MetaSounds
- Unreal Audio Engine

ASSETS:

- Quixel Megascans
- Fab / Unreal Marketplace assets cuando sean necesarios
- SpeedTree para árboles y vegetación
- Nanite-compatible meshes
- High-resolution PBR materials
- Virtual Textures
- Runtime Virtual Textures cuando aporten mejoras visuales

AUDIO:

- Unreal Audio Engine
- MetaSounds
- Steam Audio SDK / compatible spatial-audio solution
- HRTF
- Reverb zones
- Occlusion
- Environmental audio emitters
- Dynamic music system
- Procedural ambient layers

WEB:

- TypeScript
- React
- Next.js
- Tailwind CSS
- WebSocket
- WebRTC
- Unreal Pixel Streaming JavaScript frontend/API
- Responsive design
- Progressive loading states
- Browser capability detection
- Session management
- Analytics hooks

BACKEND:

- Node.js
- TypeScript
- Fastify o NestJS
- WebSocket
- REST API
- Redis para sesiones/estado temporal
- PostgreSQL para persistencia si se requiere
- JWT o session tokens
- Rate limiting
- Structured logging
- Health checks

PIXEL STREAMING:

- Unreal Engine Pixel Streaming
- WebRTC
- Signalling Server
- SFU/media infrastructure cuando sea necesario para escalar
- STUN/TURN
- GPU cloud instances
- NVIDIA GPU
- Docker
- Kubernetes opcional para producción
- Autoscaling
- Session orchestration
- Health monitoring

INFRAESTRUCTURA:

Diseñar la arquitectura para funcionar en proveedores cloud con GPU, incluyendo opciones como:

- AWS
- Microsoft Azure
- Google Cloud
- OVHcloud
- Equinix
- Otros proveedores compatibles con NVIDIA GPU

CONTENEDORES:

- Docker
- Docker Compose para desarrollo
- Kubernetes para despliegues escalables
- NGINX o Caddy como reverse proxy
- HTTPS obligatorio
- WebSocket/WSS
- TURN/TLS cuando sea necesario

CI/CD:

- Git
- Git LFS para assets
- GitHub Actions o GitLab CI
- Automated builds
- Automated tests
- Unreal packaged builds
- Docker image builds
- Infrastructure deployment
- Environment variables
- Staging / Production environments

OBSERVABILIDAD:

- Prometheus
- Grafana
- OpenTelemetry
- Sentry
- Centralized structured logging

# ==================================================  
3. ARQUITECTURA GENERAL

Separar el sistema en cinco grandes capas:

A. Unreal Runtime  
B. Pixel Streaming Infrastructure  
C. Web Experience  
D. Backend / Session Management  
E. Cloud Infrastructure

Arquitectura conceptual:

Browser  
|  
| HTTPS / WSS / WebRTC  
v  
Web Application  
|  
+---- Session API  
|  
+---- Signalling  
|  
v  
Pixel Streaming Infrastructure  
|  
v  
GPU Worker  
|  
v  
Unreal Engine 5 Runtime  
|  
+---- C++ Gameplay  
+---- Blueprints  
+---- Niagara  
+---- MetaSounds  
+---- Lumen  
+---- Nanite

# ==================================================  
4. UNREAL ENGINE ARCHITECTURE

Crear una arquitectura modular y mantenible.

C++ debe manejar:

- Core gameplay systems
- Player controller
- Interaction framework
- Station management
- Proximity detection
- Narrative state
- Save/session state
- Audio state
- Performance-critical systems
- Pixel Streaming communication hooks
- Browser input integration
- Analytics events

Blueprints deben manejar:

- Level scripting
- Visual interactions
- Station-specific behaviors
- VFX triggers
- Cinematic sequences
- UI presentation
- Designers' configuration
- Rapid iteration

Evitar construir toda la lógica en Blueprints.

Crear clases conceptuales:

AVirtualGardenPlayerController  
AVirtualGardenCharacter  
UGardenInteractionComponent  
UGardenStationComponent  
AGardenNarrativeManager  
UGardenAudioManager  
UGardenEnvironmentManager  
UGardenSessionManager  
UGardenAnalyticsComponent  
UGardenSaveGame

Crear interfaces:

IGardenInteractable  
IGardenNarrativeActor  
IGardenAudioReactive

Utilizar Gameplay Tags para estados:

Garden.Station.Welcome  
Garden.Station.Memory  
Garden.Station.Friendship  
[Garden.Station.Love](http://Garden.Station.Love)  
Garden.Station.Promise  
Garden.Station.Hope  
[Garden.Station.Final](http://Garden.Station.Final)

# ==================================================  
5. ENVIRONMENT DESIGN

Construir un jardín natural de gran escala.

El entorno debe incluir:

- Sendero de piedra antiguo
- Grandes campos de flores amarillas
- Girasoles
- Rosas amarillas
- Flores silvestres
- Hierba fotorealista
- Musgo
- Rocas erosionadas
- Robles antiguos
- Pequeños arbustos
- Hiedra
- Enredaderas
- Pétalos
- Hojas caídas
- Polvo atmosférico
- Polen flotante
- Pequeñas partículas iluminadas por el sol

El jardín debe evitar una distribución artificial.

Utilizar técnicas de procedural scattering y foliage instancing para crear variación natural.

No repetir visiblemente los mismos modelos.

Variar:

- Escala
- Rotación
- Densidad
- Color
- Estado de floración
- Inclinación
- Distancia al camino
- Agrupaciones

# ==================================================  
6. NANITE

Utilizar Nanite donde proporcione beneficios reales:

- Rocas
- Muros
- Arcos
- Pavimento
- Arquitectura
- Grandes elementos de entorno
- Assets de alta densidad geométrica

No activar Nanite indiscriminadamente en elementos donde genere un coste innecesario.

Analizar compatibilidad y coste de:

- Foliage
- Vegetación animada
- Transparencias
- Materiales masked
- VFX

Mantener un perfil de rendimiento específico para Pixel Streaming.

# ==================================================  
7. LUMEN

Utilizar Lumen como sistema principal de iluminación.

La iluminación debe simular:

- Golden hour
- Luz solar cálida
- Rebote de luz natural
- Sombras suaves
- Iluminación indirecta
- Luz filtrándose entre árboles
- Reflejos naturales
- Contraste cinematográfico

Crear una transición gradual de iluminación durante la experiencia.

Evitar una iluminación excesivamente naranja o artificial.

Las flores amarillas deben recibir iluminación físicamente creíble y producir rebotes de luz cálidos sin saturar la escena.

# ==================================================  
8. VEGETATION SYSTEM

Implementar un sistema de vegetación escalable.

Usar:

- SpeedTree
- Unreal Foliage System
- Procedural foliage
- Nanite foliage cuando sea apropiado
- Wind material functions
- World Position Offset
- Vertex Animation
- Niagara

Crear varios niveles de densidad:

ULTRA  
HIGH  
MEDIUM  
LOW

La densidad visual debe degradarse progresivamente según capacidad del sistema de streaming.

Implementar culling y LOD/HLOD cuando corresponda.

# ==================================================  
9. WIND SYSTEM

El viento debe afectar:

- Hierba
- Flores
- Hojas
- Arbustos
- Árboles
- Pétalos
- Enredaderas

Crear un sistema de viento centralizado para evitar que cada asset implemente una solución diferente.

Variables:

WindStrength  
WindDirection  
WindGustFrequency  
WindTurbulence  
WindVariation

El movimiento debe ser orgánico y no parecer una animación sinusoidal repetitiva.

# ==================================================  
10. ATMOSPHERIC VFX

Crear efectos Niagara para:

- Polen
- Pétalos
- Dust motes
- Tiny floating particles
- Leaves
- Magical subtle particles

Las partículas deben reaccionar visualmente a:

- Luz
- Viento
- Proximidad del jugador

Utilizar iluminación volumétrica para crear rayos de luz naturales entre los árboles.

Evitar exceso de partículas.

El objetivo es fotorealismo, no fantasía de videojuego barata.

# ==================================================  
11. ARCHITECTURAL STATIONS

Crear entre 6 y 8 estaciones.

Cada estación debe ser visualmente única.

Ejemplos:

Station 01:  
Stone Welcome Arch

Station 02:  
Memory Oak

Station 03:  
Yellow Rose Pavilion

Station 04:  
Friendship Bridge

Station 05:  
Golden Vine Arch

Station 06:  
Promise Garden

Station 07:  
Sunflower Clearing

Station 08:  
Final Light Pavilion

Cada estación debe tener:

- Unique landmark
- Interaction trigger
- Narrative text
- Audio state
- Lighting response
- Niagara response
- Camera behavior opcional
- Completion state

# ==================================================  
12. INTERACTION SYSTEM

Implementar interacción por proximidad.

Cuando el jugador se aproxima:

1. Detectar estación
2. Activar ambient response
3. Aumentar ligeramente el audio local
4. Activar partículas
5. Mostrar indicador discreto
6. Presentar texto narrativo
7. Opcionalmente activar una breve secuencia cinematográfica
8. Registrar analytics event

Permitir:

- Mouse
- Keyboard
- Touch
- Gamepad cuando sea soportado
- Click/tap
- WASD
- Arrow keys

La navegación debe ser intuitiva para un usuario que nunca haya utilizado Unreal.

# ==================================================  
13. NARRATIVE UI

La interfaz debe ser minimalista y elegante.

No utilizar HUD tradicional de videojuego.

Diseñar:

- Intro screen
- Loading screen
- Connection screen
- Interaction hint
- Poetic text overlay
- Station title
- Final message
- Audio controls
- Accessibility controls
- Reconnect state
- Connection quality indicator opcional

El texto debe aparecer mediante:

- Fade
- Soft blur
- Cinematic typography
- Subtle motion
- Dissolve

Nunca cubrir demasiado del paisaje.

Ejemplo conceptual:

"Hay personas que llegan a nuestra vida  
y convierten los días comunes  
en recuerdos que permanecen."

Los textos definitivos deben ser configurables desde Data Assets y no estar hard-coded.

# ==================================================  
14. AUDIO DESIGN

Crear un sistema de audio espacial completo.

Capas:

Layer 1:  
Forest ambience

Layer 2:  
Wind

Layer 3:  
Birds

Layer 4:  
Leaves / grass

Layer 5:  
Flowers / environmental micro sounds

Layer 6:  
Music

Layer 7:  
Station-specific audio

Utilizar:

- MetaSounds
- Spatialization
- HRTF
- Reverb
- Occlusion
- Distance attenuation
- Audio volumes
- Audio triggers

La música debe adaptarse según el progreso.

Estados:

Music.Exploration  
Music.Memory  
Music.Friendship  
[Music.Love](http://Music.Love)  
[Music.Final](http://Music.Final)

Las transiciones deben ser suaves y musicales, no cortes bruscos.

# ==================================================  
15. STEAM AUDIO

Integrar Steam Audio cuando la plataforma/runtime lo permita.

Implementar:

- HRTF
- Spatial audio
- Environmental reflections
- Occlusion
- Reverb
- Geometry-aware audio

Optimizar la cantidad de geometría utilizada para simulación acústica.

No permitir que el procesamiento de audio destruya el rendimiento de Pixel Streaming.

# ==================================================  
16. PIXEL STREAMING

El usuario final debe necesitar únicamente un navegador moderno.

Flujo:

1. Usuario abre URL
2. Web app carga
3. Backend solicita sesión
4. Session manager asigna GPU worker
5. Pixel Streaming signalling connection starts
6. WebRTC connection established
7. Unreal instance launches/resumes
8. Browser receives video/audio
9. Input events are forwarded to Unreal

No requerir:

- Unreal Engine
- Launcher
- Download del proyecto
- Plugin
- Aplicación nativa

Compatibilidad objetivo:

- Chrome
- Edge
- Firefox
- Safari cuando las capacidades WebRTC lo permitan
- Desktop
- Tablet
- Mobile

# ==================================================  
17. WEB APPLICATION

Crear una aplicación web con:

Next.js  
TypeScript  
React  
Tailwind CSS

La web app debe contener:

Landing  
Experience  
Loading  
Connection  
Error  
Reconnect  
Completion

La página inicial debe ser extremadamente ligera.

No cargar assets 3D en el navegador.

El navegador recibe principalmente:

- Video stream
- Audio stream
- UI
- Input events

# ==================================================  
18. PIXEL STREAMING FRONTEND

Implementar un wrapper React alrededor del Pixel Streaming frontend.

Componentes:

Crear un hook:

usePixelStreaming()

Responsabilidades:

- Connection lifecycle
- Input events
- Connection status
- WebRTC state
- Reconnect
- Unreal messages
- Browser resize
- Touch controls

# ==================================================  
19. BROWSER → UNREAL COMMUNICATION

Implementar comunicación bidireccional.

Browser → Unreal:

- Move
- Look
- Tap
- Click
- Interaction
- UI settings
- Audio settings
- Accessibility settings

Unreal → Browser:

- StationActivated
- NarrativeText
- StationCompleted
- LoadingState
- ExperienceCompleted
- AnalyticsEvent
- Connection metadata

Utilizar Pixel Streaming Data Channel / compatible messaging layer.

Definir mensajes JSON versionados.

Ejemplo:

{  
"version": 1,  
"type": "StationActivated",  
"payload": {  
"stationId": "friendship_bridge",  
"title": "Friendship",  
"message": "..."  
}  
}

# ==================================================  
20. SESSION MANAGEMENT

Crear un backend que gestione:

- Anonymous session
- GPU allocation
- Instance lifecycle
- Connection status
- Session expiration
- Reconnect
- Capacity
- Rate limiting

Una sesión debe poder ser identificada mediante un sessionId no sensible.

Nunca almacenar información personal innecesaria.

# ==================================================  
21. GPU ORCHESTRATION

Diseñar el sistema para:

- GPU pool
- Worker registration
- Worker health
- Session assignment
- Worker shutdown
- Autoscaling

Estados:

AVAILABLE  
ALLOCATING  
STARTING  
CONNECTED  
BUSY  
DRAINING  
ERROR  
OFFLINE

El sistema debe detectar automáticamente workers caídos.

# ==================================================  
22. CLOUD ARCHITECTURE

Diseñar una arquitectura cloud production-ready.

Componentes:

CDN  
Load Balancer  
Web App  
API  
Redis  
PostgreSQL opcional  
Signalling Server  
TURN Server  
GPU Workers  
Monitoring  
Logging

Ejemplo:

Cloudflare/CDN  
|  
v  
Load Balancer  
|  
+------ Web Frontend  
|  
+------ API  
|  
+---- Redis  
|  
+---- PostgreSQL  
|  
+---- GPU Scheduler  
|  
+---- GPU Worker 01  
+---- GPU Worker 02  
+---- GPU Worker N

# ==================================================  
23. PERFORMANCE

La prioridad es mantener una experiencia visual premium sin comprometer estabilidad.

Objetivo Unreal runtime:

- 60 FPS objetivo
- 30 FPS mínimo aceptable bajo condiciones limitadas
- Stable frame pacing
- Low input latency

Pixel Streaming:

- Preferentemente <150 ms de interacción percibida cuando la red lo permita
- Adaptación dinámica de bitrate
- Adaptive resolution
- WebRTC congestion control

Implementar:

- GPU profiling
- CPU profiling
- Memory profiling
- Unreal Insights
- Stat GPU
- Stat Unit
- Pixel Streaming metrics

No asumir "sub-second latency" como una garantía absoluta, porque la física básica todavía exige que Internet exista entre dos puntos del planeta. Diseñar para minimizar latencia, no para prometer magia.

# ==================================================  
24. GRAPHICS QUALITY PROFILES

Crear perfiles:

Cinematic  
Ultra  
High  
Medium  
Performance

Cada perfil controla:

- Resolution
- Lumen quality
- Shadows
- Volumetric fog
- Foliage density
- Niagara density
- Post processing
- View distance
- Anti-aliasing
- Effects

El perfil debe poder cambiarse desde el frontend.

# ==================================================  
25. MOBILE EXPERIENCE

Para touch devices:

- Virtual joystick
- Touch look
- Tap interaction
- Simple interaction button
- Responsive UI

No asumir que WASD existe.

Detectar:

- Touch capability
- Screen dimensions
- Device pixel ratio
- Browser capabilities
- Network quality

Reducir UI complexity en mobile.

# ==================================================  
26. ACCESSIBILITY

Incluir:

- Text size adjustment
- High contrast mode
- Reduced motion
- Captions
- Audio controls
- Keyboard navigation
- Screen-reader-friendly web UI
- Reduced visual effects

La experiencia debe seguir siendo usable sin depender exclusivamente del audio.

# ==================================================  
27. SECURITY

Implementar:

- HTTPS
- WSS
- Secure session tokens
- CORS policy
- CSP
- Rate limiting
- Input validation
- WebRTC security
- Server-side authorization
- No secrets in frontend
- Environment variables
- Secure cookies cuando correspondan

Nunca exponer:

- Cloud credentials
- GPU worker credentials
- Internal service addresses
- Database credentials

# ==================================================  
28. ANALYTICS

Registrar eventos anónimos:

experience_started  
experience_connected  
station_entered  
station_completed  
interaction_triggered  
experience_completed  
connection_lost  
connection_recovered

Métricas:

- Average session duration
- Completion rate
- Station engagement
- Connection success rate
- Average bitrate
- FPS
- GPU utilization
- Session errors
- Reconnect rate

No recolectar datos personales innecesarios.

# ==================================================  
29. CONTENT PIPELINE

Todo contenido narrativo debe ser data-driven.

Crear Data Assets:

DA_Station_Welcome  
DA_Station_Memory  
DA_Station_Friendship  
DA_Station_Love  
DA_Station_Promise  
DA_Station_Hope  
DA_Station_Final

Cada Data Asset contiene:

- ID
- Title
- Subtitle
- Poetic message
- Trigger distance
- Audio state
- VFX preset
- Lighting preset
- Duration
- Completion behavior

Esto permite cambiar la narrativa sin recompilar toda la lógica.

# ==================================================  
30. LEVEL DESIGN

Diseñar el jardín como un recorrido emocional.

Inicio:

Pequeño camino rodeado de árboles.

Primer punto:

Arco de piedra cubierto de flores amarillas.

Zona central:

Gran jardín abierto con girasoles.

Zona de reflexión:

Roble antiguo junto a un pequeño estanque.

Zona final:

Pabellón iluminado por golden-hour sunlight.

La composición debe utilizar:

- Leading lines
- Framing
- Depth
- Atmospheric perspective
- Focal points
- Controlled sightlines

Cada estación debe poder verse parcialmente desde la anterior para generar curiosidad.

# ==================================================  
31. CINEMATIC SYSTEM

Utilizar Sequencer para momentos especiales.

Cuando se active una estación:

- Slow camera movement opcional
- DOF transition
- Slight exposure adaptation
- Environmental VFX
- Audio transition
- Narrative overlay

Nunca quitar completamente el control del usuario durante demasiado tiempo.

La experiencia debe sentirse interactiva, no como una película que ocasionalmente permite caminar.

# ==================================================  
32. MATERIAL SYSTEM

Crear materiales PBR realistas.

Utilizar:

Base Color  
Normal  
Roughness  
Metallic  
Ambient Occlusion  
Displacement/height cuando corresponda

Crear material functions reutilizables:

MF_Wind  
MF_Wetness  
MF_Moss  
MF_FoliageVariation  
MF_WorldColorVariation  
MF_DistanceFade

Agregar variación natural para evitar superficies idénticas.

# ==================================================  
33. WEATHER / ENVIRONMENT

El estado inicial será:

- Clear sky
- Golden hour
- Light wind
- Warm sunlight

Diseñar arquitectura extensible para:

- Clouds
- Light rain
- Mist
- Different times of day

No implementar sistemas que no sean necesarios para el MVP si comprometen rendimiento.

# ==================================================  
34. WEB UX

Landing page minimalista.

Concepto:

LOVE & FRIENDSHIP DAY

"Walk through a garden made of memories."

CTA:

ENTER THE GARDEN

Después:

"Preparing your experience..."

Luego:

"Connecting..."

Finalmente:

Garden stream.

La UI debe desaparecer casi completamente una vez iniciada la experiencia.

# ==================================================  
35. ERROR HANDLING

Diseñar estados claros para:

- Browser unsupported
- WebRTC unavailable
- No GPU available
- Session timeout
- Connection failure
- Worker crash
- Network degradation
- Server overload

Mensajes comprensibles para usuarios no técnicos.

Nunca mostrar:

"ICE negotiation failed"

como único mensaje al usuario final. Eso es información útil para un ingeniero y una excelente manera de hacer que una persona normal crea que Internet la odia personalmente.

# ==================================================  
36. TESTING

Implementar:

Unit tests  
Integration tests  
Frontend tests  
API tests  
WebSocket tests  
Pixel Streaming connection tests  
Load tests  
Browser compatibility tests

Frontend:

- Vitest
- React Testing Library
- Playwright

Backend:

- Vitest/Jest
- Supertest
- WebSocket tests

Infrastructure:

- Docker tests
- Health checks
- Load testing

Browser matrix:

Chrome  
Edge  
Firefox  
Safari

Desktop and mobile.

# ==================================================  
37. LOAD TESTING

Simular:

10 concurrent users  
50 concurrent users  
100 concurrent users  
500 concurrent sessions

Medir:

- GPU allocation latency
- Session startup
- WebRTC connection success
- GPU utilization
- Network bandwidth
- Memory
- FPS
- Reconnects
- Worker failures

El sistema debe poder escalar horizontalmente.

# ==================================================  
38. DEVOPS

Crear:

Dockerfiles  
docker-compose.yml  
Kubernetes manifests  
Helm charts cuando corresponda  
CI/CD pipelines  
Environment templates  
Monitoring configuration  
Health endpoints

Endpoints:

GET /health  
GET /ready  
GET /api/session  
POST /api/session  
DELETE /api/session/:id

# ==================================================  
39. REPOSITORY STRUCTURE

Proponer una estructura similar a:

/virtual-garden  
/unreal  
/Source  
/Content  
/Config  
/Plugins

```
/web
    /app
    /components
    /hooks
    /lib
    /styles
    /types

/backend
    /src
    /modules
    /services
    /routes
    /workers

/pixel-streaming
    /signalling
    /frontend
    /config

/infrastructure
    /docker
    /kubernetes
    /terraform

/scripts
/docs
/tests

```

# ==================================================  
40. CODE QUALITY

Seguir:

- SOLID
- DRY
- Dependency inversion
- Strong typing
- Clear module boundaries
- Configuration-driven systems
- Defensive programming
- Error handling
- Logging
- Documentation

C++ debe utilizar Unreal coding conventions.

TypeScript debe utilizar strict mode.

No usar any salvo casos estrictamente justificados.

No hard-codear:

- API URLs
- Session configuration
- Narrative text
- Cloud credentials
- GPU configuration
- Pixel Streaming endpoints

# ==================================================  
41. ENVIRONMENT CONFIGURATION

Crear:

.env.example

Variables conceptuales:

NEXT_PUBLIC_API_URL  
NEXT_PUBLIC_PIXEL_STREAMING_URL  
NEXT_PUBLIC_ENVIRONMENT  
REDIS_URL  
DATABASE_URL  
TURN_SERVER_URL  
TURN_USERNAME  
TURN_CREDENTIAL  
SESSION_TIMEOUT  
MAX_SESSIONS_PER_WORKER

Los secretos reales nunca deben entrar al repositorio.

# ==================================================  
42. FINAL DELIVERABLE

Entregar:

1. Unreal Engine project
2. C++ source
3. Blueprint architecture
4. Environment assets
5. Materials
6. Foliage system
7. Niagara VFX
8. Audio system
9. Narrative system
10. Web frontend
11. Backend API
12. Pixel Streaming integration
13. Signalling infrastructure
14. TURN/STUN configuration
15. Docker configuration
16. Cloud deployment configuration
17. CI/CD
18. Monitoring
19. Automated tests
20. Documentation

# ==================================================  
43. DOCUMENTATION

Crear:

[README.md](http://README.md)  
[ARCHITECTURE.md](http://ARCHITECTURE.md)  
[DEPLOYMENT.md](http://DEPLOYMENT.md)  
PIXEL_[STREAMING.md](http://STREAMING.md)  
UNREAL_[SETUP.md](http://SETUP.md)  
WEB_[SETUP.md](http://SETUP.md)  
AUDIO_[SETUP.md](http://SETUP.md)  
[PERFORMANCE.md](http://PERFORMANCE.md)  
[TROUBLESHOOTING.md](http://TROUBLESHOOTING.md)  
[SECURITY.md](http://SECURITY.md)

Documentar exactamente:

- Local development
- Unreal build
- Pixel Streaming setup
- GPU requirements
- Cloud deployment
- Environment variables
- Scaling
- Monitoring
- Debugging WebRTC
- Browser compatibility
- Performance profiling

# ==================================================  
44. ACCEPTANCE CRITERIA

La implementación será considerada exitosa cuando:

1. El usuario pueda abrir una URL desde un navegador moderno.
2. No necesite instalar Unreal Engine.
3. No necesite descargar el proyecto.
4. El stream de Unreal se conecte automáticamente.
5. El usuario pueda caminar por el jardín.
6. Mouse/keyboard funcionen.
7. Touch funcione en dispositivos compatibles.
8. Las estaciones reaccionen a proximidad.
9. Aparezcan textos narrativos.
10. El audio sea espacial.
11. El viento afecte la vegetación.
12. Niagara genere polen/pétalos.
13. Nanite sea utilizado estratégicamente.
14. Lumen produzca iluminación dinámica.
15. El entorno alcance calidad cinematográfica.
16. La sesión sobreviva a fluctuaciones razonables de red mediante reconexión.
17. El backend gestione sesiones.
18. Los GPU workers puedan escalar.
19. Existan métricas de rendimiento.
20. Existan logs y health checks.
21. Existan pruebas automatizadas.
22. El sistema tenga documentación completa.
23. No existan credenciales hard-coded.
24. El frontend sea responsive.
25. La experiencia sea suficientemente intuitiva para un usuario que jamás haya usado Unreal Engine.

# ==================================================  
45. PRIORIDAD DE IMPLEMENTACIÓN

Fase 1 — Technical Prototype

- UE5 environment
- Basic character
- Basic path
- One station
- Pixel Streaming
- Basic browser UI

Fase 2 — Visual Production

- Nanite
- Lumen
- Megascans
- SpeedTree
- Foliage
- Materials
- Lighting
- Niagara

Fase 3 — Interaction

- Station framework
- Narrative system
- Proximity detection
- Browser ↔ Unreal messaging

Fase 4 — Audio

- MetaSounds
- Spatial audio
- Steam Audio
- Dynamic music

Fase 5 — Web Platform

- React
- Next.js
- Session management
- Reconnect
- Responsive touch controls

Fase 6 — Cloud

- GPU workers
- Signalling
- TURN
- Docker
- Autoscaling
- Monitoring

Fase 7 — Optimization

- Unreal Insights
- GPU profiling
- Network optimization
- Asset optimization
- Scalability profiles

Fase 8 — QA

- Browser compatibility
- Mobile
- Load tests
- Failure scenarios
- Security testing

Fase 9 — Production

- CI/CD
- Cloud deployment
- Monitoring
- Backup/recovery
- Documentation
- Production launch

# ==================================================  
46. DEVELOPMENT PRINCIPLE

El proyecto debe optimizarse simultáneamente para:

VISUAL QUALITY  
+  
INTERACTIVITY  
+  
LOW LATENCY  
+  
SCALABILITY  
+  
ACCESSIBILITY  
+  
SECURITY  
+  
MAINTAINABILITY

No sacrificar arquitectura por una demo rápida.

No crear sistemas monolíticos.

No depender de lógica exclusivamente visual.

No asumir hardware de gama alta del usuario final, ya que el renderizado ocurre en la GPU remota.

El navegador debe funcionar como cliente ligero.

Unreal Engine debe ser tratado como el motor de renderizado, simulación e interacción.

La infraestructura debe ser tratada como una plataforma de streaming escalable.

El resultado final debe sentirse como una experiencia artística interactiva de alta gama, no como una página web con un vídeo incrustado.

# ==================================================  
47. REQUIRED OUTPUT FROM THE DEVELOPMENT AGENT

Antes de implementar, producir:

A. Architecture diagram  
B. Technology matrix  
C. Repository structure  
D. Unreal module architecture  
E. C++ class diagram  
F. Blueprint responsibility map  
G. Pixel Streaming topology  
H. Cloud infrastructure diagram  
I. Database/session model  
J. Browser compatibility matrix  
K. Performance budget  
L. Asset budget  
M. Network bandwidth budget  
N. GPU specification recommendations  
O. Security model  
P. CI/CD pipeline  
Q. Development roadmap  
R. Risk register

Después de aprobar la arquitectura:

1. Construir el vertical slice.
2. Validar Pixel Streaming.
3. Validar navegación.
4. Validar una estación completa.
5. Validar audio espacial.
6. Validar browser communication.
7. Medir rendimiento.
8. Escalar la arquitectura.
9. Completar contenido.
10. Preparar producción.

El código generado debe ser ejecutable, organizado y acompañado de instrucciones exactas de instalación, configuración, compilación y despliegue.

No entregar pseudocódigo cuando pueda entregarse código real.

No inventar APIs de Unreal Engine.

Cuando una integración dependa de una versión específica de Unreal Engine, documentar explícitamente la versión y la compatibilidad.

El resultado debe estar diseñado como un producto real que pueda ponerse en producción mediante una URL pública.