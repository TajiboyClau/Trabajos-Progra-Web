# Weather App

Aplicación web de clima construida con HTML, CSS y JavaScript vanilla para el ejercicio de Spec-Driven Development.

## Ejecutar localmente

Desde esta carpeta:

```powershell
python -m http.server 8000
```

Abrir [http://localhost:8000](http://localhost:8000).

No abrir `index.html` directamente con `file://`, porque el servidor local evita restricciones innecesarias del navegador y reproduce el entorno de revisión.

## Comprobaciones manuales

1. Buscar `Quetzaltenango` y comprobar el clima actual y cinco días.
2. Buscar `CiudadInexistenteXYZ` y comprobar el mensaje de error.
3. Desactivar la conexión y buscar otra ciudad; debe aparecer un error entendible y la pantalla no debe congelarse.
4. Reducir el ancho del navegador y comprobar que no aparece desplazamiento horizontal.

## Fuentes

- [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs)
- [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)

