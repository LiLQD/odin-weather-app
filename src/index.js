import './styles.css';
import {
  buildLayout,
  buildUnitButton,
  qs,
  renderGif,
  renderWeatherContent,
} from './render.js';
import { currentWeatherData, updateWeatherData } from './weather.js';

console.log('Test Connection');
document.body.appendChild(buildLayout());
buildUnitButton();
renderWeatherContent();
renderGif();
async function searchCity() {
  const input = qs('#search-input');
  qs('#weather-content', { text: '', classes: 'hidden' });
  const loading = qs('#loading', { removeClasses: 'hidden' });
  if (currentWeatherData !== '') await updateWeatherData(input.value);
  loading.classList.add('hidden');
  renderWeatherContent();
  renderGif();
}

const searchBtn = qs('#search-btn');
searchBtn.addEventListener('click', searchCity);
