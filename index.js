require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const geoData = require ('./data/geo.js');
const weatherData = require('./data/weather.js')
const app = express();
const port = process.env.PORT || 3000;
import request from 'superagent';

app.use(cors());

app.use(express.static('public'));

const { GEOCODE_API_KEY } = process.env;


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


async function getLatLong(cityName) {
    const response = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${cityName}&format=json`);
    
    const city = response[0];
    return {
            formatted_query: city.display_name,
            latitude: city.lat,
            longitude: city.lon
        };
}

app.get('/location', async(req, res) => {
    const userInput = req.query.search;

    const mungeData = await getLatLong(userInput);
    res.json(mungeData);
    
});

// app.get('/chars', (req, res) => {
//         const response = await request.get('https://alchemy-pokedex.herokuapp.com/api/pokedex?pokemon=char');

//         const pokemon = response.body.results;

//         const names = pokemon.map((poke) => {
//             return poke.pokemon;
        
            
//         });
//         res.json(names);
// });

app.get('/weather', (req, res) => {
  const userLat = req.query.latitude;
  const userLon = req.query.longitude;

  const mungeData = getWeather(userLat, userLon);
  res.json(mungeData);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

module.exports = {
    app
}