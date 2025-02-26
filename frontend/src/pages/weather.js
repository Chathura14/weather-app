import { useState } from "react";
import { getWeatherData } from "../api";

export default function Weather() {
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState(null);

  const fetchWeather = async () => {
    const data = await getWeatherData(email, date);
    setWeather(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Check Weather</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded mb-2"
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded mb-2"
          required
        />
        <button onClick={fetchWeather} className="bg-green-500 text-white px-4 py-2 rounded">
          Get Weather
        </button>

        {weather && (
          <div className="mt-4 p-4 border rounded bg-gray-200">
            <p><strong>Date:</strong> {date}</p>
            <p><strong>Weather:</strong> {weather.weather}</p>
          </div>
        )}
      </div>
    </div>
  );
}
