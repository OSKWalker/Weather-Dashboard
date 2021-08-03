let apiURL =
  "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=d33c2ae08fb898222095f60271a74087";

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
  window.alert(location);
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
