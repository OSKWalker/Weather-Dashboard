let apiURL =
  "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=d33c2ae08fb898222095f60271a74087";

const searchHistoryEl = document.getElementById("searchHistory");

function displaySavedLocations() {
  let locations = localStorage.getItem("recentSearches");
  if (locations) {
    let parsedLocations = JSON.parse(locations);
    parsedLocations.forEach(function (item) {
      let listItem = document.createElement("li");
      let content = `<button data-location="${item}">${item}</button>`;
      listItem.innerHTML = content;
      searchHistoryEl.appendChild(listItem);
    });
  }
}

function init() {
  displaySavedLocations();
}

init();
