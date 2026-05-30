import './styles.css';
import {
  buildLayout,
  buildUnitButton,
  renderWeatherContent,
} from './render.js';
import { currentWeatherData, updateWeatherData } from './weather.js';

console.log('Test Connection');
document.body.appendChild(buildLayout());
buildUnitButton();
renderWeatherContent(currentWeatherData);

async function searchCity() {
  const input = document.querySelector('#search-input');
  const loading = document.querySelector('#loading');
  loading.classList.remove('hidden');
  if (currentWeatherData !== '') await updateWeatherData(input.value);
  loading.classList.add('hidden');
  renderWeatherContent(currentWeatherData);
}

const searchBtn = document.querySelector('#search-btn');
searchBtn.addEventListener('click', searchCity);
