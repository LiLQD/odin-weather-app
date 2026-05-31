import './styles.css';
import {
  buildLayout,
  buildUnitButton,
  qs,
  renderGif,
  renderWeatherContent,
} from './render.js';
import { currentWeatherData, updateWeatherData } from './weather.js';

document.body.appendChild(buildLayout());
buildUnitButton();
if (currentWeatherData !== undefined) {
  renderWeatherContent();
  renderGif();
}
async function searchCity() {
  try {
    const input = qs('#search-input');
    qs('#weather-content', { text: '', classes: 'hidden' });
    const loading = qs('#loading', { removeClasses: 'hidden' });
    await updateWeatherData(input.value);
    loading.classList.add('hidden');
    renderWeatherContent();
    renderGif();
  } catch (err) {
    qs('error-msg', { removeClasses: 'hidden' });
    console.error(err);
  }
}

const searchBtn = qs('#search-btn');
searchBtn.addEventListener('click', searchCity);
