const countriesApi = "https://countriesnow.space/api/v0.1/countries";
const countriesFlagApi = "https://countriesnow.space/api/v0.1/countries/flag/images";
const weatherApiKey = "03913c19b8384a86afc22937241609";

const flagImage = document.querySelector(".Flag");
const countrySelect = document.querySelector(".select-opt-country");
const citySelect = document.querySelector(".select-opt-city");
const getButton = document.querySelector(".get-whether-btn button");
const dataBoxes = Array.from(document.querySelectorAll(".disdata"));

let countries = [];
let flagByCountry = new Map();

function setSelectMessage(select, message) {
  select.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = message;
  option.disabled = true;
  option.selected = true;
  select.append(option);
}

function setWeatherMessage(message) {
  dataBoxes.forEach((box, index) => {
    box.textContent = index === 0 ? message : "";
  });
}

function updateWeatherBoxes(weather) {
  const values = [
    `${weather.current.temp_c} C`,
    weather.current.condition.text,
    `${weather.current.wind_kph} kph`,
    `${weather.current.pressure_in} in`,
    weather.current.wind_dir,
    `${weather.current.humidity}%`,
    `${weather.current.cloud}%`,
    weather.current.uv,
  ];

  dataBoxes.forEach((box, index) => {
    box.textContent = values[index] ?? "";
  });
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || data.msg || "The API returned an error.");
  }

  return data;
}

function populateCountries() {
  countrySelect.innerHTML = "";

  countries.forEach(({ country }) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.append(option);
  });

  const defaultCountry = countries.some(({ country }) => country === "India")
    ? "India"
    : countries[0]?.country;

  if (defaultCountry) {
    countrySelect.value = defaultCountry;
    populateCities(defaultCountry);
    updateFlag(defaultCountry);
  }
}

function populateCities(countryName) {
  const country = countries.find((item) => item.country === countryName);
  const cities = country?.cities || [];

  citySelect.innerHTML = "";

  if (!cities.length) {
    setSelectMessage(citySelect, "No cities found");
    return;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select city";
  placeholder.disabled = true;
  placeholder.selected = true;
  citySelect.append(placeholder);

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.append(option);
  });
}

function updateFlag(countryName) {
  const flagUrl = flagByCountry.get(countryName);
  flagImage.src = flagUrl || "";
  flagImage.alt = flagUrl ? `${countryName} flag` : "";
}

async function loadCountries() {
  setSelectMessage(countrySelect, "Loading...");
  setSelectMessage(citySelect, "Loading...");
  setWeatherMessage("Choose a city");

  try {
    const [countryData, flagData] = await Promise.all([
      fetchJson(countriesApi),
      fetchJson(countriesFlagApi),
    ]);

    countries = countryData.data || [];
    flagByCountry = new Map(
      (flagData.data || []).map(({ name, flag }) => [name, flag])
    );

    populateCountries();
  } catch (error) {
    console.error(error);
    setSelectMessage(countrySelect, "Countries unavailable");
    setSelectMessage(citySelect, "Cities unavailable");
    setWeatherMessage("Unable to load countries");
  }
}

async function loadWeather(event) {
  event.preventDefault();

  const countryName = countrySelect.value;
  const cityName = citySelect.value;

  if (!countryName || !cityName) {
    setWeatherMessage("Select a city first");
    return;
  }

  setWeatherMessage("Loading weather...");
  getButton.disabled = true;

  try {
    const query = encodeURIComponent(`${cityName},${countryName}`);
    const weather = await fetchJson(
      `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${query}`
      // https://api.weatherapi.com/v1/current.json?key=${03913c19b8384a86afc22937241609}`
    );

    updateWeatherBoxes(weather);
  } catch (error) {
    console.error(error);
    setWeatherMessage("Weather unavailable");
  } finally {
    getButton.disabled = false;
  }
}

countrySelect.addEventListener("change", () => {
  const countryName = countrySelect.value;
  populateCities(countryName);
  updateFlag(countryName);
  setWeatherMessage("Choose a city");
});

citySelect.addEventListener("change", () => {
  setWeatherMessage("Ready");
});

getButton.addEventListener("click", loadWeather);

loadCountries();
