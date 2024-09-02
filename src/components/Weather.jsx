import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import sun_icon from '../assets/sun.png'
import storm_icon from '../assets/storm.png'
import snow_icon from '../assets/snow.png'
import rainy_icon from '../assets/rainy.png'
import cloudy_icon from '../assets/cloudy.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'
import moon_icon from '../assets/moon.png'
import mist_icon from '../assets/mist.png'
import drizzle_icon from '../assets/drizzle.png'
import clouds_icon from '../assets/clouds.png'

const Weather = () => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const allIcons = {
    "01d": sun_icon,
    "01n": moon_icon,
    "02d": cloudy_icon,
    "02n": moon_icon,
    "03d": cloudy_icon,
    "03n": clouds_icon,
    "04d": storm_icon,
    "04n": storm_icon,
    "09d": drizzle_icon,
    "09n": drizzle_icon,
    "10d": rainy_icon,
    "10n": rainy_icon,
    "11d": storm_icon,
    "11n": storm_icon,
    "13d": snow_icon,
    "13n": snow_icon,
    "50d": mist_icon,
    "50n": mist_icon,
  };

  const search = async (city) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      const icon = allIcons[data.weather[0].icon] || sun_icon;
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
    } catch (error) {
      setWeatherData(false);
      console.error('Error fetching weather data:', error);
    }
  };

  const getCityByCoordinates = async (latitude, longitude) => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();
      search(data.name);
    } catch (error) {
      console.error('Error fetching city by coordinates:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getCityByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback para uma cidade padrão se a localização falhar
          search("Whitehorse");
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Fallback para uma cidade padrão se a geolocalização não for suportada
      search("Whitehorse");
    }
  }, []);

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          ref={inputRef}
          type='text'
          placeholder='Search'
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              search(inputRef.current.value);
            }
          }}
        />
        <img
          className='search_icon'
          src={search_icon}
          alt=''
          onClick={() => search(inputRef.current.value)}
        />
      </div>
      {weatherData && (
        <>
          <img src={weatherData.icon} alt='' className='weather-icon' />
          <p className='temperature'>{weatherData.temperature}ºc</p>
          <p className='location'>{weatherData.location}</p>
          <div className='weather-data'>
            <div className='col'>
              <img src={humidity_icon} alt='' />
              <div>
                <p>{weatherData.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className='col'>
              <img src={wind_icon} alt='' />
              <div>
                <p>{weatherData.windSpeed}Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
