import React, { useEffect, useState } from "react";
import { Row, Col, Card, Spinner } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
import '../styles/cardsStates.scss';

import { capitalizeFirstLetter } from "../uti/forecastWeather";
import { fetchWeatherData } from "../services/weatherData";

import CardSearched from "./cardResult";

const states = [
    { name: "São Paulo", lat: -23.55052, lon: -46.633308, state: "São Paulo", country: "Brasil" },
    { name: "Rio de Janeiro", lat: -22.906847, lon: -43.172897, state: "Rio de Janeiro", country: "Brasil" },
    { name: "Belo Horizonte", lat: -19.924502, lon: -43.935238, state: "Minas Gerais", country: "Brasil" },
    { name: "Brasília", lat: -15.826691, lon: -47.921820, state: "Distrito Federal", country: "Brasil" },
    { name: "Salvador", lat: -12.971399, lon: -38.501221, state: "Bahia", country: "Brasil" },
    { name: "Curitiba", lat: -25.428954, lon: -49.267137, state: "Paraná", country: "Brasil" },
    { name: "Fortaleza", lat: -3.71722, lon: -38.54337, state: "Ceará", country: "Brasil" },
    { name: "Belém", lat: -1.45502, lon: -48.502372, state: "Pará", country: "Brasil" },
    { name: "Porto Alegre", lat: -30.034647, lon: -51.217658, state: "Rio Grande do Sul", country: "Brasil" },
];

const CardsStates = () => {
    const [weatherStates, setWeatherStates] = useState([]);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        AOS.init();
        AOS.refresh();

        const fetchWeatherForStates = async () => {
            const results = await Promise.all(
                states.map(async (state) => {
                    try {
                        const data = {};
                        await fetchWeatherData(
                            state.lat,
                            state.lon,
                            (weatherData) => (data.weather = weatherData),
                            (hourlyForecast) => (data.hourlyForecast = hourlyForecast),
                            (dailyForecast) => (data.dailyForecast = dailyForecast),
                            (airQualityData) => (data.airQualityData = airQualityData),
                            () => { }
                        );
                        return { ...state, ...data };
                    } catch (err) {
                        return { ...state, weather: null };
                    }
                })
            );
            setWeatherStates(results);
        };

        fetchWeatherForStates();
    }, []);

    const handleCardClick = (state) => {
        setSelectedState({
            ...state,
            isCountry: false,
            city: state.name,
            state: state.state,
            countryName: state.country,
            country: "BR",
        });
    };

    return (
        <>
            {selectedState ? (
                <CardSearched
                    weatherData={selectedState.weather}
                    hourlyForecast={selectedState.hourlyForecast}
                    dailyForecast={selectedState.dailyForecast}
                    selectedLocation={selectedState}
                    airQualityData={selectedState.airQualityData}
                />
            ) : (
                <Row>
                    {weatherStates.map((state, index) => (
                        <Col
                            key={index}
                            md={4}
                            className="mb-3"
                            data-aos="fade-down"
                            data-aos-duration="600"
                        >
                            <Card className="cardStates" onClick={() => handleCardClick(state)} style={{ cursor: "pointer" }}>
                                <Card.Body>
                                    <Card.Title>{state.name}</Card.Title>
                                    <Card.Subtitle>
                                        {state.country} <img
                                            className='flag'
                                            src={`https://flagsapi.com/BR/flat/16.png`}
                                            alt="Country Flag"
                                        />
                                    </Card.Subtitle>
                                    {state.weather ? (
                                        <>
                                            <p className="temperature">{state.weather.main.temp.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}°</p>
                                            <h5 className="weatherDescription mb-0">
                                                <img
                                                    src={`http://openweathermap.org/img/wn/${state.weather.weather[0].icon}.png`}
                                                    alt="Weather Icon"
                                                    className='icon'
                                                />
                                                {capitalizeFirstLetter(state.weather.weather[0].description)}
                                            </h5>
                                        </>
                                    ) : (
                                        <Container className="mt-5 d-flex justify-content-center">
                                            <Spinner animation="grow" />;
                                        </Container>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default CardsStates;