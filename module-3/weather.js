// weather.js

async function getWeather(){
    try {
        const weather = await fetch("https://api.open-meteo.com/v1/forecast?latitude=14.6&longitude=121.0&current_weather=true");
        const currentWeather = await weather.json();
        console.log(currentWeather.current_weather);
    } catch (error) {
        console.error('Error: ', error);
    }
}

getWeather();