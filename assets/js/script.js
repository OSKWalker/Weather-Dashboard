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

/* Was using this to check for duplicate entries with varying degrees of success
let duplicateLocation = function checkForDuplicate(search, location) {
  return search.some(function (loc) {
    return location.toLowerCase() === loc.toLowerCase();
  });
};*/

function displaySavedLocations() {
  storedLocationButtons.forEach((element) => {
    let listItem = document.createElement("li");
    listItem.setAttribute("class", "btn btn-warning");
    listItem.innerHTML = element;
    searchHistoryEl.append(listItem);
  });
}

function createLocationButton(data) {
  let newLocation = {
    locationName: data.list[0].name + ", " + data.list[0].sys.country,
    temp: data.list[0].main.temp + "°F",
    wind: data.list[0].wind.speed + " mi/h",
    humidity: data.list[0].main.humidity + "%",
    lat: data.list[0].coord.lat,
    lon: data.list[0].coord.lon,
  };
  let listItem = document.createElement("li");
  let content = `<button data-location="${newLocation.locationName}" data-temp="${newLocation.temp}" data-wind="${newLocation.wind}" data-humidity="${newLocation.humidity}" data-latitude="${newLocation.lat}" data-longitude="${newLocation.lon}">${newLocation.locationName}</button>`;
  /*${
    location[0].toUpperCase() + location.substring(1)
  }*/
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
  locationNameEl.html(
    buttonClicked.getAttribute("data-location") +
      " " +
      moment().format("ddd, DD MMM YY, HH:mm:ss")
  );
  currentTempEl.html(buttonClicked.getAttribute("data-temp"));
  currentWindEl.html(buttonClicked.getAttribute("data-wind"));
  currentHumidityEl.html(buttonClicked.getAttribute("data-humidity"));
}

function setCurrentWeather(data) {
  locationNameEl.html(
    data.list[0].name +
      ", " +
      data.list[0].sys.country +
      " " +
      moment().format("ddd, DD MMM YY, HH:mm:ss")
  );
  currentTempEl.html(data.list[0].main.temp + "°F");
  currentWindEl.html(data.list[0].wind.speed + " mi/h");
  currentHumidityEl.html(data.list[0].main.humidity + "%");
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

function handleGoodFetch(data, location) {
  searchInputEl.val("");
  historyContainerEl.show();
  storeSearch(location);
  createLocationButton(data);
  setCurrentWeather(data);

  // fetch 5-day forecast
}

function getForecast(latitude, longitude) { 
    let searchURL = `${apiURL}data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=${appID}`;
    fetch(searchURL).then(function (response) {
      return response.json();
    }).then(function (data) {
        if (data.cod === "404" || data.count === 0) {
          window.alert("This is not a valid location");
          return;
        } else {
          handleGoodFetch(data, location.toLowerCase());
        }
      });
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
    historyContainerEl.hide();
  }
}

init();
