const COUNTRIES_API = "https://countriesnow.space/api/v0.1/countries";
const RESTCOUNTRIES_BASE = "https://restcountries.com/v3.1/name/";
const WEATHER_API_KEY = "REPLACE_WITH_YOUR_KEY"; // <-- Replace with your WeatherAPI key

const imgflag = document.querySelector(".Flag");
const drpdowncountry = document.querySelector(".select-opt-country");
const drpdowncity = document.querySelector(".select-opt-city");
const getbtn = document.querySelector(".get-whether-btn button");
const statusPara = document.getElementById("para");

let countriesData = []; // cached countries API response

function setStatus(text) {
  if (statusPara) statusPara.innerText = text;
}

async function fetchCountries() {
  try {
    const res = await fetch(COUNTRIES_API);
    if (!res.ok) throw new Error("Countries API returned " + res.status);
    const json = await res.json();
    countriesData = json.data || [];
  } catch (err) {
    console.error("Failed to load countries:", err);
    setStatus("Failed to load countries. See console.");
    countriesData = [];
  }
}

function populateCountrySelect() {
  drpdowncountry.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.innerText = "Select country";
  drpdowncountry.appendChild(placeholder);

  countriesData.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.country;
    opt.innerText = item.country;
    drpdowncountry.appendChild(opt);
  });

  // Try to set India as default if present
  const indiaOption = Array.from(drpdowncountry.options).find(o => o.value === "India");
  if (indiaOption) drpdowncountry.value = "India";
}

function populateCitySelect(countryName) {
  drpdowncity.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.innerText = "---";
  drpdowncity.appendChild(placeholder);

  const entry = countriesData.find(c => c.country === countryName);
  if (!entry || !Array.isArray(entry.cities) || entry.cities.length === 0) {
    return;
  }
  entry.cities.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.innerText = city;
    drpdowncity.appendChild(opt);
  });
}

async function loadFlagForCountry(countryName) {
  if (!countryName) {
    imgflag.src = "";
    return;
  }
  try {
    const res = await fetch(RESTCOUNTRIES_BASE + encodeURIComponent(countryName));
    if (!res.ok) throw new Error("Flag API returned " + res.status);
    const json = await res.json();
    const flags = json[0] && json[0].flags;
    imgflag.src = (flags && (flags.png || flags.svg)) || "";
  } catch (err) {
    console.warn("Could not load flag for", countryName, err);
    imgflag.src = "";
  }
}

async function fetchAndShowWeather(countryName, cityName) {
  if (!WEATHER_API_KEY || WEATHER_API_KEY === "REPLACE_WITH_YOUR_KEY") {
    setStatus("Put your WeatherAPI key in script.js (WEATHER_API_KEY).");
    return;
  }
  if (!countryName || !cityName) {
    setStatus("Please select a country and city.");
    return;
  }

  setStatus(`Loading weather for ${cityName}, ${countryName}...`);
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(cityName + "," + countryName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API returned " + res.status);
    const data = await res.json();
    if (!data || !data.current) throw new Error("Malformed weather response");

    const c = data.current;
    // Map values to the eight .apidata slots in index.html
    // index.html: apidata1 (Feels Like), apidata2 (condition), apidata3 (wind speed),
    // apidata4 (pressure), apidata5 (wind direction), apidata6 (humidity),
    // apidata7 (clouds), apidata8 (uv)
    const mapping = [
      `${c.feelslike_c} °C`, // apidata1
      `${c.condition?.text || "N/A"}`, // apidata2
      `${c.wind_kph} kph`, // apidata3
      `${c.pressure_in} in`, // apidata4
      `${c.wind_dir || "N/A"}`, // apidata5
      `${c.humidity}%`, // apidata6
      `${c.cloud}%`, // apidata7
      `${c.uv !== undefined ? c.uv : "N/A"}` // apidata8
    ];

    for (let i = 0; i < mapping.length; i++) {
      const el = document.querySelector(`.apidata${i + 1}`);
      if (el) el.innerText = mapping[i];
    }
    setStatus(`Weather for ${cityName}, ${countryName}`);
  } catch (err) {
    console.error("Weather fetch failed:", err);
    setStatus("Failed to load weather. See console.");
  }
}

function attachEventHandlers() {
  drpdowncountry.addEventListener("change", async () => {
    const country = drpdowncountry.value;
    populateCitySelect(country);
    await loadFlagForCountry(country);
    setStatus("Select a city and click Get Whether");
  });

  getbtn.addEventListener("click", e => {
    e.preventDefault();
    const country = drpdowncountry.value;
    const city = drpdowncity.value;
    fetchAndShowWeather(country, city);
  });
}

async function init() {
  setStatus("Loading countries...");
  await fetchCountries();
  populateCountrySelect();
  attachEventHandlers();
  // If a default is set (India), populate cities and flag
  if (drpdowncountry.value) {
    populateCitySelect(drpdowncountry.value);
    await loadFlagForCountry(drpdowncountry.value);
    setStatus("Select a city and click Get Whether");
  } else {
    setStatus("Select a country");
  }
}

init();
