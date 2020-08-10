const form = document.querySelector('.form-wrapper');
const searchElement = document.querySelector('[data-city-search]');
let latitude, logitude;

window.addEventListener('DOMContentLoaded', e => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      fetchWeatherData('init', { latitude, longitude });
    });
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  fetchWeatherData('weather', searchElement.value);
});

const fetchWeatherData = (endpoint, location) => {
  fetch(`/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      location: location
    })
  })
    .then(res => {
      return res.json();
    })
    .then(data => {
      searchElement.value = '';
      setWeatherData(data.current, data.place);
    })
    .catch(err => alert(err));
};

const icon = new Skycons({ color: '#222' });
const locationElement = document.querySelector('[data-location]');
const statusElement = document.querySelector('[data-status]');
const temperatureElement = document.querySelector('[data-temperature]');
const precipitationElement = document.querySelector('[data-precipitation]');
const windElement = document.querySelector('[data-wind]');
icon.set('icon', 'clear-day');
icon.play();

function setWeatherData(data, place) {
  locationElement.textContent = place;
  statusElement.textContent = data.summary;
  temperatureElement.textContent = data.temperature;
  precipitationElement.textContent = `${data.precipProbability * 100}%`;
  windElement.textContent = data.windSpeed;
  icon.set('icon', data.icon);
  icon.play();
}
