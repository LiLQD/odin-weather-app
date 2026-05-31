import { getGif, getIconSVG } from './picture.js';
import { currentUnit, reverseCurrentUnit } from './state.js';
import { convertToC, currentWeatherData } from './weather.js';
// Create a new element
function el(tag, { classes, id, attribute, text, children, on } = {}) {
  const node = document.createElement(tag);
  if (id) node.id = id;
  if (text) node.textContent = text;
  if (classes) {
    const list = Array.isArray(classes) ? classes : [classes];
    node.classList.add(...list);
  }
  if (attribute) Object.entries(attribute).forEach(([k, v]) => (node[k] = v));
  if (on) Object.entries(on).forEach(([e, fn]) => node.addEventListener(e, fn));
  if (children) node.append(...children);
  return node;
}

export function qs(selector, { classes, removeClasses, text, attribute } = {}) {
  const node = document.querySelector(selector);
  if (!node) throw new Error(`qs: no element found for "${selector}"`);
  if (text) node.textContent = text;
  if (classes) {
    const list = Array.isArray(classes) ? classes : [classes];
    node.classList.add(...list);
  }
  if (removeClasses) {
    const list = Array.isArray(removeClasses) ? removeClasses : [removeClasses];
    node.classList.remove(...list);
  }
  if (attribute) Object.entries(attribute).forEach(([k, v]) => (node[k] = v));
  return node;
}

function createSVGEl(tag, attrs) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

export function buildLayout() {
  const page = el('div', { classes: ['page'] });

  // Search
  const searchBar = el('div', { classes: ['search-bar'] });
  const searchIcon = createSVGEl('svg', {
    class: 'search-icon',
    xmlns: 'http://www.w3.org/2000/svg',
    width: '16',
    height: '16',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  searchIcon.append(createSVGEl('circle', { cx: '11', cy: '11', r: '8' }));
  searchIcon.append(createSVGEl('path', { d: 'm21 21-4.35-4.35' }));
  const searchInput = el('input', {
    id: 'search-input',
    attribute: { type: 'text', placeholder: 'Search city or zip code...' },
  });
  const searchButton = el('button', { id: 'search-btn', text: 'Search' });
  searchBar.append(searchIcon, searchInput, searchButton);

  // Status and degree toggle
  const controlRow = el('div', { classes: ['controls-row'] });
  const statusBar = el('div', { classes: ['status-bar'] });
  const statusDot = el('span', { classes: ['status-dot'] });
  const statusText = el('span', {
    id: 'status-text',
    text: 'Enter a city to start',
  });
  statusBar.append(statusDot, statusText);
  const togglePill = el('div', { classes: ['toggle-pill'] });
  const toggleF = el('span', {
    id: 'toggle-f',
    text: '°F',
  });
  toggleF.dataset.unit = 'F';
  const toggleC = el('span', {
    id: 'toggle-c',
    text: '°C',
  });
  currentUnit === 'C'
    ? toggleC.classList.add('active')
    : toggleF.classList.add('active');
  toggleC.dataset.unit = 'C';
  togglePill.append(toggleC, toggleF);
  controlRow.append(statusBar, togglePill);

  // Loading skeleton
  const loading = el('div', { id: 'loading', classes: ['loading', 'hidden'] });
  const skeletonMain = el('div', { classes: ['skeleton', 'skeleton-main'] });
  const skeletonGif = el('div', { classes: ['skeleton', 'skeleton-gif'] });
  const skeletonForecast = el('div', {
    classes: ['skeleton', 'skeleton-forecast'],
  });
  loading.append(skeletonMain, skeletonGif, skeletonForecast);

  // Weather content
  const weatherContent = el('div', {
    id: 'weather-content',
    classes: ['hidden'],
  });

  // Main card
  const mainCard = el('div', { classes: ['main-card'] });
  const cityRow = el('div', { classes: ['city-row'] });
  const cityInfo = el('div', {});
  const cityName = el('div', {
    id: 'city-name',
    classes: ['city-name'],
    text: '—',
  });
  const cityDate = el('div', {
    id: 'city-date',
    classes: ['city-sub'],
    text: '—',
  });
  cityInfo.append(cityName, cityDate);
  const weatherIcon = el('div', {
    id: 'weather-icon',
    classes: ['weather-icon'],
  });
  cityRow.append(cityInfo, weatherIcon);
  const tempDisplay = el('div', {
    id: 'temp-display',
    classes: ['temp-big'],
    text: '—',
  });
  const conditionText = el('div', {
    id: 'condition-text',
    classes: ['condition'],
    text: '—',
  });
  const metaRow = el('div', { classes: ['meta-row'] });
  const metaItems = [
    { label: 'Humidity', id: 'humidity' },
    { label: 'Wind', id: 'wind' },
    { label: 'UV Index', id: 'uv-index' },
  ];
  metaItems.forEach(({ label, id }) => {
    const item = el('div', { classes: ['meta-item'] });
    const labelEl = el('div', { classes: ['label'], text: label });
    const valueEl = el('div', { id, classes: ['meta-val'], text: '—' });
    item.append(labelEl, valueEl);
    metaRow.append(item);
  });
  mainCard.append(cityRow, tempDisplay, conditionText, metaRow);

  // Giphy panel
  const gifCard = el('div', { classes: ['gif-card'] });
  const gifPlaceholder = el('div', {
    id: 'gif-placeholder',
    classes: ['gif-placeholder'],
  });
  const gifPlaceholderIcon = createSVGEl('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '28',
    height: '28',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  gifPlaceholderIcon.append(
    createSVGEl('rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }),
    createSVGEl('circle', { cx: '9', cy: '9', r: '2' }),
    createSVGEl('path', { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' })
  );
  const gifSpan = el('span', { text: 'Weather gif will appear here' });
  gifPlaceholder.append(gifPlaceholderIcon, gifSpan);
  const gifImg = el('img', {
    id: 'gif-img',
    classes: ['gif-img', 'hidden'],
    attribute: { alt: 'Weather gif' },
  });
  gifCard.append(gifPlaceholder, gifImg);

  // 5-day forecast
  const forecastWrapper = el('div', {});
  const forecastLabel = el('div', {
    classes: ['label'],
    text: '5-day forecast',
  });
  forecastLabel.style.marginBottom = '8px';
  const forecastStrip = el('div', {
    id: 'forecast-strip',
    classes: ['forecast-row'],
  });
  forecastWrapper.append(forecastLabel, forecastStrip);

  weatherContent.append(mainCard, gifCard, forecastWrapper);

  // Error message
  const errorMsg = el('div', {
    id: 'error-msg',
    classes: ['error-msg', 'hidden'],
  });
  const errorIcon = createSVGEl('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '18',
    height: '18',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.5',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  });
  errorIcon.append(
    createSVGEl('circle', { cx: '12', cy: '12', r: '10' }),
    createSVGEl('line', { x1: '12', x2: '12', y1: '8', y2: '12' }),
    createSVGEl('line', { x1: '12', x2: '12.01', y1: '16', y2: '16' })
  );
  const errorText = el('span', {
    id: 'error-text',
    text: 'Something went wrong.',
  });
  errorMsg.append(errorIcon, errorText);

  // Final assembly
  page.append(searchBar, controlRow, loading, weatherContent, errorMsg);

  return page;
}

export function buildUnitButton() {
  const toggleButton = document.querySelector('.toggle-pill');
  if (!toggleButton) return;
  toggleButton.addEventListener('click', () => {
    const currentUnitElement = document.querySelector(
      `[data-unit="${currentUnit}"].active`
    );
    currentUnitElement?.classList.remove('active');
    reverseCurrentUnit();
    renderTemperature();
    const nextUnitElement = document.querySelector(
      `[data-unit="${currentUnit}"]`
    );
    nextUnitElement?.classList.add('active');
  });
}

export function renderWeatherContent() {
  qs('#weather-content', { text: '' });
  if (currentWeatherData === undefined) {
    console.log('No weather data in local storage');
    qs('#weather-content', { classes: 'hidden' });
    return;
  }
  console.log('There is weather data in local storage');
  console.log(currentWeatherData);
  qs('#weather-content', { removeClasses: 'hidden' });
  qs('#city-name', { text: currentWeatherData.city }, true);
  qs('#city-date', { text: currentWeatherData.forecast[0].day }, true);
  const weatherIcon = document.querySelector('#weather-icon');
  weatherIcon.innerHTML = getIconSVG(currentWeatherData.icon);
  renderTemperature(currentWeatherData);
  qs('#condition-text', { text: currentWeatherData.condition });
  qs('#humidity', { text: currentWeatherData.humidity });
  qs('#wind', { text: currentWeatherData.windMph });
  qs('#uv-index', { text: currentWeatherData.uvIndex });
}

export function renderTemperature() {
  const temp =
    currentUnit === 'C'
      ? convertToC(currentWeatherData.tempF) + ' °C'
      : currentWeatherData.tempF + ' °F';
  qs('#temp-display', { text: temp });
}

export async function renderGif() {
  let gifURL = await getGif(currentWeatherData.icon);
  qs('#gif-placeholder', { classes: 'hidden' });
  qs('#gif-img', { removeClasses: 'hidden', attribute: { src: gifURL } });
}
