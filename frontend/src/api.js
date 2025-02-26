import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const addUser = async (email, location) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/add`, { email, location });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error);
    return null;
  }
};

export const updateLocation = async (email, location) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update-location/${email}`, { location });
    return response.data;
  } catch (error) {
    console.error("Error updating location:", error);
    return null;
  }
};

export const getWeatherData = async (email, date) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/weather/${email}/${date}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
