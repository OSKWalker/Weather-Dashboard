// "/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=";
const apiURL = "https://api.openweathermap.org/";
const appID = "d33c2ae08fb898222095f60271a74087";
const searchHistoryEl = document.getElementById("searchHistory");
const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchButton");
const clearButtonEl = document.getElementById("clearButton");
const locationHistory = JSON.parse(localStorage.getItem("recentSearches"));
let locationSearch = [];
let recentSearches = [];

function displaySavedLocations() {
  locationHistory.forEach((element) => {
    createLocationButton(element);
  });
}

function createLocationButton(location) {
  let duplicateLocation = function checkForDuplicate(recentSearches, location) {
    return recentSearches.some(function (loc) {
      return location.toLowerCase() === loc.toLowerCase();
    });
  };
  if (!duplicateLocation(recentSearches, location)) {
    let listItem = document.createElement("li");
    let content = `<button data-location="${location}">${
      location[0].toUpperCase() + location.substring(1)
    }</button>`;
    listItem.innerHTML = content;
    searchHistoryEl.appendChild(listItem);
  } else {
    return;
  }
}

function updateContentPane(event) {
  event.preventDefault();
  const buttonClicked = event.target;
  let location = buttonClicked.getAttribute("data-location");
}

function setLocalstorage(location) {
  locationSearch.push(location.toLowerCase());
  recentSearches = [...new Set(locationSearch)];
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function handleGoodFetch(data, location) {
  createLocationButton(location);
  setLocalstorage(location);

  // update the main content area
  // fetch 5-day forecast
}

function getLocation(event) {
  event.preventDefault();
  let location = searchInputEl.value.toLowerCase();
  let searchURL;
  if (location === "") {
    return;
  } else {
    searchURL = `${apiURL}data/2.5/find?q=${location}&appid=${appID}`;
  }
  fetch(searchURL)
    .then(function (response) {
      if (!response.ok) {
        console.log(response.status);
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
    }); /*
    .catch(function () {
      window.alert("Something went wrong!");
    });*/
}

function clearLocations() {
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
