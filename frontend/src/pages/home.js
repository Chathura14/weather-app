'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Home() {
    const [weather, setWeather] = useState(null);
    const [forecast, setForecast] = useState([]);
    const [news, setNews] = useState([]);
    const [location, setLocation] = useState('Colombo');
    const [loadingNews, setLoadingNews] = useState(false);
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY;
    const NEWS_API_KEY = process.env.NEXT_PUBLIC_NEWS_API_KEY;

    useEffect(() => {
        fetchWeather();
        fetchNews();
    }, []);

    const fetchWeather = async () => {
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`);
            setWeather(res.data);
            fetchForecast();
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    const fetchForecast = async () => {
        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`);
            const forecasts = res.data.list;

            // Group forecasts by day using a specific date format (YYYY-MM-DD)
            const groupedForecasts = {};
            forecasts.forEach((forecast) => {
                const date = new Date(forecast.dt * 1000);
                const formattedDate = date.toISOString().split('T')[0]; // Formats the date as 'YYYY-MM-DD'

                if (!groupedForecasts[formattedDate]) {
                    groupedForecasts[formattedDate] = [];
                }
                groupedForecasts[formattedDate].push(forecast);
            });

            // Get the first forecast for each of the next 7 unique days
            const forecastDays = Object.keys(groupedForecasts).slice(0, 7).map(date => {
                return groupedForecasts[date][0]; // Get the forecast for the first time of each day
            });

            setForecast(forecastDays); // Set the grouped forecast data
        } catch (error) {
            console.error('Error fetching forecast:', error);
        }
    };


    const fetchNews = async () => {
        setLoadingNews(true);
        try {
            const res = await axios.get(`https://newsapi.org/v2/top-headlines?q=weather&apiKey=${NEWS_API_KEY}`);
            setNews(res.data.articles.slice(0, 7)); // Get top 7 news articles
        } catch (error) {
            console.error('Error fetching news:', error);
            setNews([]);
        } finally {
            setLoadingNews(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-white p-6">
            <div className="max-w-6xl mx-auto bg-white text-gray-900 p-6 rounded-3xl shadow-2xl relative">
                <h1 className="text-4xl font-bold text-center mb-4 z-10 relative">🌦️Weather Report</h1>
                <p className="text-center text-xl mb-8 z-10 relative">Get real-time weather updates, forecasts, and global weather news.</p>

                <div className="mt-4 flex justify-center z-10 relative">
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border border-gray-300 rounded-xl p-4 w-3/4 text-lg focus:outline-none"
                        placeholder="Enter city name"
                    />
                    <button onClick={fetchWeather} className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-xl text-lg">Check</button>
                </div>

                {weather && (
                    <div className="text-center mt-8 z-10 relative">
                        <h2 className="text-2xl font-bold">{weather.name}</h2>
                        <p className="text-lg">{weather.weather[0].description}</p>
                        <p className="text-4xl font-semibold">🌡️ {weather.main.temp}°C</p>
                    </div>
                )}

                {forecast.length > 0 && (
                    <div className="mt-8 z-10 relative">
                        <h2 className="text-2xl font-semibold text-center mb-4">Weather Forecast</h2>
                        <div className="grid grid-cols-6 gap-4">
                            {forecast.map((day, index) => (
                                <div key={index} className="bg-gray-800 text-white p-6 rounded-xl shadow-lg text-center transition-transform transform hover:scale-110 hover:shadow-2xl duration-300 ease-in-out">
                                    <p className="font-semibold">{new Date(day.dt_txt).toLocaleDateString()}</p>
                                    <img
                                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                                        alt={day.weather[0].description}
                                        className="mx-auto my-2"
                                    />
                                    <p>{day.weather[0].description}</p>
                                    <p>🌡️ {day.main.temp}°C</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center z-10 relative">
                    <Link href="/register">
                        <button className="bg-green-500 text-white px-8 py-4 rounded-2xl text-lg hover:bg-green-600 transition duration-300">Get Started</button>
                    </Link>
                </div>

                <div className="mt-8 z-10 relative">
                    <h2 className="text-2xl font-semibold text-center mb-4">Latest Weather News</h2>

                    {loadingNews && <p className="text-center text-gray-200">Loading news...</p>}

                    {news.length === 0 && !loadingNews && <p className="text-center text-red-600">Failed to load news. Try again later.</p>}

                    <div className="space-y-6 mt-4">
                        {news.map((article, index) => (
                            <div key={index} className="bg-blue-50 p-6 rounded-xl shadow-lg hover:bg-blue-100 transition duration-300 ease-in-out">
                                <a href={article.url} target="_blank" className="text-2xl font-semibold text-blue-700 hover:underline">{article.title}</a>
                                <p className="text-gray-700 mt-2">{article.description}</p>
                                {article.urlToImage && (
                                    <img src={article.urlToImage} alt={article.title} className="mt-2 w-full h-48 object-cover rounded-lg" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
