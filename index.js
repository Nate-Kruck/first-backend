require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const geoData = require ('./data/geo.js');
const weatherData = require('./data/weather.js')
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static('public'));

function getWeather(lat, lon) {
        const data = weatherData.data;

        const forecastArray = data.map((weatherItem) => {
            return {
                forecast: weatherItem.weather.description,
                time: new Date(weatherItem.ts * 1000),
            };
        });
        return forecastArray;
}


function getLatLong(cityName) {
        const city = geoData[0];

        return {
            formatted_query: city.display_name,
            latitude: city.lat,
            longitude: city.lon
        };
}

app.get('/location', (req, res) => {
    const userInput = req.query.search;

    const mungeData = getLatLong(userInput);
    res.json(mungeData);
    
});

app.get('/weather', (req, res) => {
  const userLat = req.query.latitude;
  const userLon = req.query.longitude;

  const mungeData = getWeather(userLat, userLon);
  res.json(mungeData);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});