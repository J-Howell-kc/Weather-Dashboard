// variables for weather info categories 

var currentTemp = document.getElementById("temp");
var currentWind = document.getElementById("wind");
var currentCityDate = document.getElementById("cityDate");

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

var APIKey = "8f1568f1569f75135c444d58e02affc2fc762";

// need to input city
var userInput = document.getElementById("input");
var searchButton = document.getElementById("searchBtn");

// to hide the window info before clicking search button
var right = document.getElementById("right");
right.style.display = "none";


// fetch functions

// Make the Geocoding API Call Using Fetch to get city lat and lon

function getCity(cityName) {
    cityName = cityName.trim();
    // console.log(cityName);

    var requestUrl = "https://api.openweathermap.org/data/2.5/direct?q=" + cityName + "&appid=" + APIKey;

    fetch(requestUrl)

        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);

            var cityLat = data[0].lat;
            var cityLon = data[0].lon;
            // console.log(cityLat);
            // console.log(cityLon);

            getWeather(cityName, cityLat, cityLon);


        });
} 

//  fetch to make the oneCall API Call to get weather info
function getWeather(cityName, cityLat, cityLon) {
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=hourly,minutely,alerts&units=imperial&appid=" + APIKey;

    // to print the inputCity as upper case
    //var printInputCity = cityName.charAt(0).toUpperCase() + cityName.slice(1);

    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // to show weather in the main weather box
            var icon = document.getElementById("icon");
            icon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");

            currentCityDate.textContent = printInputCity + " (" + currentDay + ")";
            currentTemp.textContent = data.current.temp + "°F";
            currentWind.textContent = data.current.wind_speed + " MPH";
            currentHumidity.textContent = data.current.humidity + " %";


            // to show weather in  the forecastBlock array [1] for the tomorrow ... [5] for 5 days later
            for (var i = 1; i < 6; i++) {
                days[i - 1].textContent = moment.unix(data.daily[i].dt).format("MM/DD/YYYY");
                daysTemp[i - 1].textContent = "Temp: " + data.daily[i].temp.day + "°F";
                daysWind[i - 1].textContent = "Wind: " + data.daily[i].wind_speed + " MPH";
                daysHum[i - 1].textContent = "Humidity: " + data.daily[i].humidity + " %";
                var addDaysIcon = daysIcon[i - 1].setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
            }

        });
}

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
        alert("Please enter a city.");
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
            //
            event.preventDefault();

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



