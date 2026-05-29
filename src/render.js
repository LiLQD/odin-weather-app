function el(tag, { classes, id, attribute, text }) {
  const node = document.createElement(tag);
  if (id) node.id = id;
  if (classes) {
    const list = Array.isArray(classes) ? classes : [classes];
    node.classList.add(...list);
  }
  if (text) node.textContent = text;
  if (attribute) Object.entries(attribute).forEach(([k, v]) => (node[k] = v));
  return node;
}

function append(parent, ...children) {
  children.forEach((child) => parent.appendChild(child));
  return parent;
}

// function field({ labelFor, labelText, fieldClass, input }) {
//   const wrapper = el('div', { classes: [fieldClass] });
//   const label = el('label', {
//     attribute: { htmlFor: labelFor },
//     text: labelText,
//   });
//   return append(wrapper, label, input);
// }

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
  append(searchIcon, createSVGEl('circle', { cx: '11', cy: '11', r: '8' }));
  append(searchIcon, createSVGEl('path', { d: 'm21 21-4.35-4.35' }));
  const searchInput = el('input', {
    id: 'search-input',
    attribute: { type: 'text', placeholder: 'Search city or zip code...' },
  });
  const searchButton = el('button', { id: 'search-btn', text: 'Search' });
  append(searchBar, searchIcon, searchInput, searchButton);

  // Status and degree toggle
  const controlRow = el('div', { classes: ['controls-row'] });
  const statusBar = el('div', { classes: ['status-bar'] });
  const statusDot = el('span', { classes: ['status-dot'] });
  const statusText = el('span', { id: 'status-text', text: 'Enter a city to start' });
  append(statusBar, statusDot, statusText);
  const togglePill = el('div', { classes: ['toggle-pill'] });
  const toggleF = el('span', { id: 'toggle-f', classes: ['active'], text: '°F' });
  toggleF.dataset.unit = 'F';
  const toggleC = el('span', { id: 'toggle-c', text: '°C' });
  toggleC.dataset.unit = 'C';
  append(togglePill, toggleF, toggleC);
  append(controlRow, statusBar, togglePill);

  // Loading skeleton
  const loading = el('div', { id: 'loading', classes: ['loading', 'hidden'] });
  const skeletonMain     = el('div', { classes: ['skeleton', 'skeleton-main'] });
  const skeletonGif      = el('div', { classes: ['skeleton', 'skeleton-gif'] });
  const skeletonForecast = el('div', { classes: ['skeleton', 'skeleton-forecast'] });
  append(loading, skeletonMain, skeletonGif, skeletonForecast);

  // Weather content
  const weatherContent = el('div', { id: 'weather-content', classes: ['hidden'] });

  // Main card
  const mainCard = el('div', { classes: ['main-card'] });
  const cityRow = el('div', { classes: ['city-row'] });
  const cityInfo = el('div', {});
  const cityName = el('div', { id: 'city-name', classes: ['city-name'], text: '—' });
  const cityDate = el('div', { id: 'city-date', classes: ['city-sub'],  text: '—' });
  append(cityInfo, cityName, cityDate);
  const weatherIcon = el('div', { id: 'weather-icon', classes: ['weather-icon'] });
  append(cityRow, cityInfo, weatherIcon);
  const tempDisplay   = el('div', { id: 'temp-display',   classes: ['temp-big'],   text: '—' });
  const conditionText = el('div', { id: 'condition-text', classes: ['condition'],  text: '—' });
  const metaRow = el('div', { classes: ['meta-row'] });
  const metaItems = [
    { label: 'Humidity', id: 'humidity' },
    { label: 'Wind',     id: 'wind'     },
    { label: 'UV Index', id: 'uv-index' },
  ];
  metaItems.forEach(({ label, id }) => {
    const item      = el('div', { classes: ['meta-item'] });
    const labelEl   = el('div', { classes: ['label'],    text: label });
    const valueEl   = el('div', { id,                    classes: ['meta-val'], text: '—' });
    append(item, labelEl, valueEl);
    append(metaRow, item);
  });
  append(mainCard, cityRow, tempDisplay, conditionText, metaRow);

  // Giphy panel
  const gifCard = el('div', { classes: ['gif-card'] });
  const gifPlaceholder = el('div', { id: 'gif-placeholder', classes: ['gif-placeholder'] });
  const gifPlaceholderIcon = createSVGEl('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '28', height: '28', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  });
  append(gifPlaceholderIcon,
    createSVGEl('rect',   { width: '18', height: '18', x: '3', y: '3', rx: '2' }),
    createSVGEl('circle', { cx: '9', cy: '9', r: '2' }),
    createSVGEl('path',   { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' })
  );
  const gifSpan = el('span', { text: 'Weather gif will appear here' });
  append(gifPlaceholder, gifPlaceholderIcon, gifSpan);
  const gifImg = el('img', { id: 'gif-img', classes: ['gif-img', 'hidden'], attribute: { alt: 'Weather gif' } });
  append(gifCard, gifPlaceholder, gifImg);

  // 5-day forecast
  const forecastWrapper = el('div', {});
  const forecastLabel   = el('div', { classes: ['label'], text: '5-day forecast' });
  forecastLabel.style.marginBottom = '8px';
  const forecastStrip   = el('div', { id: 'forecast-strip', classes: ['forecast-row'] });
  append(forecastWrapper, forecastLabel, forecastStrip);

  append(weatherContent, mainCard, gifCard, forecastWrapper);

  // Error message
  const errorMsg = el('div', { id: 'error-msg', classes: ['error-msg', 'hidden'] });
  const errorIcon = createSVGEl('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '18', height: '18', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor',
    'stroke-width': '1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  });
  append(errorIcon,
    createSVGEl('circle', { cx: '12', cy: '12', r: '10' }),
    createSVGEl('line',   { x1: '12', x2: '12',    y1: '8',  y2: '12' }),
    createSVGEl('line',   { x1: '12', x2: '12.01', y1: '16', y2: '16' })
  );
  const errorText = el('span', { id: 'error-text', text: 'Something went wrong.' });
  append(errorMsg, errorIcon, errorText);

  // Final assembly
  append(page, searchBar, controlRow, loading, weatherContent, errorMsg);

  return page;
}
