// /* ***************************************************
// **
// ** UI Module
// **
// **
// ** *************************************************** */

const UI = (function () {
  let menu = document.querySelector("#menu-container");

  //show the app and hide the loading screen
  const showApp = () => {
    document.querySelector("#app-loader").classList.add("display-none");
    document.querySelector("main").removeAttribute("hidden");
  };

  //hide the app and show the loading screen
  const loadApp = () => {
    document.querySelector("#app-loader").classList.remove("display-none");
    document.querySelector("main").setAttribute("hidden", "true");
  };

  // show menu
  const _showMenu = () => (menu.style.right = 0);

  // hide menu
  const _hideMenu = () => (menu.style.right = "-65%");

  const _toggleHourlyWeather = () => {
    let hourlyWeather = document.querySelector("#hourly-weather-wrapper"),
      arrow = document.querySelector("#toggle-hourly-weather").children[0],
      visible = hourlyWeather.getAttribute("visible"),
      dailyWeather = document.querySelector("#daily-weather-wrapper");

    if (visible == "false") {
      hourlyWeather.setAttribute("visible", "true");
      hourlyWeather.style.bottom = 0;
      arrow.style.transform = "rotate(180deg)";
      dailyWeather.style.opacity = 0;
    } else if (visible == "true") {
      hourlyWeather.setAttribute("visible", "false");
      hourlyWeather.style.bottom = "-100%";
      arrow.style.transform = "rotate(0deg)";
      dailyWeather.style.opacity = 1;
    } else
      console.error(
        "Unknown state of hourly weather panel and visible attributes");
  };

  const drawWeatherData = (data,location) => {
    console.log(data)
    console.log(location)

    // let currentlyData = data.currently;

      let currentlyData = data.currently,
        dailyData = data.daily.data,
        hourlyData = data.hourly.data,
        weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dailyWeatherWrapper = document.querySelector("#daily-weather-wrapper"),
          dailyWeatherModel,
          day,
          maxMinTemp,
          dailyIcon,
          hourlyWeatherWrapper = document.querySelector("#hourly-weather-wrapper"),
          hourlyWeatherModel,
          hourlyIcon;


    // Set current weather
    //=======================
    // Set current location
      document.querySelectorAll(".location-label").forEach((e) => {
      e.innerHTML = location;
    });

    // Set the background'
    document.querySelector('main').style.backgroundImage = `url("./assets/images/bg-images/${currentlyData.icon}.jpg")`
    // set the icons
    document.querySelector("#currentlyIcon").setAttribute('src', `./assets/images/summary-icons/${currentlyData.icon}-white.png`);
    // set summary
    document.querySelector("#summary-label").innerHTML = currentlyData.summary;
    // set temperature from F -> C
    document.querySelector("#degrees-label").innerHTML = Math.round((
      currentlyData.temperature - 32) * 5 / 9) + '&#176;'
    // set humidity
    document.querySelector("#humidity-label").innerHTML = Math.round(
      currentlyData.humidity * 100) + '%';
    // set wind speed
    document.querySelector("#wind-speed-label").innerHTML = (currentlyData.windSpeed * 1.6093).toFixed(1) + ' kph';

    // set daily Weather
    //===========================
    while(dailyWeatherWrapper.children[1]){
      dailyWeatherWrapper.removeChild(dailyWeatherWrapper.children[0])
    }

    for(let i = 0; i<=6; i++){
      // clone the node and remove display none
      dailyWeatherModel = dailyWeatherWrapper.children[0].cloneNode(true);
      dailyWeatherModel.classList.remove('display-none');
      // set the day
      day = weekDays[new Date(dailyData[i].time * 1000).getDay()]
      dailyWeatherModel.children[0].children[0].innerHTML = day;
      // set min/max temp
      maxMinTemp = Math.round( (dailyData[i].temperatureMax - 32) * 5 / 9) + '&#176;/'
      + Math.round( (dailyData[i].temperatureMin - 32) * 5 / 9) + '&#176;';
      dailyWeatherModel.children[1].children[0].innerHTML = maxMinTemp;
      // set daily icons
      dailyIcon = dailyData[i].icon;
      dailyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${dailyIcon}-white.png`);
      // append the dailyWeatherModel
      dailyWeatherWrapper.appendChild(dailyWeatherModel);
      console.log(dailyWeatherModel);
    }

    dailyWeatherWrapper.children[1].classList.add('current-day-of-the-week');

    // set hourly Weather
    // ===================
    while(hourlyWeatherWrapper.children[1]){
      hourlyWeatherWrapper.removeChild(hourlyWeatherWrapper.children[1])
    }
    for(let i = 0; i<=23; i++){
      //clone the node and remove display none
      hourlyWeatherModel = hourlyWeatherWrapper.children[0].cloneNode(true);
      hourlyWeatherModel.classList.remove('display-none');
      // set houry
      hourlyWeatherModel.children[0].children[0].innerHTML = new Date( hourlyData[i].time * 1000).getHours() + ":00";
      // set temperature
      hourlyWeatherModel.children[1].children[0].innerHTML = Math.round((hourlyData[i].temperature - 32) * 5 / 9) + '&#176;';
      // set the icon
      hourlyIcon = hourlyData[i].icon;
      hourlyWeatherModel.children[1].children[1].children[0].setAttribute('src', `./assets/images/summary-icons/${hourlyIcon}-grey.png`);

      // append model
      hourlyWeatherWrapper.appendChild(hourlyWeatherModel);
    }


    UI.showApp();
  };

  // menu events
  document.querySelector("#open-menu-btn").addEventListener("click", _showMenu);
  document
    .querySelector("#close-menu-btn")
    .addEventListener("click", _hideMenu);

  // hourly weather wrapper
  document
    .querySelector("#toggle-hourly-weather")
    .addEventListener("click", _toggleHourlyWeather);

  // export
  return {
    showApp,
    loadApp,
    drawWeatherData
  };
})();

// /* ***************************************************
// **
// ** Local Storage
// **
// **
// ** *************************************************** */

const LOCALSTORAGE = (function () {

  let savedCities = [];

  const save = (city) => {
    savedCities.push(city);
    localStorage.setItem('savedCities', JSON.stringify(savedCities));
  };

  const get = () => {
    if(localStorage.getItem('savedCities') != null)
    savedCities = JSON.parse(localStorage.getItem('savedCities'));
  }

  const remove = (index) => {
    if (index < savedCities.length) {
      savedCities.splice(index, 1);
      localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
  }

  const getSavedCities = () => savedCities;

  return{
    save,
    get,
    remove,
    getSavedCities
  }
})();

// /* ***************************************************
// **
// ** Saved Citi Module
// **
// **
// ** *************************************************** */

const SAVEDCITIES = (function(){
  let container = document.querySelector("#saved-cities-wrapper");

  const drawCity = (city) => {
    let cityBox = document.createElement('div'),
        cityWrapper = document.createElement('div'),
        deleteWrapper = document.createElement('div'),
        cityTextNode = document.createElement('h1'),
        deleteBtn = document.createElement('button');

    cityBox.classList.add('saved-city-box','flex-container');
    cityTextNode.innerHTML = city;
    cityTextNode.classList.add('set-city');
    cityWrapper.classList.add('ripple','set-city');
    cityWrapper.append(cityTextNode);
    cityBox.append(cityWrapper);

    deleteBtn.classList.add('ripple','remove-saved-city');
    deleteBtn.innerHTML = '-';
    deleteWrapper.append(deleteBtn);
    cityBox.append(deleteWrapper);

    container.append(cityBox);
  };

  const _deleteCity = (cityHTMLBtn) => {
    let nodes = Array.prototype.slice.call(container.children),
        cityWrapper = cityHTMLBtn.closest('.saved-city-box'),
        cityIndex = nodes.indexOf(cityWrapper);
    LOCALSTORAGE.remove(cityIndex);
    cityWrapper.remove();
  }

  document.addEventListener('click',function(event){
    if(event.target.classList.contains('remove-saved-city')){
      _deleteCity(event.target);
    }
  });

  document.addEventListener('click',function(event){
    if(event.target.classList.contains('set-city')){
      let nodes = Array.prototype.slice.call(container.children),
          cityWrapper = event.target.closest('.saved-city-box'),
          cityIndex = nodes.indexOf(cityWrapper),
          savedCities = LOCALSTORAGE.getSavedCities();

      WEATHER.getWeather(savedCities[cityIndex],false);
    }
  });

  return{
    drawCity
  }
})();



// /* ***************************************************
// **
// ** Location location Loction
// **
// **
// ** *************************************************** */

const GETLOCATION = (function() {
  let location;

  const locationInput = document.querySelector("#location-input"),
    addCityBtn = document.querySelector("#add-city-btn");

  const _addCity = () => {
    location = locationInput.value;
    locationInput.value = "";
    addCityBtn.setAttribute("disabled", "true");
    addCityBtn.classList.add("disabled");

    // get weather data
    WEATHER.getWeather(location, true)
  }

  locationInput.addEventListener("input", function() {
    let inputText = this.value.trim();

    if (inputText != "") {
      addCityBtn.removeAttribute("disabled");
      addCityBtn.classList.remove("disabled");
    } else {
      addCityBtn.setAttribute("disabled", "true");
      addCityBtn.classList.add("disabled");
    }
  })

  addCityBtn.addEventListener("click", _addCity);
})();

// /* ***************************************************
// **
// ** get Weather data
// **
// **
// ** *************************************************** */

const WEATHER = (function () {

    const darkSkyKey = 'a01d420cb15322898f3ca3f58a4acfd6',
        geocoderKey = 'a54c8cb5db7b4a4cb7e22c44bfeca43a';


    const _getGeocodeURL = (location) => `https://api.opencagedata.com/geocode/v1/json?q=${location}&key=${geocoderKey}`;

    const _getDarkSkyURL = (lat, lng) => `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSkyKey}/${lat},${lng}`;

    const _getDarkSkyData = (url,location) => {
        axios.get(url)
            .then( (res) => {
                console.log(res);
                UI.drawWeatherData(res.data, location)
            })
            .catch( (err) => {
                console.error(err);
            })
    };

    const getWeather = (location, save) => {
        UI.loadApp();

        let geocodeURL = _getGeocodeURL(location);

        axios.get(geocodeURL)
            .then( (res) => {
                console.log(res);
                if (res.data.results.length == 0) {
                  console.error("Invalid Location");
                  UI.showApp();
                  return;
                }

                if (save) {
                  LOCALSTORAGE.save(location);
                  SAVEDCITIES.drawCity(location);
                }


                let lat = res.data.results[0].geometry.lat,
                    lng = res.data.results[0].geometry.lng;

                let darkskyURL = _getDarkSkyURL(lat,lng);

                _getDarkSkyData(darkskyURL,location);
            })
            .catch( (err) => {
                console.log(err)
            })
    };

    return{
        getWeather
    }
})();


// /* ***************************************************
// **
// ** Init
// **
// **
// ** *************************************************** */

window.onload = function() {
  LOCALSTORAGE.get();
  let cities = LOCALSTORAGE.getSavedCities();
  if (cities.length != 0) {
    cities.forEach( (city) => SAVEDCITIES.drawCity(city));
    WEATHER.getWeather(cities[cities.length - 1], false)
  }
  else UI.showApp();
};
