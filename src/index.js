import './styles.css';
import {
  buildLayout,
  buildUnitButton,
  qs,
  renderWeatherContent,
} from './render.js';
import { currentWeatherData, updateWeatherData } from './weather.js';

console.log('Test Connection');
document.body.appendChild(buildLayout());
buildUnitButton();
renderWeatherContent(currentWeatherData);

async function searchCity() {
  const input = qs('#search-input');
  const loading = qs('#loading', { removeClasses: 'hidden' });
  if (currentWeatherData !== '') await updateWeatherData(input.value);
  loading.classList.add('hidden');
  renderWeatherContent();
}

const searchBtn = qs('#search-btn');
searchBtn.addEventListener('click', searchCity);
