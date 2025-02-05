import axios from 'axios';

export const fetchWeatherData = async (lat, lon, setWeatherData, setHourlyForecast, setDailyForecast, setAirQualityData, setError) => {
    if (!lat || !lon) return;

    try {
        const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;

        const weatherResponse = await axios.get(weatherUrl);

        setWeatherData(weatherResponse.data);
        setError(null);

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
        const forecastResponse = await axios.get(forecastUrl);
        setHourlyForecast(forecastResponse.data.list.slice(0, 32));
        setDailyForecast(forecastResponse.data.list);

        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const airQualityResponse = await axios.get(airQualityUrl);
        setAirQualityData(airQualityResponse.data.list[0]); // Armazena apenas o primeiro item
        setError(null);
    } catch (err) {
        setError("Não foi possível encontrar o clima para esta localização.");
        setWeatherData(null);
        setHourlyForecast(null);
    }
};