const API = { geocoding: "https://geocoding-api.open-meteo.com/v1/search", forecast: "https://api.open-meteo.com/v1/forecast" };

const dom = {
  form: document.querySelector("#search-form"), input: document.querySelector("#city-input"), button: document.querySelector("#search-button"), loading: document.querySelector("#loading-state"), feedback: document.querySelector("#feedback"), feedbackTitle: document.querySelector("#feedback-title"), feedbackMessage: document.querySelector("#feedback-message"), retry: document.querySelector("#retry-button"), connection: document.querySelector("#connection-banner"), panel: document.querySelector("#weather-panel"), locationName: document.querySelector("#location-name"), locationCountry: document.querySelector("#location-country"), locationTimezone: document.querySelector("#location-timezone"), updatedTime: document.querySelector("#updated-time"), currentDate: document.querySelector("#current-date"), currentIcon: document.querySelector("#current-icon"), currentTemperature: document.querySelector("#current-temperature"), currentCondition: document.querySelector("#current-condition"), currentMax: document.querySelector("#current-max"), currentMin: document.querySelector("#current-min"), feelsLike: document.querySelector("#feels-like"), humidity: document.querySelector("#humidity"), windSpeed: document.querySelector("#wind-speed"), daylight: document.querySelector("#daylight"), forecastList: document.querySelector("#forecast-list")
};

const descriptions = { 0: ["Despejado", "☀️"], 1: ["Mayormente despejado", "🌤️"], 2: ["Parcialmente nublado", "⛅"], 3: ["Nublado", "☁️"], 45: ["Niebla", "🌫️"], 48: ["Niebla con escarcha", "🌫️"], 51: ["Llovizna ligera", "🌦️"], 53: ["Llovizna moderada", "🌦️"], 55: ["Llovizna intensa", "🌧️"], 56: ["Llovizna helada", "🌧️"], 57: ["Llovizna helada intensa", "🌧️"], 61: ["Lluvia ligera", "🌦️"], 63: ["Lluvia moderada", "🌧️"], 65: ["Lluvia intensa", "🌧️"], 66: ["Lluvia helada", "🌧️"], 67: ["Lluvia helada intensa", "🌧️"], 71: ["Nieve ligera", "🌨️"], 73: ["Nieve moderada", "🌨️"], 75: ["Nieve intensa", "❄️"], 77: ["Granizo de nieve", "❄️"], 80: ["Chubascos ligeros", "🌦️"], 81: ["Chubascos moderados", "🌧️"], 82: ["Chubascos intensos", "⛈️"], 85: ["Chubascos de nieve", "🌨️"], 86: ["Chubascos de nieve intensos", "🌨️"], 95: ["Tormenta eléctrica", "⛈️"], 96: ["Tormenta con granizo ligero", "⛈️"], 99: ["Tormenta con granizo", "⛈️"] };
let lastSearch = "Quetzaltenango";
let controller;

function weatherDescription(code) { return descriptions[code] || ["Condición variable", "🌡️"]; }
function formatDay(date) { return new Intl.DateTimeFormat("es-GT", { weekday: "long", day: "numeric", month: "short" }).format(new Date(`${date}T12:00:00`)); }
function formatShortDay(date) { return new Intl.DateTimeFormat("es-GT", { weekday: "short" }).format(new Date(`${date}T12:00:00`)); }
function formatDateTime(iso) { return new Intl.DateTimeFormat("es-GT", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); }
function setLoading(value) { dom.loading.hidden = !value; if (value) dom.panel.hidden = true; dom.button.disabled = value; dom.button.querySelector("span").textContent = value ? "Consultando" : "Consultar"; }
function showFeedback(title, message, retry = false) { dom.feedbackTitle.textContent = title; dom.feedbackMessage.textContent = message; dom.retry.hidden = !retry; dom.feedback.hidden = false; }
function hideFeedback() { dom.feedback.hidden = true; }
function updateConnection() { dom.connection.hidden = navigator.onLine; if (!navigator.onLine) dom.connection.textContent = "Estás sin conexión. El pronóstico necesita internet para actualizarse."; }

async function getJson(url, signal) { const response = await fetch(url, { signal }); if (!response.ok) throw new Error(`La API respondió con ${response.status}.`); const data = await response.json(); if (data.error) throw new Error(data.reason || "La API devolvió un error."); return data; }
async function findLocation(city, signal) { const query = new URLSearchParams({ name: city, count: "1", language: "es", format: "json" }); const data = await getJson(`${API.geocoding}?${query}`, signal); if (!data.results?.length) throw new Error(`No encontramos “${city}”. Prueba con otro nombre o agrega el país.`); return data.results[0]; }
async function findForecast(location, signal) { const query = new URLSearchParams({ latitude: location.latitude, longitude: location.longitude, current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m", daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset", forecast_days: "5", temperature_unit: "celsius", wind_speed_unit: "kmh", timezone: "auto" }); return getJson(`${API.forecast}?${query}`, signal); }

function renderForecast(data) {
  dom.forecastList.replaceChildren();
  data.daily.time.forEach((date, index) => { const [description, icon] = weatherDescription(data.daily.weather_code[index]); const item = document.createElement("article"); item.className = `forecast-item${index === 0 ? " today" : ""}`; item.innerHTML = `<div class="forecast-day">${index === 0 ? "Hoy" : formatShortDay(date)}</div><div class="forecast-icon" aria-hidden="true">${icon}</div><div class="forecast-description">${description}</div><div class="forecast-temps"><strong>${Math.round(data.daily.temperature_2m_max[index])}°</strong><span>${Math.round(data.daily.temperature_2m_min[index])}°</span></div>`; dom.forecastList.append(item); });
}

function renderWeather(location, data) {
  const [condition, icon] = weatherDescription(data.current.weather_code);
  dom.locationName.textContent = location.name; dom.locationCountry.textContent = [location.admin1, location.country].filter(Boolean).join(", "); dom.locationTimezone.textContent = location.timezone || data.timezone; dom.updatedTime.textContent = "Actualizado ahora"; dom.currentDate.textContent = formatDateTime(data.current.time); dom.currentIcon.textContent = icon; dom.currentTemperature.textContent = Math.round(data.current.temperature_2m); dom.currentCondition.textContent = condition; dom.currentMax.textContent = `${Math.round(data.daily.temperature_2m_max[0])}°`; dom.currentMin.textContent = `${Math.round(data.daily.temperature_2m_min[0])}°`; dom.feelsLike.textContent = `${Math.round(data.current.apparent_temperature)}°C`; dom.humidity.textContent = `${Math.round(data.current.relative_humidity_2m)}%`; dom.windSpeed.textContent = `${Math.round(data.current.wind_speed_10m)} km/h`; dom.daylight.textContent = `${Math.round((new Date(data.daily.sunset[0]) - new Date(data.daily.sunrise[0])) / 3600000)} h`; renderForecast(data);
}

async function loadWeather(city) {
  if (!city.trim()) { showFeedback("Escribe una ciudad", "Necesitamos un nombre para buscar el pronóstico."); dom.input.focus(); return; }
  if (!navigator.onLine) { updateConnection(); showFeedback("Sin conexión", "No podemos consultar Open-Meteo hasta que recuperes internet.", true); return; }
  controller?.abort(); controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 12000); lastSearch = city.trim(); hideFeedback(); setLoading(true);
  try { const location = await findLocation(lastSearch, controller.signal); const data = await findForecast(location, controller.signal); renderWeather(location, data); dom.panel.hidden = false; }
  catch (error) { showFeedback(error.name === "AbortError" ? "La consulta tardó demasiado" : "No pudimos cargar el clima", error.name === "AbortError" ? "Comprueba tu conexión e inténtalo de nuevo." : (error.message || "Ocurrió un error inesperado."), true); }
  finally { clearTimeout(timer); setLoading(false); }
}

dom.form.addEventListener("submit", (event) => { event.preventDefault(); loadWeather(dom.input.value); });
dom.retry.addEventListener("click", () => loadWeather(lastSearch));
document.querySelectorAll("[data-city]").forEach((button) => button.addEventListener("click", () => { dom.input.value = button.dataset.city; loadWeather(button.dataset.city); }));
window.addEventListener("online", updateConnection); window.addEventListener("offline", updateConnection); updateConnection(); dom.input.value = lastSearch; loadWeather(lastSearch);

