# 01 - Weather App

## 1. Objetivo

Construir una aplicación web local que permita buscar una ciudad y mostrar su clima actual junto con un pronóstico de cinco días, usando Open-Meteo.

## 2. Alcance

### Entra

- Búsqueda de una ciudad por nombre.
- Conversión del nombre a coordenadas mediante el servicio de geocodificación de Open-Meteo.
- Clima actual: temperatura, sensación térmica, condición del cielo, velocidad del viento y humedad.
- Pronóstico diario de cinco días con temperatura máxima y mínima.
- Estado visible de carga.
- Mensajes visibles para ciudad inexistente, conexión fallida y respuesta inválida.
- Diseño usable en teléfono y computadora.
- Ciudad inicial de Quetzaltenango para demostrar el funcionamiento al abrir la aplicación.

### No entra

- Inicio de sesión o cuentas de usuario.
- Persistencia de favoritos.
- Mapas, radar meteorológico o geolocalización del dispositivo.
- Backend propio.
- Uso comercial de la API.

## 3. Modelo de datos

### Ciudad seleccionada

```text
Location {
  name: string
  country: string
  admin1: string | undefined
  latitude: number
  longitude: number
  timezone: string
}
```

### Condiciones actuales

```text
CurrentWeather {
  temperature: number
  apparentTemperature: number
  weatherCode: number
  windSpeed: number
  humidity: number
}
```

### Pronóstico diario

```text
ForecastDay {
  date: string
  weatherCode: number
  temperatureMax: number
  temperatureMin: number
}
```

### Endpoints

- `GET https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=es&format=json`
- `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`

## 4. Plan de implementación

1. Crear la estructura estática y los estados base de la interfaz.
2. Implementar la búsqueda de ciudad y el manejo de resultados vacíos.
3. Implementar la consulta de clima actual y pronóstico diario.
4. Renderizar datos, unidades, fechas y descripciones del cielo.
5. Añadir estados de carga, error, desconexión y reintento.
6. Ajustar la interfaz para pantallas angostas y validar con pruebas manuales.

Cada paso debe dejar la aplicación abierta y comprobable en el navegador.

## 5. Criterios de aceptación

- [ ] Al abrir la aplicación, se muestra Quetzaltenango o un estado de carga que termina mostrando sus datos.
- [ ] El usuario puede escribir una ciudad y ejecutar la búsqueda con el botón o la tecla Enter.
- [ ] Una ciudad válida muestra nombre, país, temperatura, sensación térmica, condición del cielo, viento y humedad.
- [ ] Se muestran al menos tres días de pronóstico con máxima y mínima; la implementación muestra cinco.
- [ ] Mientras se espera una respuesta, aparece un indicador visible y el botón no permite solicitudes duplicadas.
- [ ] Una ciudad inventada muestra un mensaje claro y conserva la interfaz usable.
- [ ] Una falla de red muestra un mensaje claro con opción para reintentar.
- [ ] Al perder conexión, la interfaz informa que no hay conexión y no queda congelada.
- [ ] La interfaz se puede usar sin desplazamiento horizontal en una pantalla angosta.
- [ ] El proyecto no contiene llaves ni credenciales.

## 6. Decisiones tomadas y descartadas

### Tomadas

- Usar HTML, CSS y JavaScript puros para reducir la superficie técnica y facilitar la explicación línea por línea.
- Usar `timezone=auto` para que las fechas diarias correspondan a la ubicación consultada.
- Mostrar cinco días aunque el mínimo académico sea tres, porque mejora la utilidad sin aumentar la complejidad de forma significativa.
- Usar `AbortController` para dar un límite de tiempo a las solicitudes.

### Descartadas

- React o un framework: no son necesarios para esta interfaz y añadirían instalación y configuración.
- API con llave: Open-Meteo ofrece los endpoints requeridos sin llave para el uso no comercial definido por la tarea.
- Geolocalización automática: no fue solicitada y obligaría a pedir permisos del navegador.

