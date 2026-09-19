# Unreal Engine 5.6 — guía futura

> No existe proyecto ni runtime Unreal en el estado actual. Esta guía define criterios para un spike futuro y evita presentar como implementada una integración inexistente.

## Precondiciones

- Versión fijada de Unreal Engine 5.6.x obtenida por un canal autorizado.
- Toolchain, sistema operativo y GPU soportados por esa versión.
- Licencias aprobadas para Unreal, Fab/Megascans, SpeedTree, audio y assets.
- Repositorio preparado para Git LFS antes de agregar binarios.

## Procedimiento de validación

1. Abra la documentación oficial correspondiente exactamente a UE 5.6.
2. Verifique allí la habilitación y requisitos del plugin Pixel Streaming, plataforma soportada, codecs, flags de lanzamiento, frontend e infraestructura de signalling.
3. Confirme nombres contra plugins, headers, ejemplos y archivos instalados localmente.
4. Cree una ADR con versión 5.6.x, URL oficial, fecha, decisión y prueba realizada.
5. Cree un proyecto mínimo fuera del vertical slice; empaquete y ejecute en la misma clase de GPU del worker.
6. Solo después incorpore el proyecto bajo `/unreal`.

No se incluyen comandos de AutomationTool, clases del plugin ni parámetros de consola porque no fueron verificados aquí contra una instalación UE 5.6; copiarlos de 5.4/5.5 podría ser incorrecto.

## Arquitectura de proyecto propuesta

```text
unreal/
├── Config/
├── Content/
│   ├── Garden/{Environment,Stations,Materials,Foliage,VFX}
│   ├── Narrative/DataAssets/
│   ├── Audio/{MetaSounds,Music,Ambience}
│   └── UI/
├── Plugins/Garden/
└── Source/{GardenCore,GardenGameplay,GardenNarrative,GardenAudio,
            GardenEnvironment,GardenStreamingBridge,GardenTelemetry}
```

Consulte módulos, clases y Blueprints conceptuales en [ARCHITECTURE.md](ARCHITECTURE.md).

## Vertical slice de aceptación

- build empaquetado, no PIE, inicia en worker;
- una estación completa reacciona a proximidad/interacción;
- Enhanced Input cubre teclado/mouse y un camino touch validado;
- narrativa proviene de Data Asset;
- audio espacial se mezcla y escucha en browser;
- Niagara, iluminación y vegetación respetan el perfil de rendimiento;
- ida/vuelta de un mensaje JSON versionado por Data Channel;
- captura de Unreal Insights/CPU/GPU y métricas WebRTC;
- reconexión o error seguro ante pérdida del proceso.

## Calidad visual

Evaluar Nanite por tipo de asset; no activarlo indiscriminadamente en foliage/materiales masked. Medir Lumen, Virtual Shadow Maps, volumetría, Niagara, WPO y foliage en la GPU objetivo. Definir perfiles Cinematic/Ultra/High/Medium/Performance, pero operar por defecto en el perfil que mantenga frame pacing estable.

## Build y automatización futura

El runner debe estar licenciado y preparado con UE 5.6, toolchain y caché. Separar validación de código, cook/package, tests y publicación del artefacto. Nunca descargar el engine o aceptar licencias implícitamente en un workflow. Escanear el paquete y generar SBOM de dependencias auxiliares.
