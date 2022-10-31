// variables for weather info categories 

var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentCityDate = document.getElementById("cityDate");
var currentHumidity = document.getElementById("humidity");
// set current date, variable elements and arrays for 5 days out

var currentDay = moment().format("MM/DD/YYYY");

var day1 = document.getElementById("day1");
var day2 = document.getElementById("day2");
var day3 = document.getElementById("day3");
var day4 = document.getElementById("day4");
var day5 = document.getElementById("day5");
var days = [day1, day2, day3, day4, day5];

var day1Temp = document.getElementById("day1Temp");
var day2Temp = document.getElementById("day2Temp");
var day3Temp = document.getElementById("day3Temp");
var day4Temp = document.getElementById("day4Temp");
var day5Temp = document.getElementById("day5Temp");
var daysTemp = [day1Temp, day2Temp, day3Temp, day4Temp, day5Temp];

var day1Wind = document.getElementById("day1Wind");
var day2Wind = document.getElementById("day2Wind");
var day3Wind = document.getElementById("day3Wind");
var day4Wind = document.getElementById("day4Wind");
var day5Wind = document.getElementById("day5Wind");
var daysWind = [day1Wind, day2Wind, day3Wind, day4Wind, day5Wind];

var day1Hum = document.getElementById("day1Hum");
var day2Hum = document.getElementById("day2Hum");
var day3Hum = document.getElementById("day3Hum");
var day4Hum = document.getElementById("day4Hum");
var day5Hum = document.getElementById("day5Hum");
var daysHum = [day1Hum, day2Hum, day3Hum, day4Hum, day5Hum];

var day1Icon = document.getElementById("day1Icon");
var day2Icon = document.getElementById("day2Icon");
var day3Icon = document.getElementById("day3Icon");
var day4Icon = document.getElementById("day4Icon");
var day5Icon = document.getElementById("day5Icon");
var daysIcon = [day1Icon, day2Icon, day3Icon, day4Icon, day5Icon];

// var for API Key for OpenWeatherMap

var APIKey = "a17b8a507cc6dfa84ceb02767483d8f5";

// need to input city
var userInput = document.getElementById("input");
var searchButton = document.getElementById("searchBtn");

// to hide the window info before clicking search button
var right = document.getElementById("right");
right.style.display = "none";


// fetch functions

// Make the Geocoding API Call Using Fetch to get city lat and lon

function getCity(cityName) {
    //var requestUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=a17b8a507cc6dfa84ceb02767483d8f5"
    //" + APIKey;
    var requestUrl =
        "https://api.openweathermap.org/data/2.5/weather?q=" + /*<-- review this */
       cityName +
        "&limit=1&appid=a17b8a507cc6dfa84ceb02767483d8f5&units=imperial" //+ /*<-- review this */
     //   APIKey; 

    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var cityLat = data.coord.lat; /*<-- review this */
            var cityLon = data.coord.lon; /*<-- review this */
            currentCityDate.textContent = cityName + " (" + currentDay + ")";
            currentTemp.textContent = data.main.temp + "°F";
            currentWind.textContent = data.wind.speed + " mph";
            currentHumidity.textContent = data.main.humidity + " %";
            var icon = document.getElementById("icon");
            icon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");

            getWeather(cityName, cityLat, cityLon);
           // console.log(response);
        });
}



//  fetch to make the oneCall API Call to get weather info
function getWeather(cityName, cityLat, cityLon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + APIKey;

    // to print the inputCity as upper case
    var printInputCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // to show weather in the main weather box


var index = 0;
            // to show weather in  the forecastBlock array [1] for the tomorrow ... [5] for 5 days later
            for (var i = 7; i < 40; i+=7) {
                days[index].textContent = moment.unix(data.list[i].dt).format("MM/DD/YYYY") 
                console.log(index);
              daysTemp[index].textContent = "Temp: " + data.list[i].temp.day + "°F";
                daysWind[index].textContent = "Wind: " + data.list[i].wind_speed + " MPH";
                daysHum[index].textContent = "Humidity: " + data.list[i].humidity + " %";
                var addDaysIcon = daysIcon[i - 1].setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");  
                index ++
            }

        });
}
/*searchButton.click(function () {

    let searchInput = $(".searchInput").val();

    // Variable for current weather working 
    let urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    // Variable for 5 day forecast working
    let urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";


    if (searchInput == "") {
        console.log(searchInput);
    } else {
        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            console.log("done");
    });
  }
});  this code was recommended by an LA, disregard */

//   for local storage 
var cityHistory = [];

searchButton.addEventListener("click", function (event) {

    event.preventDefault();

    // show the weather after clicking search button
    right.style.display = "block";

    // get input city from search form
    var inputCity = userInput.value.trim();

    // return function if inputCity is blank
    if (inputCity === "") {
        alert("Enter a city.");
        return;
    }

    // add to cityHistory array and clear the input
    cityHistory.push(inputCity);
    userInput.value = "";

    // store value- stringify and set key in localStorage to cityHistory array
    localStorage.setItem("city", JSON.stringify(cityHistory));

    getCity(inputCity);
    renderCityHistory();

});

var cityList = document.querySelector("#historyCities");
function renderCityHistory() {

    cityList.innerHTML = "";

    // make a new line item for each button
    for (var i = cityHistory.length - 1; i >= 0; i--) {
        var searchedCity = cityHistory[i];

        // to print the searchedCity as upper case
        var ucCity = searchedCity.charAt(0).toUpperCase() + searchedCity.slice(1);

        var button = document.createElement("button");
        button.textContent = ucCity;
        button.setAttribute("data-index", i);
        button.classList.add("btn-block");
        button.classList.add("btn-secondary");
        button.classList.add("btn");
        button.classList.add("btnHistory");
        button.addEventListener("click", function (event) {

            right.style.display = "block";

            getCity(this.textContent);
        });

        cityList.appendChild(button);

    }

}

// This function runs when the page loads.
function init() {
    // pull stored cities from localStorage
    var storedCities = JSON.parse(localStorage.getItem("city"));

    // update the cityHistory array if saved cities come from local storage    
    if (storedCities) {
        cityHistory = storedCities;
    }

    renderCityHistory();
}

// Call init to retrieve data and display upon page load
init();
