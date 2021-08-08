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
const locationHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
locationHistory.splice(10);
let recentSearches = [...new Set(locationHistory)];
const storedLocationButtons =
  JSON.parse(localStorage.getItem("locationButtons")) || [];
storedLocationButtons.splice(10);
let recentButtons = [...new Set(storedLocationButtons)];

let duplicateLocation = function checkForDuplicate(search, location) {
  return search.some(function (loc) {
    return location.toLowerCase() === loc.toLowerCase();
  });
};

function displaySavedLocations() {
  storedLocationButtons.forEach((element) => {
    let listItem = document.createElement("li");
    listItem.setAttribute("class", "btn btn-warning");
    listItem.innerHTML = element;
    searchHistoryEl.append(listItem);
  });
}

function createLocationButton(location) {
  let listItem = document.createElement("li");
  let content = `<button data-location="${location}">${
    location[0].toUpperCase() + location.substring(1)
  }</button>`;
  listItem.setAttribute("class", "btn btn-success");
  listItem.innerHTML = content;
  if (!recentButtons.includes(content)) {
    searchHistoryEl.append(listItem);
    storeLocationButton(content);
  }
}

function updateContentPane(event) {
  event.preventDefault();
  const buttonClicked = event.target;
  let location = buttonClicked.getAttribute("data-location");
}

function storeLocationButton(newButton) {
  storedLocationButtons.push(newButton);
  recentButtons = [...new Set(storedLocationButtons)];
  localStorage.setItem("locationButtons", JSON.stringify(recentButtons));
  recentButtons = JSON.parse(localStorage.getItem("locationButtons"));
  recentButtons = [...new Set(recentButtons)];
  console.log("rb", recentButtons);
}

function storeSearch(location) {
  locationHistory.push(location);
  locationHistory.splice(10);
  recentSearches = [...new Set(locationHistory)];
  localStorage.setItem("searchHistory", JSON.stringify(recentSearches));
  recentSearches = JSON.parse(localStorage.getItem("searchHistory"));
  recentSearches = [...new Set(recentSearches)];
  console.log("rs", recentSearches);
}

function createLocationObject(data) {
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
  localStorage.setItem("locationObject", recentObjects);
}

function handleGoodFetch(data, location) {
  historyContainerEl.show();
  storeSearch(location);
  createLocationButton(location);
  /*
  createLocationObject(data);*/

  // fetch 5-day forecast
}

function getLocation(event) {
  event.preventDefault();
  let location = searchInputEl.val();
  let searchURL;
  if (!location) {
    window.alert("Please enter a location");
    return;
  } else {
    searchURL = `${apiURL}data/2.5/find?q=${location}&units=imperial&exclude=minutely,hourly,daily,alerts&appid=${appID}`;
  }

  fetch(searchURL)
    .then(function (response) {
      if (!response.ok) {
        window.alert("No Location Found!");
        return;
      } else {
        return response.json();
      }
    })
    .then(function (data) {
      if (data.cod === "404" || data.count === 0) {
        window.alert("This is not a valid location");
        return;
      } else {
        handleGoodFetch(data, location);
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
    historyContainerEl.hide();
  }
}

init();
