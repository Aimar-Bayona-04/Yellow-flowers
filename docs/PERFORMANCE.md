# Rendimiento y presupuestos

Son límites iniciales para diseño, no resultados medidos. Deben validarse por build, GPU, navegador, región y red; guardar p50/p95/p99.

## K. Runtime

| Recurso | High objetivo | Límite operativo |
|---|---:|---:|
| FPS | 60 | 30 mínimo degradado |
| Frame total | 16.7 ms | 33.3 ms |
| Game thread | ≤5 ms | ≤10 ms |
| Render thread | ≤5 ms | ≤10 ms |
| GPU | ≤14 ms | ≤28 ms |
| Frame-time p95 | ≤20 ms | ≤33.3 ms |
| VRAM proceso | ≤10 GiB | ≤80% de VRAM |
| RAM proceso | ≤12 GiB | ≤80% del host |
| Audio CPU | ≤2 ms | ≤4 ms |

Perfilar el WebGL actual con DevTools y la escena futura con herramientas confirmadas para UE 5.6, incluyendo Unreal Insights, `stat unit`/`stat gpu` si siguen disponibles. Medir build empaquetado, no solo editor.

## L. Assets

| Categoría UE futura | Budget inicial |
|---|---:|
| paquete comprimido del vertical slice | ≤20 GiB |
| texturas residentes | ≤5 GiB |
| geometría/Nanite residente | ≤3 GiB |
| audio residente | ≤256 MiB |
| Niagara simultáneo | ≤100k partículas visibles, perfiladas |
| materiales visibles | ≤200 instancias; ≤80 materiales base |

Texturas hero hasta 4K solo justificadas por cobertura; 2K/1K para secundarios. Usar instancing, streaming, culling/HLOD, mipmaps y Virtual Textures cuando la medición lo favorezca. Foliage masked/WPO, sombras y translucencia requieren budgets por vista. Cada asset registra origen/licencia, tamaño disco/residente, triángulos, materiales y LOD/Nanite.

## M. Red

| Perfil | Resolución/FPS inicial | Vídeo objetivo | Total estimado |
|---|---|---:|---:|
| Performance móvil | 1280×720 @30 | 3–6 Mbps | 3.2–6.3 Mbps |
| Medium | 1600×900 @30/60 | 5–10 Mbps | 5.3–10.5 Mbps |
| High | 1920×1080 @60 | 10–20 Mbps | 10.5–21 Mbps |
| Cinematic | 2560×1440 @60 | 20–35 Mbps | 21–37 Mbps |

Audio añade aproximadamente 64–160 kbps; señalización/Data Channel son menores pero con límites. Mantener 20% de margen. Objetivos: RTT al worker ≤80 ms ideal/≤150 ms degradado, packet loss <1%, jitter <30 ms e interacción percibida <150 ms cuando la ruta lo permita. No es garantía global.

Egress por sesión:

```text
GB/h ≈ bitrate_Mbps × 0.45
```

Ejemplo: 15 Mbps ≈ 6.75 GB/h. Dimensionar NIC/TURN con concurrencia, overhead y margen; TURN puede duplicar tráfico de relay.

## N. GPU

Probar, no asumir, capacidad/codec por SKU:

- **Desarrollo:** NVIDIA RTX con ≥12 GiB VRAM y encoder soportado por la combinación UE 5.6/driver.
- **Staging 1080p60:** GPU datacenter NVIDIA equivalente a L4/A10 con ≥16–24 GiB.
- **Cinematic/1440p:** clase L40S/RTX profesional con ≥24–48 GiB si las mediciones lo requieren.

Verificar matriz de drivers, sistema operativo, RHI, encoder y codec en UE 5.6 y proveedor. Una GPU puede alojar más de un proceso solo si encoder sessions, VRAM, FPS, aislamiento y licencia lo permiten. Reservar 20% de GPU/VRAM y evitar operar al límite térmico.

## Perfiles y degradación

Orden de reducción: resolución/bitrate → volumetría/Niagara → sombras/reflections → foliage/view distance → Lumen/effects según dirección artística. Congestión de red no debe cambiar calidad Unreal de manera oscilante; aplicar hysteresis y cooldown. Mobile empieza conservador.

## Pruebas

Escenarios: 10/50/100/500 sesiones según capacidad aprobada, ramp-up controlado, soak, cold/warm start, worker crash, TURN forzado y pérdida/latencia. Medir asignación, conexión, FPS, CPU/GPU/VRAM, bitrate, RTT, pérdida, reconexión, egress y coste por sesión. No ejecutar 500 sesiones contra producción sin autorización.
