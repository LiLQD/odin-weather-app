import './styles.css';
import { buildLayout } from './render.js';
import { getWeatherData } from './weather.js';

console.log('Test Connection');
document.body.appendChild(buildLayout());

getWeatherData('Ha Noi');
