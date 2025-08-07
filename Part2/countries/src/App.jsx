import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY

  const fetchWeather = (capital) => {
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`)
    .then(response => {
      setWeather({
        temperature: response.data.main.temp,
        windSpeed: response.data.wind.speed,
        icon: `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
      })
    })
}

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  useEffect(() => {
    if (selectedCountry?.capital?.[0]) {
    fetchWeather(selectedCountry.capital[0])
    }
  }, [selectedCountry])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setSelectedCountry(null) 
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      <div>
        <label>Find countries: </label>
        <input value={filter} onChange={handleFilterChange} />
      </div>

      {filter && (
        <div>
          {filteredCountries.length > 10 ? (
            <p>Too many matches, specify another filter</p>
          ) : filteredCountries.length > 1 ? (
            <ul>
              {filteredCountries.map(country => (
                <li key={country.cca3}>
                  {country.name.common}
                  <button onClick={() => handleShowCountry(country)}>show</button>
                </li>
              ))}
            </ul>
          ) : filteredCountries.length === 1 ? (
            <CountryDetails country={filteredCountries[0]} />
          ) : (
            <p>No countries found</p>
          )}
        </div>
      )}

      {selectedCountry && (
        <CountryDetails country={selectedCountry} weather={weather} />
      )}
    </div>
  )
}

const CountryDetails = ({ country, weather }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital?.[0] || 'N/A'}</p>
      <p>Area: {country.area} km²</p>
      
      <h3>Languages:</h3>
      <ul>
        {country.languages && Object.values(country.languages).map((lang, index) => (
          <li key={index}>{lang}</li>
        ))}
      </ul>
      
      <img 
        src={country.flags?.png} 
        alt={`Flag of ${country.name.common}`} 
        style={{ width: '200px', border: '1px solid #ccc' }}
      />
      {weather && (
        <div className="weather">
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.temperature} °C</p>
          <p>Wind: {weather.windSpeed} m/s</p>
          <img src={weather.icon} alt="Weather icon" />
        </div>
      )}
    </div>
  )
}

export default App