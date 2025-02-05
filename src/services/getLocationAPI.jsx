import axios from 'axios';

export const handleCityChange = async (e, setCity, setSuggestions) => {
    const input = e.target.value;
    setCity(input);

    if (input.length > 2) {
        try {
            const apiKey = import.meta.env.VITE_GEOCODE_API_KEY;
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${input}&key=${apiKey}&language=pt&limit=5&no_annotations=1&type=city`);
            const filteredResults = response.data.results.filter(result => {
                const components = result.components;
                return components.country || components.city || components.town || components.municipality;
            });

            setSuggestions(filteredResults);
        } catch (err) {
        }
    } else {
        setSuggestions([]);
    }
};

export const handleCitySuggestionClick = async (
    suggestion,
    setSelectedLocation,
    setCity,
    fetchWeatherData,
    setWeatherData,
    setHourlyForecast,
    setDailyForecast,
    setAirQualityData,
    setLat,
    setLon,
    setError
) => {
    const components = suggestion.components;
    
    const cityName = components.city || components.town || components.municipality;
    const stateName = components.state || components.region || components.province;
    const countryCode = components.country_code.toUpperCase();
    const countryName = components.country;

    setSelectedLocation({
        city: cityName || '',
        state: stateName || '',
        country: countryCode,
        countryName: countryName,
        isCountry: !cityName && !stateName && countryName
    });

    let displayParts = [];
    if (cityName) displayParts.push(cityName);
    if (stateName) displayParts.push(stateName);
    if (countryName) {
        displayParts.push(countryCode === 'BR' ? 'Brasil' : countryName);
    }
    
    const displayName = displayParts.join(', ');
    setCity(displayName);

    const lat = suggestion.geometry.lat;
    const lon = suggestion.geometry.lng;

    setLat(lat);
    setLon(lon);
    fetchWeatherData(lat, lon, setWeatherData, setHourlyForecast, setDailyForecast, setAirQualityData, setError);
};