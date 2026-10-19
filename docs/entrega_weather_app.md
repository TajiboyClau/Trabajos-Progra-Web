# Entrega - Weather App

> **Estado:** borrador listo para completar con datos personales, enlace de la rama y capturas propias.

## Portada

- Nombre: **[COMPLETAR]**
- Carné: **[COMPLETAR]**
- Sección: **[COMPLETAR]**
- Repositorio: `https://github.com/TajiboyClau/Trabajos-Progra-Web/tree/weather-app-sdd`

## La aplicación

La aplicación se construyó con HTML semántico, CSS y JavaScript vanilla. Consulta Open-Meteo en dos pasos: primero convierte el nombre de la ciudad en coordenadas con el endpoint de geocodificación y después consulta el pronóstico usando esas coordenadas.

Incluye clima actual, sensación térmica, condición del cielo, humedad, velocidad del viento y cinco días de pronóstico. También incluye estados de carga, error, reintento y desconexión.

### Capturas requeridas

1. **Clima válido:** insertar una captura de la aplicación mostrando una ciudad real y sus datos.
2. **Estado de error:** insertar una captura buscando `CiudadInexistenteXYZ` o con la conexión desactivada.

## Modelo

Se conectó `GPT-5.6 Terra Fast OpenAI` en OpenCode. Se eligió porque estaba disponible en la cuenta y era adecuado para razonar sobre una especificación, revisar decisiones de arquitectura y trabajar por etapas. No se usaron llaves dentro del repositorio.

## Instrucciones globales

El archivo global creado fue `C:\Users\claud\.config\opencode\AGENTS.md` y contiene:

```markdown
# Reglas personales

- Responder siempre en español.
- Antes de crear un archivo nuevo, explicar qué contendrá y esperar confirmación.
- No instalar dependencias sin preguntar primero.
- Explicar el porqué de cada decisión técnica.
- Trabajar en pasos pequeños y mostrar los cambios antes de continuar.
```

La comprobación se hizo preguntando a OpenCode qué reglas estaba siguiendo antes de permitir modificaciones. **[INSERTAR CAPTURA DE LA COMPROBACIÓN FINAL]**

## tui.json

El archivo activa las notificaciones y el sonido de atención. Respecto al punto de partida, se cambió `scroll_speed` de 3 a 4 y se habilitó `mouse: true`; se conservaron el cursor parpadeante y las notificaciones.

## AGENTS.md del proyecto

El `AGENTS.md` del proyecto documenta el stack, cómo ejecutar la aplicación, los endpoints utilizados, las convenciones, los estados que deben mantenerse visibles y las decisiones de arquitectura. Se agregó manualmente el apartado de decisiones y las instrucciones de ejecución.

## .gitignore

- `node_modules/`, `dist/` y `coverage/`: archivos regenerables o dependencias.
- `.DS_Store`, `Thumbs.db`: archivos del sistema operativo.
- `*.local`: configuraciones locales que no deben versionarse.
- `.env` y `.env.*`: posibles variables y secretos; `.env.example` queda permitido como plantilla.
- `.vscode/`, `.idea/` y `*.swp`: configuraciones o temporales personales del editor.

## Explicaciones

### `/undo` y `/redo`

`/undo` revierte el último conjunto de cambios que hizo el agente y `/redo` vuelve a aplicar ese cambio. Funcionan como una red de seguridad para experimentar sin perder el estado anterior, apoyándose en el repositorio Git.

### `/compact`

`/compact` resume la conversación cuando la sesión se vuelve larga. Conserva las decisiones importantes en menos espacio, pero puede perder detalles, por eso las decisiones permanentes deben quedar en `AGENTS.md` o en el spec.

### `/init`

`/init` analiza el proyecto y genera un `AGENTS.md` inicial. Ese archivo debe revisarse y completarse manualmente; no debe tratarse como documentación terminada automáticamente.

### `.gitignore`

`.gitignore` indica a Git qué archivos no debe mostrar ni versionar. Se creó antes de la implementación para evitar que dependencias, configuraciones locales o secretos entren al historial.

### Modos Plan y Build

Plan propone la arquitectura y los pasos sin editar el proyecto. Build ejecuta los cambios aprobados. En este trabajo el spec congeló las decisiones principales antes de implementar, y cada fase se guardó en un commit separado.

## Plan contra resultado

El plan inicial proponía consultar una ciudad y mostrar únicamente el camino exitoso. Se cambió para exigir explícitamente estados de carga, ciudad inexistente, desconexión, timeout y reintento, porque el requisito de calidad de la hoja pide que la aplicación no quede en blanco ni congelada cuando falla la red.

## Dónde se equivocó el agente

Durante la primera versión, cuando una nueva búsqueda fallaba, el mensaje de error aparecía pero el panel con los datos anteriores podía volver a mostrarse debajo. Se detectó al probar `CiudadInexistenteXYZ`, se cambió el control del estado de carga para no reactivar el panel anterior al terminar con error y se verificó nuevamente que solo apareciera el mensaje de error.

## Historial de commits

- `docs: define weather app spec and project rules`
- `feat: build weather app with Open-Meteo`
- `fix: hide stale weather data on request errors`

## Verificación final

- [x] Repositorio Git y rama separada `weather-app-sdd`.
- [x] Spec con las seis secciones SDD.
- [x] Búsqueda de ciudades y consulta a Open-Meteo.
- [x] Clima actual y cinco días de pronóstico.
- [x] Estado visible de carga.
- [x] Error visible para ciudad inexistente y fallas de red.
- [x] Diseño responsive.
- [x] Sin llaves ni credenciales en los archivos versionados.
- [ ] Captura de clima válido.
- [ ] Captura de estado de error.
- [ ] Datos personales y captura final de reglas globales.
- [ ] Publicar la rama en GitHub con `git push -u origin weather-app-sdd`.

