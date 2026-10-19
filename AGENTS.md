# Weather App - contexto del proyecto

## Stack

- HTML semántico, CSS moderno y JavaScript vanilla.
- Sin dependencias de npm ni claves de API.
- Open-Meteo para geocodificación y pronóstico.

## Cómo ejecutar

Desde la raíz del proyecto, usar un servidor HTTP local:

```powershell
python -m http.server 8000
```

Después abrir `http://localhost:8000`.

## API

- Geocodificación: `https://geocoding-api.open-meteo.com/v1/search`.
- Pronóstico: `https://api.open-meteo.com/v1/forecast`.
- La búsqueda usa `name`, `count=1` y `language=es`.
- El pronóstico usa datos actuales y cinco días diarios, con `timezone=auto`.

## Convenciones

- Mantener la interfaz y los mensajes en español.
- Usar funciones pequeñas y nombres descriptivos.
- Mantener los estados de carga, error y éxito visibles.
- No agregar credenciales ni dependencias sin documentar la decisión.
- Revisar el diff después de cada fase y validar la aplicación en pantalla angosta.

## Decisiones de arquitectura

- La aplicación es estática para que pueda abrirse localmente sin proceso de compilación.
- La geocodificación está separada de la consulta meteorológica porque son dos servicios distintos.
- Se usa `AbortController` para evitar solicitudes que queden pendientes indefinidamente.

