// "/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=";
const apiURL = "https://api.openweathermap.org/";
const appID = "d33c2ae08fb898222095f60271a74087";
const searchHistoryEl = document.getElementById("searchHistory");
const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchButton");
const clearButtonEl = document.getElementById("clearButton");
const locationNameEl = document.getElementById("locationName");
const currentDayEl = document.getElementById("currentDay");
const currentTempEl = document.getElementById("currentTemp");
const currentWindEl = document.getElementById("currentWindSpeed");
const currentHumidityEl = document.getElementById("currentHumidity");
const uvIndexEl = document.getElementById("uvIndex");
const locationHistory = JSON.parse(localStorage.getItem("recentSearches"));
const storedLocationButtons = JSON.parse(
  localStorage.getItem("locationButtons")
);

function displaySavedLocations() {
  if (locationHistory !== null) {
    locationHistory.forEach((element) => {
      console.log(storedLocationButtons);
    });
  }
}

function createLocationButton(location) {
  if (locationHistory !== null && !locationHistory.includes(location)) {
    let duplicateLocation = function checkForDuplicate(searches, location) {
      return searches.some(function (loc) {
        return location.toLowerCase() === loc.toLowerCase();
      });
    };

    if (!duplicateLocation(locationHistory, location)) {
      let listItem = document.createElement("li");
      let content = `<button data-location="${location}">${
        location[0].toUpperCase() + location.substring(1)
      }</button>`;
      listItem.innerHTML = content;
      searchHistoryEl.appendChild(listItem);
      storeLocationButton(content);
    }
  }
}

function updateContentPane(event) {
  event.preventDefault();
  const buttonClicked = event.target;
  let location = buttonClicked.getAttribute("data-location");
}

function storeLocationButton(newButton) {
  let locationButtons = [];
  let recentButtons = [];
  locationButtons.push(newButton);
  recentButtons = [...new Set(locationButtons)];
  localStorage.setItem("locationButtons", JSON.stringify(recentButtons));
}

function storeSearch(location) {
  let locationSearch = [];
  let recentSearches = [];
  locationSearch.push(location.toLowerCase());
  recentSearches = [...new Set(locationSearch)];
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function createLocationObject(data) {
  let locationObjects = [];
  let recentObjects = [];
  let newLocation = {
    locationName: data.list[0].name + ", " + data.list[0].sys.country,
    currentTemp: data.list[0].main.temp + "°F",
    wind: data.list[0].wind.speed + " mi/h",
    humidity: data.list[0].main.humidity + "%",
    lat: data.list[0].coord.lat,
    lon: data.list[0].coord.lon,
  };
  locationObjects.push(JSON.stringify(newLocation));
  recentObjects = [...new Set(locationObjects)];
  localStorage.setItem("locationObjects", recentObjects);
}

function handleGoodFetch(data, location) {
  storeSearch(location);
  createLocationButton(location);
  createLocationObject(data);

  // fetch 5-day forecast
}

function getLocation(event) {
  event.preventDefault();
  let location = searchInputEl.value.toLowerCase();
  let searchURL;
  if (location === "") {
    return;
  } else {
    searchURL = `${apiURL}data/2.5/find?q=${location}&units=imperial&exclude=minutely,hourly,daily,alerts&appid=${appID}`;
  }
  fetch(searchURL)
    .then(function (response) {
      if (!response.ok) {
        window.alert("No Location Found!");
        return;
      }
      return response.json();
    })
    .then(function (data) {
      if (data.count === 0) {
        window.alert("This is not a valid location!");
        return;
      } else {
        handleGoodFetch(data, location);
      }
    });
}

function clearLocations() {
  recentSearches = [];
  localStorage.clear();
}
function setEventListeners() {
  searchButtonEl.addEventListener("click", getLocation);
  clearButtonEl.addEventListener("click", clearLocations);
  searchHistoryEl.addEventListener("click", updateContentPane);
}

function init() {
  setEventListeners();
  if (locationHistory !== null) {
    displaySavedLocations();
  }
}

init();
