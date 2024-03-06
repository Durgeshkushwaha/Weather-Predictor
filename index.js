const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccesscontainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchform]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// Initially vaiable need?? 

let oldTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
oldTab.classList.add("current-Tab");
getfromSessionStorage();


function switchTab(newTab) {
    console.log(newTab, '-yyy')
    if (newTab != oldTab) {
        oldTab.classList.remove("current-Tab");
        oldTab = newTab;
        oldTab.classList.add("current-Tab");

        if (!searchForm.classList.contains("active")) {
            // kya search form wala container is visible ,if yes then make it visible. 
            userInfoContainer.classList.remove("active");
            grantAccesscontainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else {
            console.log('xx');
            // mai pehle search wale tab par tha, ab your weather tab visible karna hai.
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // ab mai your weather tab me aa gya hu ,toh weather bhi display karna padega,so let's check local storage first. 
            // for coordinates,if we have saved them there 
            getfromSessionStorage();
        }
    }

}

userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter.
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    //pass clicked tab as input parameter.
    switchTab(searchTab);
});

// check if coordinates are already present in the session storage 
function getfromSessionStorage() {
    console.log('xx2');
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccesscontainer.classList.add("active");
    }
    else {
        console.log('xx3');
        const coordinates = JSON.parse(localCoordinates);
        fetchuserweatherInfo(coordinates);
    }
}

async function fetchuserweatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    // make grantcontainer invisible 
    grantAccesscontainer.classList.remove("active");
    // make loader visible 
    loadingScreen.classList.add("active");

    // API_CALL 
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
       // console.log('xx4',data);
        renderWeatherInfo(data);
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
       
    }
    catch (error) {
        console.error("Error fetching weather information:", error);
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(weatherInfo) {
    console.log('xx5',weatherInfo);
    // first ,we need to fetch information 

    const cityname = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // fetch values form weather info object and put it UI elements . 

    cityname.innerText = weatherInfo?.name;
    console.log('xx5', cityname.innerText);
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} ℃`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        // show an alert for no geolocation support available 
    }
}

function showPosition(position) {
    const usercoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(usercoordinates));
    fetchuserweatherInfo(usercoordinates);
}

const grantaccessbutton = document.querySelector("[data-grantAccess]");
grantaccessbutton.addEventListener("click", getlocation);


const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityname = searchInput.value;

    if (cityname === "")
        return;
    else
        fetchsearchWeatherInfo(cityname);
})

async function fetchsearchWeatherInfo(city) {
    console.log('xx');
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccesscontainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        console.log('xx->',data);
        renderWeatherInfo(data);
    } catch (error) {
        console.log("Error fetching weather information:", error);
        loadingScreen.classList.remove("active");
    }
}