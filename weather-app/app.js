const API = {
  geocoding: "https://geocoding-api.open-meteo.com/v1/search",
  forecast: "https://api.open-meteo.com/v1/forecast",
};

const dom = {
  form: document.querySelector("#search-form"),
  input: document.querySelector("#city-input"),
  button: document.querySelector("#search-button"),
  buttonText: document.querySelector("#search-button span"),
  loading: document.querySelector("#loading-state"),
  feedback: document.querySelector("#feedback"),
  feedbackTitle: document.querySelector("#feedback-title"),
  feedbackMessage: document.querySelector("#feedback-message"),
  retry: document.querySelector("#retry-button"),
  connection: document.querySelector("#connection-banner"),
  panel: document.querySelector("#weather-panel"),
  locationName: document.querySelector("#location-name"),
  locationMeta: document.querySelector("#location-meta"),
  updatedTime: document.querySelector("#updated-time"),
  currentSymbol: document.querySelector("#current-symbol"),
  currentTemperature: document.querySelector("#current-temperature"),
  currentDescription: document.querySelector("#current-description"),
  feelsLike: document.querySelector("#feels-like"),
  humidity: document.querySelector("#humidity"),
  windSpeed: document.querySelector("#wind-speed"),
  forecastGrid: document.querySelector("#forecast-grid"),
};

const weatherDescriptions = {
  0: ["Despejado", "☀️"], 1: ["Mayormente despejado", "🌤️"], 2: ["Parcialmente nublado", "⛅"], 3: ["Nublado", "☁️"],
  45: ["Niebla", "🌫️"], 48: ["Niebla con escarcha", "🌫️"], 51: ["Llovizna ligera", "🌦️"], 53: ["Llovizna moderada", "🌦️"], 55: ["Llovizna intensa", "🌧️"],
  56: ["Llovizna helada", "🌧️"], 57: ["Llovizna helada intensa", "🌧️"], 61: ["Lluvia ligera", "🌦️"], 63: ["Lluvia moderada", "🌧️"], 65: ["Lluvia intensa", "🌧️"],
  66: ["Lluvia helada", "🌧️"], 67: ["Lluvia helada intensa", "🌧️"], 71: ["Nieve ligera", "🌨️"], 73: ["Nieve moderada", "🌨️"], 75: ["Nieve intensa", "❄️"],
  77: ["Granizo de nieve", "❄️"], 80: ["Chubascos ligeros", "🌦️"], 81: ["Chubascos moderados", "🌧️"], 82: ["Chubascos intensos", "⛈️"], 85: ["Chubascos de nieve", "🌨️"],
  86: ["Chubascos de nieve intensos", "🌨️"], 95: ["Tormenta eléctrica", "⛈️"], 96: ["Tormenta con granizo ligero", "⛈️"], 99: ["Tormenta con granizo", "⛈️"],
};

let lastSearch = "Quetzaltenango";
let activeController;

function getWeatherDescription(code) {
  return weatherDescriptions[code] || ["Condición variable", "🌡️"];
}

function setLoading(isLoading) {
  dom.loading.hidden = !isLoading;
  dom.panel.hidden = isLoading;
  dom.button.disabled = isLoading;
  dom.buttonText.textContent = isLoading ? "Consultando..." : "Buscar clima";
}

function showFeedback(title, message, canRetry = false) {
  dom.feedbackTitle.textContent = title;
  dom.feedbackMessage.textContent = message;
  dom.retry.hidden = !canRetry;
  dom.feedback.hidden = false;
}

function hideFeedback() { dom.feedback.hidden = true; }

function updateConnectionBanner() {
  if (navigator.onLine) { dom.connection.hidden = true; return; }
  dom.connection.textContent = "No hay conexión a internet. Revisa tu conexión para consultar datos nuevos.";
  dom.connection.hidden = false;
}

async function fetchJson(url, signal) {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`La API respondió con ${response.status}.`);
  const data = await response.json();
  if (data.error) throw new Error(data.reason || "La API devolvió un error.");
  return data;
}

async function searchLocation(city, signal) {
  const params = new URLSearchParams({ name: city, count: "1", language: "es", format: "json" });
  const data = await fetchJson(`${API.geocoding}?${params}`, signal);
  if (!data.results?.length) throw new Error(`No encontramos la ciudad “${city}”. Prueba con otro nombre o agrega el país.`);
  return data.results[0];
}

async function fetchForecast(location, signal) {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: "5",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    timezone: "auto",
  });
  return fetchJson(`${API.forecast}?${params}`, signal);
}

function formatDate(date, options) {
  return new Intl.DateTimeFormat("es-GT", options).format(new Date(`${date}T12:00:00`));
}

function renderForecast(data) {
  const { daily } = data;
  dom.forecastGrid.replaceChildren();
  daily.time.forEach((date, index) => {
    const [description, symbol] = getWeatherDescription(daily.weather_code[index]);
    const card = document.createElement("article");
    card.className = `forecast-card${index === 0 ? " today" : ""}`;
    card.innerHTML = `
      <div class="forecast-day">${index === 0 ? "Hoy" : formatDate(date, { weekday: "short" })}</div>
      <div class="forecast-symbol" aria-hidden="true">${symbol}</div>
      <div class="forecast-desc">${description}</div>
      <div class="forecast-temperatures"><strong>${Math.round(daily.temperature_2m_max[index])}°</strong><span>${Math.round(daily.temperature_2m_min[index])}°</span></div>
    `;
    dom.forecastGrid.append(card);
  });
}

function renderWeather(location, data) {
  const [description, symbol] = getWeatherDescription(data.current.weather_code);
  dom.locationName.textContent = location.name;
  dom.locationMeta.textContent = [location.admin1, location.country].filter(Boolean).join(", ");
  dom.updatedTime.textContent = `Actualizado ${formatDate(data.current.time.slice(0, 10), { day: "numeric", month: "short" })}`;
  dom.currentSymbol.textContent = symbol;
  dom.currentTemperature.textContent = Math.round(data.current.temperature_2m);
  dom.currentDescription.textContent = description;
  dom.feelsLike.textContent = `${Math.round(data.current.apparent_temperature)} °C`;
  dom.humidity.textContent = `${Math.round(data.current.relative_humidity_2m)} %`;
  dom.windSpeed.textContent = `${Math.round(data.current.wind_speed_10m)} km/h`;
  renderForecast(data);
}

async function loadWeather(city) {
  if (!city.trim()) { showFeedback("Escribe una ciudad", "Necesitamos un nombre para buscar el pronóstico."); dom.input.focus(); return; }
  if (!navigator.onLine) {
    updateConnectionBanner();
    showFeedback("Sin conexión", "No podemos consultar Open-Meteo mientras estás sin conexión. Revisa tu red e inténtalo de nuevo.", true);
    return;
  }

  activeController?.abort();
  activeController = new AbortController();
  const timeoutId = setTimeout(() => activeController.abort(), 12000);
  lastSearch = city.trim();
  hideFeedback();
  setLoading(true);

  try {
    const location = await searchLocation(lastSearch, activeController.signal);
    const data = await fetchForecast(location, activeController.signal);
    renderWeather(location, data);
    dom.panel.hidden = false;
  } catch (error) {
    if (error.name === "AbortError") showFeedback("La consulta tardó demasiado", "No recibimos respuesta a tiempo. Comprueba tu conexión e inténtalo de nuevo.", true);
    else showFeedback("No pudimos cargar el clima", error.message || "Ocurrió un error inesperado. Inténtalo de nuevo.", true);
  } finally {
    clearTimeout(timeoutId);
    setLoading(false);
  }
}

dom.form.addEventListener("submit", (event) => { event.preventDefault(); loadWeather(dom.input.value); });
dom.retry.addEventListener("click", () => loadWeather(lastSearch));
window.addEventListener("online", updateConnectionBanner);
window.addEventListener("offline", updateConnectionBanner);
updateConnectionBanner();
dom.input.value = lastSearch;
loadWeather(lastSearch);

