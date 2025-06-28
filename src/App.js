import { useEffect, useState } from 'react';
import Normal_weather from './assets/Normal_weather.jpg';
import Hot_weather from './assets/Hot_weather.jpg';
import './components/App.css';
import Descriptions from './components/Descriptions/Descriptions';
import { getFormattedWeatherData } from './weatherService';

function App() {
  const [weather, setWeather] = useState(null);
  const [units, setUnits] = useState('metric');
  const [city, setCity] = useState('Nairobi');
  const [bg, setBg] = useState(Hot_weather);
  const [inputValue, setInputValue] = useState('Nairobi');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getFormattedWeatherData(city, units);

        if (!data || !data.temp) {
          throw new Error("City not found");
        }

        setWeather(data);
        setError(null); 

        const threshold = units === 'metric' ? 20 : 60;
        setBg(data.temp <= threshold ? Normal_weather : Hot_weather);
      } catch (err) {
        setWeather(null);
        setError("City not found. Please try another name.");
      }
    };

    fetchWeatherData();
  }, [units, city]);

  const handleUnitsClick = (e) => {
    const button = e.currentTarget;
    const currentUnit = button.innerText.slice(1);
    const isCelsius = currentUnit === 'C';

    button.innerText = isCelsius ? "°F" : "°C";
    setUnits(isCelsius ? 'metric' : 'imperial');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError(null); 
  };

  const enterKeyPressed = (e) => {
    if (e.keyCode === 13) {
      setCity(e.currentTarget.value);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="overlay">
        {/* Input + Button */}
        <div className="section_inputs">
          <input
            type="text"
            name="city"
            placeholder="Search City..."
            onKeyDown={enterKeyPressed}
            onChange={handleInputChange}
            value={inputValue}
            autoComplete="off"
          />
          <button onClick={handleUnitsClick}>°F</button>
        </div>

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Weather content */}
        {weather && (
          <div className="container">
            <div className="temperature_container">
              <div className="icon">
                <h3>{`${weather.name}, ${weather.country}`}</h3>
                <img src={weather.iconURL} alt="weatherIcon" />
                <h3>{weather.description}</h3>
              </div>

              <div className="temperature">
                <h1>{`${weather.temp.toFixed()} °${units === 'metric' ? 'C' : 'F'}`}</h1>
              </div>
            </div>

            {/* Bottom description */}
            <Descriptions weather={weather} units={units} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
