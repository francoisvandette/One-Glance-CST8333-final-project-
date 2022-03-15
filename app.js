// Modal Variables
var weatherModal = document.getElementById("weather-modal");
var rssModal = document.getElementById("rss-modal");
var weatherBtn = document.getElementById("createWeatherBtn");
var rssBtn = document.getElementById("createRSSBtn");
var close = document.getElementsByClassName("close");
var weatherSearchText = document.getElementById("weather-search-text");
var weatherSearchSubmit = document.getElementById("weather-search-submit");
const geolocationLink = "https://api.openweathermap.org/geo/1.0/direct?limit=5&appid=1d957e1fec787ba103363bc5e34d7f19&q=";
var citydata;
var form = document.getElementById("citylist-form");
var createWeatherBtn = document.querySelector("#add-weather-widget");
const weatherLink = "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=1d957e1fec787ba103363bc5e34d7f19&";


/*
* Modal Functions
*/
// Display Create Weather Modal
weatherBtn.onclick = function () {
  weatherModal.style.display = "block";
}

// Display Create RSS Modal
rssBtn.onclick = function () {
  rssModal.style.display = "block";
}

// Close Modals
function closeModals() {
  weatherModal.style.display = "none";
  rssModal.style.display = "none";
}

  // When the user clicks on <span> (x), close the modal
close[0].onclick = function () {
  closeModals();
}
close[1].onclick = function () {
  closeModals();
}

  // When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == weatherModal || event.target == rssModal) {
    closeModals();
  }
}


// Location Search executes
  // hitting enter
document.querySelector("#weather-search-text").addEventListener("keyup", function (event) {
  if (event.key == "Enter") {
    locationSearch();
  }
});

  // clicking select button
weatherSearchSubmit.onclick = function() {
  locationSearch();
}

function locationSearch() {
  let loc = weatherSearchText.value;
  let templink = geolocationLink + loc;

  // delete existing contents of form
  while (form.firstChild) {
    form.removeChild(form.lastChild);
  }

  // get JSON object with location information
  fetch(templink)
    .then((response) => response.json())
    .then((data) => citydata = data)
    .then(() => addFormItems(citydata));

  // add options to a form (does this in the fetch)
  function addFormItems(citydata) {

    for (let i in citydata) {
      let { name, state, country, lat, lon } = citydata[i];
      console.log(citydata[i]);
      let cityname = name + ", " + state + ", " + country;

      let radiobox = document.createElement("input");
      radiobox.type = "radio";
      radiobox.id = cityname;
      radiobox.name = "citydata"
      radiobox.value = "lat=" + lat + "&lon=" + lon;

      let label = document.createElement("label");
      label.htmlFor = cityname;
      label.innerHTML = cityname;

      let newline = document.createElement("br");

      form.appendChild(radiobox);
      form.appendChild(label);
      form.appendChild(newline);
    }
  }
}

createWeatherBtn.onclick = function () {
  //grab the value of citydata from the form (the selected city)
  let cityCoords = document.querySelector(`input[name="citydata"]:checked`).value;
  console.log(cityCoords);
  let newWeatherLink = weatherLink + cityCoords;
  console.log(newWeatherLink);


  //create a weather object
    // store the api link in that object
  // display that weather object in the html
}