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
const unitChoice = "metric";
const weatherLink = "https://api.openweathermap.org/data/2.5/weather?units="+unitChoice+"&appid=1d957e1fec787ba103363bc5e34d7f19&";
const widgets = [];
const units = {
  metric: {
    temp: "°C",
    speed: "km/h"
  },
  imperial: {
    temp: "°F", 
    speed: "mph"
  }
}

window.onload = function () {
  if (typeof localStorage.getItem('widgets') == "undefined") {
    localStorage.setItem('widgets', widgets);
  }
  localStorage.getItem('widgets');
}

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
      // grabbing the variables needed
      let { name, state, country, lat, lon } = citydata[i];
      // creating the city name from the returned city, state, & country info
      let cityname = name + ", " + state + ", " + country;

      // radio button for the option
      let radiobox = document.createElement("input");
      radiobox.type = "radio";
      radiobox.id = cityname;
      radiobox.name = "citydata"
      radiobox.value = "lat=" + lat + "&lon=" + lon;

      // label for the radio button
      let label = document.createElement("label");
      label.htmlFor = cityname;
      label.innerHTML = cityname;

      // newline so it's visually a list
      let newline = document.createElement("br");

      // adding it to the form
      form.appendChild(radiobox);
      form.appendChild(label);
      form.appendChild(newline);
    }
  }
}

let weatherInfo;
createWeatherBtn.onclick = function () {
  //grab the selected city from the city selection form & creating a link for the weather api
  let cityCoords = document.querySelector(`input[name="citydata"]:checked`).value;
  let newWeatherLink = weatherLink + cityCoords;
  // creating a unique ID for this widget
  let id = Date.now().toString();
  
  // fetching the weather JSON
  // fetch(newWeatherLink)
  //   .then((response) => response.json())
  //   .then((data) => weatherInfo = data)
  //   .then(() => console.log(weatherInfo))
  //   ;
    
  //create a weather object
  let obj = {
    id: id,
    link: newWeatherLink,
    type: "weather", 
    cityname: document.querySelector(`input[name="citydata"]:checked`).id
  }

  // store the object into the widgets array & save it
  widgets.push(obj);
  localStorage.setItem("widgets", widgets);

  // display that weather object in the html
  renderWeatherWidget(obj);
  updateWeatherWidget(obj);
  closeModals();
}

function renderWeatherWidget(obj) {
  let tableau = document.querySelector("#widget-div");
  let master = document.createElement("div");
  let header = document.createElement("div");
  let hcity = document.createElement("h3");
  let content = document.createElement("div");
  let ctemp = document.createElement("p");
  let cfeels_like = document.createElement("p");
  let ctemp_max = document.createElement("p");
  let ctemp_min = document.createElement("p");
  let cdesc = document.createElement("p");
  let cicon = document.createElement("img");

  master.classList.add("master", obj.id);
  header.classList.add("header", obj.id);
  hcity.classList.add("cityname", obj.id);
  content.classList.add("content", obj.id);
  ctemp.classList.add("current-temp", obj.id);
  cfeels_like.classList.add("feels-temp", obj.id);
  ctemp_max.classList.add("max-temp", obj.id);
  ctemp_min.classList.add("min-temp", obj.id);
  cdesc.classList.add("description", obj.id);
  cicon.classList.add("icon", obj.id);

  header.appendChild(hcity);
  content.appendChild(ctemp);
  content.appendChild(cfeels_like);
  content.appendChild(ctemp_max);
  content.appendChild(ctemp_min);
  content.appendChild(cdesc);
  content.appendChild(cicon);
  master.appendChild(header);
  master.appendChild(content);
  tableau.appendChild(master);
}

function updateWeatherWidget(obj) {
  // fetch current weather information
  let weatherInfo;
  fetch(obj.link)
    .then((response) => response.json())
    .then((data) => weatherInfo = data)
    .then(() => wUpdate(weatherInfo, obj))
    ;

  function wUpdate(weatherInfo, obj) {
    let { name } = weatherInfo;
    let { description, icon } = weatherInfo.weather[0];
    let { temp, feels_like, temp_max, temp_min } = weatherInfo.main;

    document.getElementsByClassName("cityname " + obj.id)[0].innerHTML = obj.cityname;
    document.getElementsByClassName("current-temp " + obj.id)[0].innerHTML = "Current: " + temp + units[unitChoice].temp;
    document.getElementsByClassName("feels-temp " + obj.id)[0].innerHTML = "Feels Like: " + feels_like + units[unitChoice].temp;
    document.getElementsByClassName("max-temp " + obj.id)[0].innerHTML = "Max: " + temp_max + units[unitChoice].temp;
    document.getElementsByClassName("min-temp " + obj.id)[0].innerHTML = "Min: " + temp_min + units[unitChoice].temp;
    document.getElementsByClassName("description " + obj.id)[0].innerHTML = "Conditions: "+description.charAt(0).toUpperCase() + description.slice(1);
    document.getElementsByClassName("icon " + obj.id)[0].src = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
  }
  


}