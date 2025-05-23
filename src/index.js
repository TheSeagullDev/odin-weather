import "./styles.css";

const API_KEY = "FEUAVECMM644PJQBXV85NQDJU";
const form = document.querySelector("form");
const tempElement = document.querySelector(".temp");
const locationElement = document.querySelector(".location");
const descriptionElement = document.querySelector(".description");
const icon = document.querySelector(".icon img");
const degreeBtn = document.querySelector("#units");
let metric = false;
let location = "";

async function getWeatherData(location, metric) {
  let result;
  if (!metric) {
    result = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=${API_KEY}`,
      { mode: "cors" },
    );
  } else {
    result = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}`,
      { mode: "cors" },
    );
  }
  const data = await result.json();
  return data;
}

function updateDisplay(data) {
  const forecast = data.currentConditions;
  tempElement.textContent = metric
    ? `${forecast.temp} °C`
    : `${forecast.temp} °F`;
  locationElement.textContent = data.resolvedAddress;
  descriptionElement.textContent = data.description;
  const iconName = forecast.icon;
  const iconImg = import(`./assets/${iconName}.png`);
  iconImg.then((result) => (icon.src = result.default));
  icon.alt = iconName;
  console.log(data);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  location = form.loc.value;
  form.reset();
  const data = getWeatherData(location, metric);
  data.then((result) => updateDisplay(result));
});

degreeBtn.addEventListener("click", () => {
  metric = !metric;
  if (metric) {
    degreeBtn.value = "Switch to °F";
  } else {
    degreeBtn.value = "Switch to °C";
  }
  if (location) {
    const data = getWeatherData(location, metric);
    data.then((result) => updateDisplay(result));
  }
});
