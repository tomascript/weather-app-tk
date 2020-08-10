if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const DARK_API_KEY = process.env.DARK_API_KEY;
const GEO_API_KEY = process.env.GEO_API_KEY;
const port = process.env.PORT || 3000;
const axios = require('axios');
const express = require('express');
const app = express();
const helmet = require('helmet');
let url;

app.use(express.json());
app.use(express.static('public'));
app.use(helmet());

app.post('/init', (req, res) => {
  const { longitude, latitude } = req.body.location;
  const place_name = 'Your Current Location';
  getWeatherData(latitude, longitude, place_name, res);
});

app.post('/weather', (req, res) => {
  url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURI(
    req.body.location
  )}.json?access_token=${GEO_API_KEY}`;

  axios({ url, responseType: 'json' })
    .then(geoData => {
      const [longitude, latitude] = geoData.data.features[0].center;
      const place_name = geoData.data.features[0].place_name;
      getWeatherData(latitude, longitude, place_name, res);
    })
    .catch(err => console.log(err));
});

const getWeatherData = (latitude, longitude, place_name, res) => {
  url = `https://api.darksky.net/forecast/${DARK_API_KEY}/${latitude},${longitude}?units=auto`;
  axios({ url, responseType: 'json' })
    .then(weatherData => {
      const output = {
        current: weatherData.data.currently,
        place: place_name
      };
      res.json(output);
    })
    .catch(err => console.log(err));
};

app.listen(port, () => {
  console.log('Server Started');
});
