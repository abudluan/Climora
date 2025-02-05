import React, { useState, useRef } from "react";
import '../styles/home.scss';
import { Container, Button, Form, InputGroup, ListGroup } from 'react-bootstrap';


import { FaSearch } from 'react-icons/fa';

import { fetchWeatherData } from "../services/weatherData";
import { handleCityChange, handleCitySuggestionClick } from '../services/getLocationAPI';
import CardSearched from "../components/cardResult";
import CardsStates from "../components/cardsStates";

import Footer from "../components/footer";

const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [hourlyForecast, setHourlyForecast] = useState(null);
    const [dailyForecast, setDailyForecast] = useState(null);
    const [airQualityData, setAirQualityData] = useState(null);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [lat, setLat] = useState(null);
    const [lon, setLon] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState({
        city: '',
        state: '',
        country: ''
    });

    const inputRef = useRef(null);

    const formatLocationName = (components) => {
        let locationParts = [];

        const cityName = components.city || components.town || components.municipality;
        if (cityName) locationParts.push(cityName);


        const stateName = components.state || components.region || components.province;
        if (stateName) locationParts.push(stateName);

        if (components.country) {
            const country = components.country_code.toUpperCase() === 'BR'
                ? 'Brasil'
                : components.country;
            locationParts.push(country);
        }
        return locationParts.join(', ');
    };

    return (
        <section id="home">
            <Container>
                <Form className='formSearch'>
                    <InputGroup>
                        <Form.Control
                            className="custom-input"
                            ref={inputRef}
                            placeholder="Procure o clima de uma cidade ou país..."
                            value={city}
                            onChange={(e) => {
                                handleCityChange(e, setCity, setSuggestions);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => {
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                        />
                        <Button className='btnSearch' disabled>
                            <FaSearch />
                        </Button>
                    </InputGroup>

                    <div className="mt-2 listSuggests">
                        {showSuggestions && suggestions.length > 0 && (
                            <ListGroup>
                                {suggestions.map((suggestion, index) => {
                                    const components = suggestion.components;
                                    const displayName = formatLocationName(components);

                                    return (
                                        <ListGroup.Item
                                            className="suggests"
                                            key={index}
                                            onClick={() => {
                                                handleCitySuggestionClick(
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
                                                    
                                                );
                                                setShowSuggestions(false);
                                            }}
                                            style={{ cursor: "pointer", borderRadius: 'none' }}
                                        >
                                            {displayName}
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        )}
                    </div>
                </Form>
            </Container>

            <Container>
                {error && <p>{error}</p>}
                {weatherData ? (
                    <CardSearched
                        weatherData={weatherData}
                        hourlyForecast={hourlyForecast}
                        dailyForecast={dailyForecast}
                        selectedLocation={selectedLocation}
                        airQualityData={airQualityData}
                        lat={lat}
                        lon={lon}
                    />
                ) : (
                    <CardsStates />
                )}
            </Container>

            <Footer />
        </section>
    );
};

export default Home;