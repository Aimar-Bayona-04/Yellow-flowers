# Audio

## Estado actual

El vertical slice WebGL usa las capacidades de audio del navegador/aplicación existente. Unreal Audio Engine, MetaSounds, Steam Audio y audio enviado por Pixel Streaming no están implementados.

## Diseño futuro UE 5.6

Capas: ambiente forestal, viento, aves, vegetación/microsonidos, música y audio por estación. `UGardenAudioManager` conceptual controla estados `Exploration`, `Memory`, `Friendship`, `Love` y `Final`; Blueprints disparan presentación, no mantienen autoridad narrativa.

Usar atenuación, spatialization/HRTF, oclusión y zonas de reverb solo tras confirmar soporte y coste en UE 5.6. Steam Audio es opcional: validar versión/plugin, licencia, plataforma, geometría acústica y CPU antes de adoptarlo. No afirmar compatibilidad por anticipado.

## Pixel Streaming

La escena se espacializa en el worker y el navegador recibe la mezcla de audio negociada por WebRTC; por ello:

- validar con audífonos y altavoces;
- medir sincronía A/V y continuidad durante reconexión;
- no asumir que metadata espacial sobrevive al stream;
- evitar clipping: objetivo de mezcla integrado orientativo −16 LUFS y true peak ≤ −1 dBTP, sujeto a pruebas creativas;
- requerir gesto del usuario para iniciar/reanudar audio en navegadores con autoplay bloqueado;
- ofrecer mute, volumen, captions/transcripción y experiencia no dependiente del audio.

## Budget inicial

- audio assets residentes: ≤256 MiB por worker;
- voces simultáneas: 32 objetivo, 48 máximo antes de virtualización/prioridad;
- audio game-thread + render: ≤2 ms total en perfil High;
- stream estéreo: 64–160 kbps según codec/negociación.

Medir con la herramienta de profiling disponible y confirmada en UE 5.6. Auditar licencias, loops, sample rate y compresión; no incluir masters innecesarios en el paquete.

## QA

Probar transiciones sin clicks, loops, oclusión, reverb, prioridad de voz, pérdida de paquetes, mute del SO, cambio de dispositivo, Safari/iOS, pestaña en background y captions. Registrar fallos con estación, navegador, salida, codec, RTT y build, sin datos personales.
