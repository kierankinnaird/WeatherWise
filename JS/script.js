// Add an event listener to the search button
document.getElementById("searchButton").addEventListener("click", function () {
    const city = document.getElementById("cityInput").value.trim();
    if (city) {
        fetchWeatherData(city);
    } else {
        alert("Please enter a city name!");
    }
});

// Fetch weather data from OpenWeatherMap API
async function fetchWeatherData(city) {
    const apiKey = 'ac7e0c714c6a3374b474c1b46557bf60'; // Replace with your actual API key
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        displayWeatherData(data);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// Convert Unix timestamp to a human-readable time format
function convertUnixToTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000); // Convert seconds to milliseconds
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes.substr(-2)} ${ampm}`;
}

// Display weather data on the webpage
function displayWeatherData(data) {
    const cityName = data.city.name;
    const country = data.city.country;
    const forecasts = data.list.slice(0, 8); // Get the first 8 forecasts (24 hours)

    // Convert sunrise and sunset times
    const sunrise = convertUnixToTime(data.city.sunrise);
    const sunset = convertUnixToTime(data.city.sunset);

    // Hide the placeholder and clear previous data
    document.getElementById("placeholder").style.display = "none";
    const weatherContainer = document.getElementById("weatherContainer");
    weatherContainer.innerHTML = ''; // Clear previous data

    forecasts.forEach(forecast => {
        const dateTime = convertUnixToTime(forecast.dt); // Convert forecast time
        const temp = forecast.main.temp;
        const weatherDescription = forecast.weather[0].description;
        const icon = forecast.weather[0].icon;

        const weatherBox = document.createElement("div");
        weatherBox.className = "weather-box";
        weatherBox.innerHTML = `
            <h3>${dateTime}</h3>
            <p><img src="https://openweathermap.org/img/wn/${icon}.png" alt="${weatherDescription}" /></p>
            <p>Temp: ${temp}°C</p>
            <p>${weatherDescription}</p>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
        `;
        weatherContainer.appendChild(weatherBox);
    });
}