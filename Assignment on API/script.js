const searchInput = document.getElementById('searchInput'); 
const searchBtn = document.getElementById('searchBtn'); 
const countryGrid = document.getElementById('countryGrid'); 

const REST_COUNTRIES_URL = 'https://restcountries.com/v3.1/name/';
const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json';
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
    col.className = 'col-12';
    col.innerHTML = `
      <div class="card-container">
        <div class="card">
          <img src="${country.flags.png}" class="card-img-top" alt="${country.name.common}">
          <div class="card-body">
            <h5 class="card-title">${country.name.common}</h5>
            <p class="card-text">Region: ${country.region}</p>
            <p class="card-text">Population: ${country.population.toLocaleString()}</p>
            <button class="btn btn-primary" onclick="showDetails('${country.name.common}', this)">More Details</button>
          </div>
        </div>
        <div class="details-container"></div>
      </div>
    `;
    countryGrid.appendChild(col);
  });
}

async function showDetails(countryName, button) {
  try {
    const response = await fetch(`${REST_COUNTRIES_URL}${countryName}`);
    const [country] = await response.json();

    const weatherResponse = await fetch(
      `${WEATHER_API_URL}?key=${WEATHER_API_KEY}&q=${country.capital[0]}&days=1&aqi=no&alerts=no`
    );
    const weatherData = await weatherResponse.json();

    const currencies = Object.values(country.currencies || {}).map(
      (currency) => `${currency.name} (${currency.symbol})`
    ).join(', ');
    const languages = Object.values(country.languages || {}).join(', ');

    const detailsContainer = button.closest('.card-container').querySelector('.details-container');
    detailsContainer.innerHTML = `
      <div>
        <p class="text-light bg-dark"><strong>Capital:</strong> ${country.capital[0]}</p>
        <p class="text-light bg-dark"><strong>Region:</strong> ${country.region}</p>
        <p class="text-light bg-dark"><strong>Subregion:</strong> ${country.subregion}</p>
        <p class="text-light bg-dark"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p class="text-light bg-dark"><strong>Currencies:</strong> ${currencies}</p>
        <p class="text-light bg-dark"><strong>Languages:</strong> ${languages}</p>
        <p class="text-light bg-dark"><strong>Weather:</strong> ${weatherData.current.temp_c}°C, ${weatherData.current.condition.text}</p>
      </div> 
      `;

    detailsContainer.classList.add('show');
  } catch (error) {
    console.error('Error fetching country or weather details:', error);
  }
}
