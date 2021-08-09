// "/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=";
const apiURL = "https://api.openweathermap.org/";
const appID = "d33c2ae08fb898222095f60271a74087";
const searchHistoryEl = $("#searchHistory");
const searchInputEl = $("#searchInput");
const searchButtonEl = $("#searchButton");
const clearButtonEl = $("#clearButton");
const locationNameEl = $("#locationName");
const currentDayEl = $("#currentDay");
const currentTempEl = $("#currentTemp");
const currentWindEl = $("#currentWindSpeed");
const currentHumidityEl = $("#currentHumidity");
const uvIndexEl = $("#uvIndex");
const historyContainerEl = $("#historyContainer");
const forecastEl = $("#forecast");
const forecastCardsEl = $("#forecastCards");
const locationHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
locationHistory.splice(10);
let recentSearches = [...new Set(locationHistory)];
const storedLocationButtons =
  JSON.parse(localStorage.getItem("locationButtons")) || [];
storedLocationButtons.splice(10);
let recentButtons = [...new Set(storedLocationButtons)];

/* Was using this to check for duplicate entries with varying degrees of success
let duplicateLocation = function checkForDuplicate(search, location) {
  return search.some(function (loc) {
    return location.toLowerCase() === loc.toLowerCase();
  });
};*/

function displaySavedLocations() {
  currentDayEl.show();
  forecastEl.show();
  storedLocationButtons.forEach((element) => {
    let listItem = document.createElement("li");
    listItem.setAttribute("class", "btn btn-info");
    listItem.innerHTML = element;
    searchHistoryEl.append(listItem);
  });
}

function createLocationButton(data) {
  let newLocation = {
    locationName: `${data.list[0].name}, ${data.list[0].sys.country}`,
    icon: `${data.list[0].weather[0].icon}`,
    description: `${data.list[0].weather[0].description}`,
    temp: `${data.list[0].main.temp} °F`,
    wind: `${data.list[0].wind.speed} mi/h`,
    humidity: `${data.list[0].main.humidity}%`,
    lat: `${data.list[0].coord.lat}`,
    lon: `${data.list[0].coord.lon}`,
  };
  let listItem = document.createElement("li");
  let content = `<button data-location="${newLocation.locationName}" data-icon="${newLocation.icon}" data-description="${newLocation.description}" data-temp="${newLocation.temp}" data-wind="${newLocation.wind}" data-humidity="${newLocation.humidity}" data-latitude="${newLocation.lat}" data-longitude="${newLocation.lon}">${newLocation.locationName}</button>`;
  /*${
    location[0].toUpperCase() + location.substring(1)
  }*/
  listItem.setAttribute("class", "btn btn-primary locationButton");
  listItem.innerHTML = content;

  if (!recentButtons.includes(content)) {
    searchHistoryEl.append(listItem);
    storeLocationButton(content);
  }
}

function updateContentPane(event) {
  event.preventDefault();
  const buttonClicked = event.target;
  if (buttonClicked.matches("button")) {
    locationNameEl.html(`${buttonClicked.getAttribute(
      "data-location"
    )} ${moment().format(
      "ddd, DD MMM YY, HH:mm:ss"
    )} <img src="${apiURL}img/w/${buttonClicked.getAttribute(
      "data-icon"
    )}.png" alt="${buttonClicked.getAttribute(
      "data-description"
    )}" class="weather-img"/>
  `);
    currentTempEl.html(buttonClicked.getAttribute("data-temp"));
    currentWindEl.html(buttonClicked.getAttribute("data-wind"));
    currentHumidityEl.html(buttonClicked.getAttribute("data-humidity"));
    getForecast(
      buttonClicked.getAttribute("data-latitude"),
      buttonClicked.getAttribute("data-longitude")
    );
  }
}

function setCurrentWeather(data) {
  locationNameEl.html(
    `${data.list[0].name}, ${data.list[0].sys.country} ${moment().format(
      "ddd, DD MMM YY, HH:mm:ss"
    )}  <img src="${apiURL}img/w/${data.list[0].weather[0].icon}.png" alt="${
      data.list[0].weather[0].description
    }" class="weather-img"/>`
  );
  currentTempEl.html(`${data.list[0].main.temp} °F`);
  currentWindEl.html(`${data.list[0].wind.speed} mi/h`);
  currentHumidityEl.html(`${data.list[0].main.humidity}%`);
}

function storeLocationButton(newButton) {
  storedLocationButtons.push(newButton);
  recentButtons = [...new Set(storedLocationButtons)];
  localStorage.setItem("locationButtons", JSON.stringify(recentButtons));
  recentButtons = JSON.parse(localStorage.getItem("locationButtons"));
  recentButtons = [...new Set(recentButtons)];
}

function storeSearch(location) {
  locationHistory.push(location);
  locationHistory.splice(10);
  recentSearches = [...new Set(locationHistory)];
  localStorage.setItem("searchHistory", JSON.stringify(recentSearches));
  recentSearches = JSON.parse(localStorage.getItem("searchHistory"));
  recentSearches = [...new Set(recentSearches)];
}

function handleGoodFetch(data, location) {
  searchInputEl.val("");
  historyContainerEl.show();
  currentDayEl.show();
  forecastEl.show();
  storeSearch(location);
  createLocationButton(data);
  setCurrentWeather(data);
  getForecast(data.list[0].coord.lat, data.list[0].coord.lon);
}

function displayForecast(forecast) {
  if (forecastCardsEl.children()) {
    forecastCardsEl.children().remove();
  }
  forecast.forEach((element) => {
    let forecastCard = `<div class="col-md forecastCard">
              <div class="h-100 text-light">
                <h3>${element.name} <img class="weather-img" src="${apiURL}img/w/${element.icon}.png" alt="${element.description}"/></h3>
                <h5>${element.date}<h5>
                <dl>
                  <dt>Temp:</dt>
                  <dd>${element.temp} °F</dd>
                  <dt>Wind:</dt>
                  <dd>${element.wind} mi/h</dd>
                  <dt>Humidity:</dt>
                  <dd>${element.humidity}%</dd>
                </dl>
              </div>
            </div>`;
    forecastCardsEl.append(forecastCard);
  });
}

function setForecastDays(data) {
  let forecastSet = [];
  for (let i = 1; i < 6; i++) {
    let day = {};
    day.name = moment.unix(data.daily[i].dt).format("dddd");
    day.date = moment.unix(data.daily[i].dt).format("DD MMM YY");
    day.icon = data.daily[i].weather[0].icon;
    day.description = data.daily[i].weather[0].description;
    day.temp = data.daily[i].temp.max;
    day.wind = data.daily[i].wind_speed;
    day.humidity = data.daily[i].humidity;
    forecastSet.push(day);
  }
  displayForecast(forecastSet);
}

function getForecast(latitude, longitude) {
  let searchURL = `${apiURL}data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=${appID}`;
  fetch(searchURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      uvIndexEl.html(
        `<span id="${setIndexColor(data.current.uvi)}">${
          data.current.uvi
        }</span>`
      );
      setForecastDays(data);
    });
}

function setIndexColor(index) {
  let solar = {
    low: [0, 1, 2],
    mod: [3, 4, 5],
    high: [6, 7],
    veryhigh: [8, 9, 10],
  };
  let test = Math.floor(index);
  let indexCondition;
  for (const [condition, values] of Object.entries(solar)) {
    for (let i = 0; i < values.length; i++) {
      if (values[i] === test) {
        indexCondition = condition;
      }
    }
  }
  if (test < 11) {
    return indexCondition;
  } else {
    return "extreme";
  }
}

function getLocation(event) {
  event.preventDefault();
  let location = searchInputEl.val();
  let searchURL;
  if (!location) {
    window.alert("Please enter a location");
    return;
  } else {
    searchURL = `${apiURL}data/2.5/find?q=${location}&units=imperial&appid=${appID}`;
  }

  fetch(searchURL)
    .then(function (response) {
      if (!response.ok) {
        return;
      }
      return response.json();
    })
    .then(function (data) {
      if (!data || data.count === 0) {
        window.alert("Location not found!");
        return;
      } else {
        currentDayEl.show();
        handleGoodFetch(data, location.toLowerCase());
      }
    });
}

function setEventListeners() {
  searchButtonEl.on("click", getLocation);
  clearButtonEl.on("click", clearLocations);
  searchHistoryEl.on("click", updateContentPane);
}

function clearLocations() {
  recentSearches = [];
  localStorage.clear();
}

function init() {
  setEventListeners();
  if (locationHistory.length > 0) {
    displaySavedLocations();
  } else {
    historyContainerEl.toggle();
    currentDayEl.toggle();
    forecastEl.toggle();
  }
}

init();
