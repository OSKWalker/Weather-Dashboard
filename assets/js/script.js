// "/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=";
const apiURL = "https://api.openweathermap.org/";
const appID = "d33c2ae08fb898222095f60271a74087";
const searchHistoryEl = document.getElementById("searchHistory");
const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchButton");
const locationHistory = JSON.parse(localStorage.getItem("recentSearches"));
let locationSearch = [];
let recentSearches = [];

function displaySavedLocations() {
  recentSearches.forEach((element) => {
    let listItem = document.createElement("li");
    let content = `<button data-location="${element}">${element}</button>`;
    listItem.innerHTML = content;
    searchHistoryEl.appendChild(listItem);
  });
}

function createLocationButton(location) {
  let duplicateLocation = function checkForDuplicate(recentSearches, location) {
    return recentSearches.some(function (loc) {
      return location.toLowerCase() === loc.toLowerCase();
    });
  };

  console.log("duplicateLoc", duplicateLocation(recentSearches, location));
  if (!duplicateLocation(recentSearches, location)) {
    let listItem = document.createElement("li");
    let content = `<button data-location="${location}">${location}</button>`;
    let locationNameArray = content.innerHTML.split();
    console.log(locationNameArray);
    listItem.innerHTML = content;
    searchHistoryEl.appendChild(listItem);
  } else {
    console.log("working");
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
  console.log("locationSearch", locationSearch);
  recentSearches = [...new Set(locationSearch)];
  console.log("recentSearches", recentSearches);
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
        return;
      } else {
        handleGoodFetch(data, location);
      }
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
