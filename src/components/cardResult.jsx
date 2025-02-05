import React from "react";
import { Card, Row, Col, Container } from 'react-bootstrap';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/cardResult.scss';

import { PiThermometer } from "react-icons/pi";
import { LiaWindSolid } from "react-icons/lia";
import { WiHumidity } from "react-icons/wi";
import { IoRainySharp } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { FaRegCalendar } from "react-icons/fa6";
import { MdAir } from "react-icons/md";

import { capitalizeFirstLetter, getNext24HourForecast, getWeeklyForecast } from "../uti/forecastWeather";

const cardResult = ({ weatherData, hourlyForecast, dailyForecast, selectedLocation, airQualityData, lat, lon }) => {

    const categorizeAirQuality = (aqi) => {
        let color = '';
        let description = '';

        if (aqi === 1) {
            color = 'green';
            description = 'Boa';
        } else if (aqi === 2) {
            color = 'yellow';
            description = 'Moderada';
        } else if (aqi === 3) {
            color = 'orange';
            description = 'Ruim';
        } else if (aqi === 4) {
            color = 'brown';
            description = 'Muito Ruim';
        } else if (aqi === 5) {
            color = 'red';
            description = 'Perigosa';
        }

        return { color, description };
    };


    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 2,
    };

    return (
        <Container>
            {weatherData && (
                <Card className="cardResult">
                    <Row>
                        <Col sm={5} className="leftCol">
                            <h4 className="text-center mt-4">
                                {selectedLocation.isCountry ? (
                                    selectedLocation.countryName
                                ) : (
                                    [
                                        selectedLocation.city,
                                        selectedLocation.state,
                                        selectedLocation.countryName
                                    ].filter(Boolean).join(', ')
                                )}{" "}
                                <img
                                    className='flag'
                                    src={`https://flagsapi.com/${selectedLocation.country}/flat/32.png`}
                                    alt="Country Flag"
                                />
                            </h4>

                            <p className="temperature mt-0">
                                {weatherData.main.temp.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<sup>°C</sup>
                            </p>

                            <Row className="scientificTemp">
                                <Col className="border-end">
                                    <p>
                                        {weatherData.main.temp.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<sup>°C</sup>
                                    </p>
                                </Col>
                                <Col className="border-end">
                                    <p>
                                        {((weatherData.main.temp * 9 / 5) + 32).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<sup>°F</sup>
                                    </p>
                                </Col>
                                <Col>
                                    <p>
                                        {(weatherData.main.temp + 273.15).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} K
                                    </p>
                                </Col>
                            </Row>

                            <Card className="mb-4 weatherDescription">
                                <h5>
                                    <img
                                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                                        alt="Weather Icon"
                                        className='icon'
                                    />
                                    {capitalizeFirstLetter(weatherData.weather[0].description)}
                                </h5>
                            </Card>

                            <Row g={3}>
                                <Col xs={12} md={6} className="mb-4">
                                    <Card className="cardStatus">
                                        <p className="CardTitle">
                                            <PiThermometer className="me-1" size={25} /> {" "}
                                            Sensação Térmica
                                        </p>
                                        <p className="infoCard">
                                            {weatherData.main.feels_like.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<sup>°C</sup>
                                        </p>
                                    </Card>
                                </Col>

                                <Col xs={12} md={6} className="mb-4">
                                    <Card className="cardStatus">
                                        <p className="CardTitle">
                                            <LiaWindSolid className="me-1" size={25} /> {" "}
                                            Velocidade do Vento
                                        </p>

                                        <p className="infoCard">
                                            {weatherData.wind.speed.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} m/s
                                        </p>
                                    </Card>
                                </Col>

                                <Col xs={12} md={6} className="mb-4">
                                    <Card className="cardStatus">
                                        <p className="CardTitle">
                                            <WiHumidity className="me-1" size={25} />
                                            Umidade
                                        </p>
                                        <p className="infoCard">
                                            {weatherData.main.humidity}%
                                        </p>
                                    </Card>
                                </Col>

                                <Col xs={12} md={6} className="mb-4">
                                    <Card className="cardStatus">
                                        <p className="CardTitle">
                                            <IoRainySharp className="me-1" size={25} /> {" "}
                                            Risco de Chuva
                                        </p>
                                        <p className="infoCard">
                                            {weatherData.clouds.all}%
                                        </p>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>

                        <Col sm={7} className="rightCol">
                            <Card className="cardForecast">
                                <p className="forecastTitle">
                                    <GoClock className="me-2" size={20} />
                                    Previsão para as próximas 24 horas
                                </p>
                                <Slider {...settings}>
                                    {getNext24HourForecast(hourlyForecast).map((forecast, index) => (
                                        <div key={index} className="px-2">
                                            <Card className="cardsHour text-center">
                                                <p className="mt-3 mb-0">
                                                    {new Date(forecast.dt * 1000).toLocaleTimeString('pt-BR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                                <p className="forecastTemp mb-0">
                                                    {forecast.main.temp.toLocaleString('pt-BR', {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 0,
                                                    })}<sup>°C</sup>
                                                </p>
                                                <img
                                                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                                    alt="Weather Icon"
                                                    className="icon mx-auto"
                                                />
                                            </Card>
                                        </div>
                                    ))}
                                </Slider>
                            </Card>

                            <Card className="cardForecast mt-3">
                                <p className="forecastTitle">
                                    <FaRegCalendar className="me-2" size={20} />
                                    Previsão para os próximos 5 dias
                                </p>
                                <Slider {...settings}>
                                    {getWeeklyForecast(dailyForecast).map((forecast, index) => (
                                        <div key={index}>
                                            <div className="px-2">
                                                <Card className="cardsDay">
                                                    <p className="mt-3 mb-0">
                                                        {new Date(forecast.dt * 1000).toLocaleDateString('pt-BR', { weekday: 'short' })}
                                                    </p>

                                                    <p className="forecastTemp mb-0">
                                                        {forecast.main.temp.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<sup>°C</sup>
                                                    </p>

                                                    <img
                                                        src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                                        alt="Weather Icon"
                                                        className="forecastIcon mx-auto"
                                                    />
                                                </Card>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </Card>

                            <Card className="cardForecast mt-3">
                                <p className="forecastTitle">
                                    <MdAir className="me-2" size={20} />
                                    Qualidade do Ar
                                </p>


                                <Row>
                                    <Col xs={12} md={6} className="mb-4">
                                        <Card className="cardAir">
                                            <p className="mt-3">Índice de Qualidade do Ar (AQI)</p>
                                            <div >
                                                <div
                                                    className="airQualityBall"
                                                    style={{ backgroundColor: airQualityData?.main.aqi ? categorizeAirQuality(airQualityData.main.aqi).color : 'gray' }}
                                                />
                                                <p className="airQualityText">
                                                    {airQualityData?.main.aqi ? categorizeAirQuality(airQualityData.main.aqi).description : 'Sem informações'}
                                                </p>
                                            </div>
                                        </Card>
                                    </Col>
                                    <Col xs={12} md={6} className="mb-4">
                                        <Card className="cardPoluition">
                                            <p className="mt-3">Níveis de Poluentes</p>
                                            <ul>
                                                <li>PM2.5: {airQualityData?.components.pm2_5 || 'Sem informações'} µg/m³</li>
                                                <li>PM10: {airQualityData?.components.pm10 || 'Sem informações'} µg/m³</li>
                                                <li>CO: {airQualityData?.components.co || 'Sem informações'} µg/m³</li>
                                                <li>NO₂: {airQualityData?.components.no2 || 'Sem informações'} µg/m³</li>
                                                <li>SO₂: {airQualityData?.components.so2 || 'Sem informações'} µg/m³</li>
                                                <li>O₃: {airQualityData?.components.o3 || 'Sem informações'} µg/m³</li>
                                            </ul>
                                        </Card>
                                    </Col>
                                </Row>

                            </Card>


                        </Col>
                    </Row>
                </Card>
            )}
        </Container>
    );
};

export default cardResult;