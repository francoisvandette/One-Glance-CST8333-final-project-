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
let widgets = [];
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



// Initial actions when the page loads
window.onload = function () {
  // gets any stored widgets from localStorage
  getLocalStorageWidgets();

  // loops through the returned array
  for(let i = 0; i < widgets.length; i++) {
    // loads the widget container for any stored weather widgets
    renderWeatherWidget(widgets[i]);
    // updates those weather wdigets
    updateWeatherWidget(widgets[i]);
  }

  // adds the ability to close the weather widgets
  scanClose();
}

// function saves the "widgets" array to localStorage as "widgets"
function saveWidgets() {
  localStorage.setItem("widgets", JSON.stringify(widgets));
}

// function gets any widgets from localStorage
function getLocalStorageWidgets() {
  widgets = JSON.parse(localStorage.getItem("widgets") || "[]");
}



/*
 *   Modal Functions
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

  // Functionality to close the modals via the X
close[0].onclick = function () {
  closeModals();
}
close[1].onclick = function () {
  closeModals();
}

// Function to allow Widgets to be closed and deleted
function scanClose() {
  document.querySelectorAll(".close-widget").forEach(item => {
    item.addEventListener('click', event => {
      // grabs the window.event so we can get the classList of element we clicked on
      let e = window.event;
      // the 3rd class is the unique ID of the widget
      let objNum = e.srcElement.classList[2];
      // gets the master div of the widget we are deleting
      let node = document.getElementsByClassName("master "+objNum);
      // removes the master div from the HTML
      node[0].parentNode.removeChild(node[0]);
      // get the "widget" array index of the widget we are deleting
      let delWidgetIndex = widgets.findIndex(o => o.id == objNum);
      // deletes the widget from the array
      widgets.splice(delWidgetIndex, 1);
      // saves the array to localStorage
      saveWidgets();
    })
  })
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
  // grabbing the searchbar value
  let loc = weatherSearchText.value;
  // creating the API link
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
      // grabbing the variables needed from the JSON
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
  // grab the selected city from the city selection form
  let cityCoords = document.querySelector(`input[name="citydata"]:checked`).value;
  // creating a link for the weather api
  let newWeatherLink = weatherLink + cityCoords;
  // creating a unique ID for this widget
  let id = Date.now().toString();
    
  //create a weather object to save it
  let obj = {
    id: id,
    link: newWeatherLink,
    type: "weather", 
    cityname: document.querySelector(`input[name="citydata"]:checked`).id,
    top: 50,
    left: 10
  }

  // store the object into the widgets array & save it
  widgets.push(obj);
  saveWidgets();

  // display this weather widget in the html
  renderWeatherWidget(obj);
  updateWeatherWidget(obj);

  // closing the modal
  closeModals();
}



/*
 * Weather Widget Functions 
 */

function renderWeatherWidget(obj) {
  // getting the destination div of the widget
  let tableau = document.querySelector("#widget-div");

  // creating the elements
  let master = document.createElement("div");
  let header = document.createElement("div");
  let closeBtn = document.createElement("span");
  let hcity = document.createElement("h3");
  let content = document.createElement("div");
  let ctemp = document.createElement("p");
  let cfeels_like = document.createElement("p");
  let ctemp_max = document.createElement("p");
  let ctemp_min = document.createElement("p");
  let cdesc = document.createElement("p");
  let cicon = document.createElement("img");

  // assigning classes to the elements
  master.classList.add("master", "weather", obj.id);
  header.classList.add("header", "weather", obj.id);
  closeBtn.classList.add("close-widget", "weather", obj.id);
  hcity.classList.add("cityname", "weather", obj.id);
  content.classList.add("content", "weather", obj.id);
  ctemp.classList.add("current-temp", "weather", obj.id);
  cfeels_like.classList.add("feels-temp", "weather", obj.id);
  ctemp_max.classList.add("max-temp", "weather", obj.id);
  ctemp_min.classList.add("min-temp", "weather", obj.id);
  cdesc.classList.add("description", "weather", obj.id);
  cicon.classList.add("icon", "weather", obj.id);

  // assigning an initial position
  master.style.top = obj.top + "px";
  master.style.left = obj.left + "px";

  // setting text content for the close button
  closeBtn.innerHTML = "&times;";

  // shoving everything into its proper parent
    // filling the header div
  header.appendChild(closeBtn);
  header.appendChild(hcity);
    // filling the content div
  content.appendChild(ctemp);
  content.appendChild(cfeels_like);
  content.appendChild(ctemp_max);
  content.appendChild(ctemp_min);
  content.appendChild(cdesc);
  content.appendChild(cicon);
    // placing the header & content divs into the master div
  master.appendChild(header);
  master.appendChild(content);
    // adding the master div into the widgets div already in index.html
  tableau.appendChild(master);

  // making the latest (this) master div a movable HTML element
  let mlist = document.querySelectorAll(".master");
  dragElement(mlist[mlist.length-1]);

  // giving the widget the ability to close
  scanClose();
}

function updateWeatherWidget(obj) {
  // fetch current weather information
  let weatherInfo;
  fetch(obj.link)
    .then((response) => response.json())
    .then((data) => weatherInfo = data)
    .then(() => wUpdate(weatherInfo, obj))
    ;

    // updating the proper weather widget fields
  function wUpdate(weatherInfo, obj) {
    // getting the desired information from the JSON
    let { description, icon } = weatherInfo.weather[0];
    let { temp, feels_like, temp_max, temp_min } = weatherInfo.main;

    // grabbing the appropriate HTML elements to set the text or img src
    document.getElementsByClassName("cityname " + obj.id)[0].innerHTML = obj.cityname;
    document.getElementsByClassName("current-temp " + obj.id)[0].innerHTML = "Current: " + temp + units[unitChoice].temp;
    document.getElementsByClassName("feels-temp " + obj.id)[0].innerHTML = "Feels Like: " + feels_like + units[unitChoice].temp;
    document.getElementsByClassName("max-temp " + obj.id)[0].innerHTML = "Max: " + temp_max + units[unitChoice].temp;
    document.getElementsByClassName("min-temp " + obj.id)[0].innerHTML = "Min: " + temp_min + units[unitChoice].temp;
    document.getElementsByClassName("description " + obj.id)[0].innerHTML = "Conditions: "+description.charAt(0).toUpperCase() + description.slice(1);
    document.getElementsByClassName("icon " + obj.id)[0].src = "https://openweathermap.org/img/wn/"+icon+"@2x.png";
  }
}



/*
 *  Moveable WIdgets functions
 */

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call elementDrag() whenever the cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

    // storing the widget location in the 'widget' array
      // grabs the 3rd class, which should be the widget's ID
    let objNum = e.srcElement.classList[2];
      // gets the index of the object in the widgets array
    let updateWidgetPosition = widgets.find(o => o.id == objNum);
      // updates the position values (top & left) into the widgets array
    updateWidgetPosition.top = elmnt.offsetTop - pos2;
    updateWidgetPosition.left = elmnt.offsetLeft - pos1;
      // saves the widgets array to localStorage
    saveWidgets();
  }

  function closeDragElement() {
    // stop moving when mouse button is released
    document.onmouseup = null;
    document.onmousemove = null;
  }
}