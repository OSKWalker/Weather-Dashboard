// "/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=";
const apiURL = "https://api.openweathermap.org/";
const appID = "d33c2ae08fb898222095f60271a74087";
const searchHistoryEl = document.getElementById("searchHistory");
const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchButton");
const locationHistory = [];
let recentSearches = [];

function displaySavedLocations() {
  let locations = localStorage.getItem("recentSearches");
  if (locations == null) {
    return;
  } else {
    let parsedLocations = JSON.parse(locations);
    parsedLocations.forEach(function (item) {
      createLocationButton(item, parsedLocations);
    });
  }
}

function createLocationButton(location, parsedLocations) {
  let duplicateLocation = parsedLocations.some(function (loc) {
    return loc.toLowerCase() === location.toLowerCase();
  });
  let listItem = document.createElement("li");
  let content = `<button data-location="${location}">${location}</button>`;
  listItem.innerHTML = content;
  searchHistoryEl.appendChild(listItem);
  locationHistory.push(item.toLowerCase());
}

function updateContentPane(event) {
  event.preventDefault();
  const buttonClicked = event.target;
  let location = buttonClicked.getAttribute("data-location");
}

function setLocalstorage(location) {
  locationHistory.push(location.toLowerCase());
  console.log(locationHistory);
  recentSearches = [...new Set(locationHistory)];
  console.log(recentSearches);
  localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function handleGoodFetch(data, location) {
  setLocalstorage(location);
  createLocationButton(location);

  // update the main content area
  // fetch 5-day forecast
}

function getLocation(event) {
  event.preventDefault();
  let location = searchInputEl.value;
  let URL;
  if (location === "") {
    return;
  } else {
    URL = `${apiURL}data/2.5/find?q=${location}&appid=${appID}`;
  }
  console.log(URL);
  fetch(URL)
    .then(function (response) {
      if (!response.ok) {
        console.log(response.status);
      }
      return response.json();
    })
    .then(function (data) {
      if (data.count === 0) {
        window.alert("This is not a valid location!");
      }
      handleGoodFetch(data, location);
    }); /*
    .catch(function () {
      window.alert("Something went wrong!");
    });*/
}

function setEventListeners() {
  searchButtonEl.addEventListener("click", getLocation);
  searchHistoryEl.addEventListener("click", updateContentPane);
}

function init() {
  setEventListeners(); /*
  displaySavedLocations();*/
}

init();
