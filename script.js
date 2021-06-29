let units = 'metric';

const getGeoCode = (searchInput) => {
    let GeoCodingUri =`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=1&appid=e9a7f0b75b40a02d4fb5055300a92bd9`;
        // console.log(GeoCodingUri);
    let geoCodeData;
    fetch(GeoCodingUri)
    .then((response) => {
        if(response.status == 200){
            geoCodeData = response.json();
            return geoCodeData;
        }
        throw 'Enter Valid City';
        
    })
    .then((convertedData) => {
        getWeatherData(searchInput);
        getForecastData(convertedData[0].lat,convertedData[0].lon);
    })
    .catch((error) => {
        window.alert(error);
    })
}

let searchbutton = document.getElementById('search-btn');
searchbutton.addEventListener('click',() => {
    let searchInputfield = document.getElementById('search');
    let searchInput = searchInputfield.value;
    if(searchInput === ''){
        window.alert('Please enter city and search');
    }
    else{
        getGeoCode(searchInput);
        searchInputfield.value = '';
    }
})

getGeoCode('Guntur');




const getForecastData = (lat,lon) => {

    let forecastUri = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=e9a7f0b75b40a02d4fb5055300a92bd9&units=${units}`;

    fetch(forecastUri)
    .then((response) => {
        return response.json();
    })
    .then((jsonconverteddata) => {
        // console.log(jsonconverteddata.daily);
        embedForecastData(jsonconverteddata.daily);
    })
    .catch((error) => {
        console.log(error);
    })   
}


const embedForecastData = (forecastData) => {
    let row = document.getElementById('weekRow');
    for(let i = 1; i < forecastData.length-2; i++){
        let dayDate = document.getElementById(`${i}-dayDate`);
        let date = new Date();
        date.setDate(date.getDate() + i);
        dayDate.innerHTML = date.toDateString();
        let forecastImg = document.getElementById(`${i}-forecastImg`);
        forecastImg.src = `https://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}@2x.png`;
        forecastImg.alt = forecastData[i].weather[0].description;
        let forecastTemp = document.getElementById(`${i}-forecastTemp`);
        forecastTemp.innerHTML = Math.round((forecastData[i].temp.max + forecastData[i].temp.min) / 2);
        let forecastDesc = document.getElementById(`${i}-forecastDesc`);
        forecastDesc.innerHTML = firstLetterCapitalise(forecastData[i].weather[0].description);
    }
}

const getWeatherData = (city) => {
    let uri = `https://api.openweathermap.org/data/2.5/weather?q=${city ? city : 'london'}&appid=e9a7f0b75b40a02d4fb5055300a92bd9&units=${units}`;
    
    console.log(uri);
    let data;
    fetch(uri)
    .then((response) => {
        data = response.json();
        return data;
    })
    .then((JsonData) => {
        embedDataToUI(JsonData);
        // console.log(JsonData);
    })
    .catch((error) => {
        console.log(error);
    })
}

const embedDataToUI = (JsonData) => {
    console.log(JsonData);
    let currentWeatherImg = document.getElementById('currentWeatherImg');
    currentWeatherImg.src = `https://openweathermap.org/img/wn/${JsonData.weather[0].icon}@4x.png`;
    currentWeatherImg.alt = JsonData.weather[0].description;

    let degress = document.getElementById('degress');
    degress.innerHTML = Math.round(JsonData.main.temp);
    let date = new Date();
    let currentDay = document.getElementById('currentDay');
    currentDay.innerHTML = date.toDateString();
    // let weatherDesc
    let weatherDesc = document.getElementById('weatherDesc');
    weatherDesc.innerHTML = firstLetterCapitalise(JsonData.weather[0].description);

    let cloudiness = document.getElementById('cloudiness');
    cloudiness.innerHTML = JsonData.clouds.all;

    let city = document.getElementById('City');
    city.innerHTML = JsonData.name + ', ' + JsonData.sys.country;

    let feelslike = document.getElementById('feelsLike');
    feelslike.innerHTML = Math.round(JsonData.main.feels_like);

    let humidity = document.getElementById('humidity');
    humidity.innerHTML = JsonData.main.humidity;

    let wind = document.getElementById('wind');
    wind.innerHTML = Math.round(JsonData.wind.speed * 3.6);

    let pressure = document.getElementById('pressure');
    pressure.innerHTML = JsonData.main.pressure;

    let visibility = document.getElementById('visibility');
    visibility.innerHTML = Math.round(JsonData.visibility / 1000);

    let sunrise = document.getElementById('sunrise');
    sunrise.innerHTML = unixTimeConvertion(JsonData.sys.sunrise);

    let sunset = document.getElementById('sunset');
    sunset.innerHTML = unixTimeConvertion(JsonData.sys.sunset);

}

const unixTimeConvertion = (unixTime) => {
    let unixDate = new Date(unixTime * 1000);
    let hrs = unixDate.getHours();
    hrs = ('0' + hrs).slice(-2);
    let min = unixDate.getMinutes();
    min = ('0' + min).slice(-2);
    return hrs+':'+min;
}

const firstLetterCapitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


let celsiusUnits = document.getElementById('celsius');
let fahernUnits = document.getElementById('farhen');

celsiusUnits.addEventListener('click', () => {
    fahernUnits.classList.contains('active') ? fahernUnits.classList.remove('active') : ''
    celsiusUnits.classList.add('active');
    convertTemp('C');
})

fahernUnits.addEventListener('click', () => {
    celsiusUnits.classList.contains('active') ? celsiusUnits.classList.remove('active') : ''
    fahernUnits.classList.add('active');
    convertTemp('F');
})

const convertTemp = (convert) => {
    let todayTemp = document.getElementById('degress');
    let forecastTemp1 = document.getElementById('1-forecastTemp');
    let forecastTemp2 = document.getElementById('2-forecastTemp');
    let forecastTemp3 = document.getElementById('3-forecastTemp');
    let forecastTemp4 = document.getElementById('4-forecastTemp');
    let forecastTemp5 = document.getElementById('5-forecastTemp');
    let feelTemp = document.getElementById('feelsLike');
    let metricsTemp = document.getElementById('metrics');
    

    if(convert === 'C'){
        todayTemp.innerHTML = Math.round(((todayTemp.innerHTML - 32) * (5/9)));
        forecastTemp1.innerHTML = Math.round(((forecastTemp1.innerHTML - 32) * (5/9)));
        forecastTemp2.innerHTML = Math.round(((forecastTemp2.innerHTML - 32) * (5/9)));
        forecastTemp3.innerHTML = Math.round(((forecastTemp3.innerHTML - 32) * (5/9)));
        forecastTemp4.innerHTML = Math.round(((forecastTemp4.innerHTML - 32) * (5/9)));
        forecastTemp5.innerHTML = Math.round(((forecastTemp5.innerHTML - 32) * (5/9)));
        feelTemp.innerHTML = Math.round(((feelTemp.innerHTML - 32) * (5/9)));
        metricsTemp.innerHTML = 'C';
    }
    else if(convert === 'F'){
        todayTemp.innerHTML = Math.round(((todayTemp.innerHTML *(9/5)) + 32));
        forecastTemp1.innerHTML = Math.round(((forecastTemp1.innerHTML *(9/5)) + 32));
        forecastTemp2.innerHTML = Math.round(((forecastTemp2.innerHTML *(9/5)) + 32));
        forecastTemp3.innerHTML = Math.round(((forecastTemp3.innerHTML *(9/5)) + 32));
        forecastTemp4.innerHTML = Math.round(((forecastTemp4.innerHTML *(9/5)) + 32));
        forecastTemp5.innerHTML = Math.round(((forecastTemp5.innerHTML *(9/5)) + 32));
        feelTemp.innerHTML = Math.round(((feelTemp.innerHTML *(9/5)) + 32));
        metricsTemp.innerHTML = 'F';
    }
}

let locationbtn = document.getElementById('location');
locationbtn.addEventListener('click',() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else { 
       window.alert("Geolocation is not supported by this browser.");
      }
})

const showPosition = ((position) => {
    let latt = (position.coords.latitude).toFixed(4);
    let logn = (position.coords.longitude).toFixed(4);
    let reverseGeocodeUri = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latt}&lon=${logn}&limit=1&appid=e9a7f0b75b40a02d4fb5055300a92bd9`;
    console.log('rever -- '+reverseGeocodeUri);

    fetch(reverseGeocodeUri)
    .then((reverseRes) => {
        return reverseRes.json();
    })
    .then((resData) => {
        getWeatherData(resData[0].name);
        getForecastData(resData[0].lat,resData[0].lon);
    })
    .catch((error) => {
        window.alert(error);
    })
})
