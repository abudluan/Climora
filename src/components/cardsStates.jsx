import React, { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import "../styles/cardsStates.scss";

import { fetchWeatherData } from "../services/weatherData";
import CardResult from "./cardResult";

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
    const [selectedState, setSelectedState] = useState(null);
    const [loading, setLoading] = useState(true);

    // Pegar localização do usuário ou cidade aleatória
    useEffect(() => {
        const fetchUserLocation = async () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setSelectedState({ lat: latitude, lon: longitude });
                    },
                    () => {
                        // Usuário negou permissão: escolher cidade aleatória
                        const randomState = states[Math.floor(Math.random() * states.length)];
                        setSelectedState({ ...randomState });
                    }
                );
            } else {
                // Geolocalização não suportada: escolher cidade aleatória
                const randomState = states[Math.floor(Math.random() * states.length)];
                setSelectedState({ ...randomState });
            }
        };

        fetchUserLocation();
    }, []);

    // Buscar dados do clima assim que a localização estiver disponível
    useEffect(() => {
        if (!selectedState) return;

        const fetchWeatherForLocation = async () => {
            setLoading(true);
            try {
                const data = {};
                await fetchWeatherData(
                    selectedState.lat,
                    selectedState.lon,
                    (weatherData) => (data.weather = weatherData),
                    (hourlyForecast) => (data.hourlyForecast = hourlyForecast),
                    (dailyForecast) => (data.dailyForecast = dailyForecast),
                    (airQualityData) => (data.airQualityData = airQualityData),
                    () => { }
                );

                // Ajustar dados para CardResult
                setSelectedState((prev) => ({
                    ...prev,
                    isCountry: false,
                    city: data.weather?.name || prev.name || "Sua localização",
                    state: prev.state || "",
                    countryName: prev.country || "BR",
                    country: "BR",
                    ...data,
                }));
            } catch (err) {
                console.error("Erro ao buscar dados do clima:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherForLocation();
    }, [selectedState?.lat, selectedState?.lon]);

    return (
        <Container className="mt-4">
            {loading || !selectedState ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="light" />
                </div>
            ) : (
                <CardResult
                    weatherData={selectedState.weather}
                    hourlyForecast={selectedState.hourlyForecast}
                    dailyForecast={selectedState.dailyForecast}
                    selectedLocation={selectedState}
                    airQualityData={selectedState.airQualityData}
                />
            )}
        </Container>
    );
};

export default CardsStates;
