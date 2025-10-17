import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import "../styles/cardsStates.scss";

import { fetchWeatherData } from "../services/weatherData";
import CardResult from "./cardResult";

const states = [
  { name: "São Paulo", lat: -23.55052, lon: -46.633308, state: "São Paulo", country: "Brasil" },
  { name: "Rio de Janeiro", lat: -22.906847, lon: -43.172897, state: "Rio de Janeiro", country: "Brasil" },
  { name: "Belo Horizonte", lat: -19.924502, lon: -43.935238, state: "Minas Gerais", country: "Brasil" },
  { name: "Brasília", lat: -15.826691, lon: -47.92182, state: "Distrito Federal", country: "Brasil" },
  { name: "Salvador", lat: -12.971399, lon: -38.501221, state: "Bahia", country: "Brasil" },
  { name: "Curitiba", lat: -25.428954, lon: -49.267137, state: "Paraná", country: "Brasil" },
  { name: "Fortaleza", lat: -3.71722, lon: -38.54337, state: "Ceará", country: "Brasil" },
  { name: "Belém", lat: -1.45502, lon: -48.502372, state: "Pará", country: "Brasil" },
  { name: "Porto Alegre", lat: -30.034647, lon: -51.217658, state: "Rio Grande do Sul", country: "Brasil" },
];

const CardsStates = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pega localização do usuário (ou escolhe cidade aleatória se negar)
  useEffect(() => {
    const fetchUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
          },
          () => {
            // Usuário negou permissão: cidade aleatória
            const randomState = states[Math.floor(Math.random() * states.length)];
            setUserLocation({ lat: randomState.lat, lon: randomState.lon });
          }
        );
      } else {
        // Sem suporte de geolocalização
        const randomState = states[Math.floor(Math.random() * states.length)];
        setUserLocation({ lat: randomState.lat, lon: randomState.lon });
      }
    };

    fetchUserLocation();
  }, []);

  // Busca o clima apenas quando a localização está disponível
  useEffect(() => {
    if (!userLocation) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const data = {};
        await fetchWeatherData(
          userLocation.lat,
          userLocation.lon,
          (weather) => (data.weather = weather),
          (hourly) => (data.hourlyForecast = hourly),
          (daily) => (data.dailyForecast = daily),
          (air) => (data.airQualityData = air),
          () => {}
        );
        setWeatherData(data);
      } catch (e) {
        console.error("Erro ao buscar dados do clima:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [userLocation]);

  return (
    <div>
      {loading || !weatherData ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="light" />
        </div>
      ) : (
        <CardResult
          weatherData={weatherData.weather}
          hourlyForecast={weatherData.hourlyForecast}
          dailyForecast={weatherData.dailyForecast}
          selectedLocation={{
            ...userLocation,
            isCountry: false,
            city: weatherData.weather?.name || "Sua localização",
            state: "",
            countryName: "Brasil",
            country: "BR",
          }}
          airQualityData={weatherData.airQualityData}
        />
      )}
    </div>
  );
};

export default CardsStates;
