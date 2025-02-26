// weatherService.js
const axios = require('axios');

const getWeather = async (location) => {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHERMAP_API_KEY}&units=metric`;
    const response = await axios.get(apiUrl);
    return response.data; // Return weather data
  } catch (error) {
    console.error(`Error fetching weather data for ${location}:`, error);
    throw error; // Throw error for handling
  }
};


module.exports = { getWeather };
