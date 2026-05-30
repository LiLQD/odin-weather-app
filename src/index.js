import './styles.css';
import { buildLayout } from './render.js';
import { getWeatherData } from './weather.js';

console.log('Test Connection');
document.body.appendChild(buildLayout());

function searchCity() {
  const input = document.querySelector('#search-input');
  getWeatherData(input.value);
}

const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', searchCity);
