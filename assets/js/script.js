// "/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=";
const apiURL = "https://api.openweathermap.org/";
const appID = "d33c2ae08fb898222095f60271a74087";
const searchHistoryEl = document.getElementById("searchHistory");
const searchInputEl = document.getElementById("searchInput");
const searchButtonEl = document.getElementById("searchButton");

function displaySavedLocations() {
  let locations = localStorage.getItem("recentSearches");
  if (locations == null) {
    return;
  } else {
    let parsedLocations = JSON.parse(locations);
    parsedLocations.forEach(function (item) {
      let listItem = document.createElement("li");
      let content = `<button data-location="${item}">${item}</button>`;
      listItem.innerHTML = content;
      searchHistoryEl.appendChild(listItem);
    });
  }
}

function updateContentPane(event) {
  event.preventDefault();
  const buttonClicked = event.target;
  let location = buttonClicked.getAttribute("data-location");
}
function getLocation(event) {
  event.preventDefault();
  let location = searchInputEl.nodeValue;
  let URL = `${apiURL}/data/2.5/find?q=${location}&appid=${appID}`;
  fetch(URL)
    .then(function (response) {
      if (!response.ok) {
        console.log(response.status);
      }

      response.json();
    })
    .then(function (data) {
      console.log("data", data);
      if (data.count === 0) {
        window.alert("This is not a valid location!");
      }
    })
    .catch(function () {
      window.alert("Something went wrong!");
    });
}

function setEventListeners() {
  searchHistoryEl.addEventListener("click", updateContentPane());
  searchButtonEl.addEventListener("click", getLocation());
}

function init() {
  setEventListeners();
  displaySavedLocations();
}

init();
