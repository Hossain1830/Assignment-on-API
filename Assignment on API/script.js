const searchInput = document.getElementById('searchInput'); 
const searchBtn = document.getElementById('searchBtn'); 
const countryGrid = document.getElementById('countryGrid'); 
const modalContent = document.getElementById('modalContent');


const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/name/';
const WEATHER_API_URL = 'http://api.weatherapi.com/v1/forecast.json';
const WEATHER_API_KEY = '8ecbf6e4abc94eeaa8b85824240312';


searchBtn.addEventListener('click', async () => {
  const query = searchInput.value.trim();
  if (query) {
    const countries = await fetchCountries(query);
    displayCountries(countries);
  }
});


async function fetchCountries(query) {
  try {
    const response = await fetch(`${REST_COUNTRIES_URL}${query}`); 
    return response.ok ? await response.json() : [];
  } catch (error) {
    console.error('Error fetching country data:', error);
    return [];
  }
}


function displayCountries(countries) {
  countryGrid.innerHTML = '';
  countries.forEach((country) => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card">
        <img src="${country.flags.png}" class="card-img-top" alt="${country.name.common}">
        <div class="card-body">
          <h5 class="card-title">${country.name.common}</h5>
          <p class="card-text">Region: ${country.region}</p>
          <p class="card-text">Population: ${country.population.toLocaleString()}</p>
          <button class="btn btn-primary" onclick="showDetails('${country.name.common}')">More Details</button>
        </div>
      </div>
    `;
    countryGrid.appendChild(col);
  });
}


async function showDetails(countryName) {
  try {
    const response = await fetch(`${REST_COUNTRIES_URL}${countryName}`);
    const [country] = await response.json();

    const weatherResponse = await fetch(
      `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${country.capital[0]}&days=1&aqi=no&alerts=no`);
    const weatherData = await weatherResponse.json();

  
    const currencies = Object.values(country.currencies || {}).map(
      (currency) => `${currency.name} (${currency.symbol})`
    ).join(', ');
    const languages = Object.values(country.languages || {}).join(', ');

  
    modalContent.innerHTML = `
      <div class="row">
        <div class="col-md-6">
          <img src="${country.flags.png}" class="img-fluid" alt="${country.name.common}">
        </div>
        <div class="col-md-6">
          <h4 class="fw-bold"><div class="p-3 mb-2 bg-warning-subtle">${country.name.common}</span></h4> <!-- Wrap the country name with a span with border -->
          <p><strong>Capital:</strong> ${country.capital[0]}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Subregion:</strong> ${country.subregion}</p>
          <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
          <p><strong>Currencies:</strong> ${currencies || 'N/A'}</p>
          <p><strong>Languages:</strong> ${languages || 'N/A'}</p>
          <p><strong>Weather:</strong> ${weatherData.current.temp_c}°C, ${weatherData.current.condition.text}</p>
        </div>
      </div>
    `;

 
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
  } catch (error) {
    console.error('Error fetching country or weather details:', error);
  }
}
