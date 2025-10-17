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
        <div>
            {weatherData && (
                <Row>
                    <Col sm={7} className="leftCol">

                        <div className="leftCol1">
                            <Row className="align-items-center" style={{ height: '100%' }}>
                                <Col md={6}>
                                    <h4 className="nameLocal d-flex align-items-center gap-2">
                                        {selectedLocation.isCountry ? (
                                            selectedLocation.countryName
                                        ) : (
                                            [selectedLocation.city, selectedLocation.countryName].filter(Boolean).join(', ')
                                        )}

                                        <img
                                            className="flag"
                                            src={`https://flagsapi.com/${selectedLocation.country}/flat/32.png`}
                                            alt="Country Flag"
                                        />
                                    </h4>

                                    <h5>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                                            alt="Weather Icon"
                                            className='icon'
                                        />
                                        {capitalizeFirstLetter(weatherData.weather[0].description)}
                                    </h5>
                                </Col>

                                <Col md={6}>
                                    <p className="temperature mt-0">
                                        {weatherData.main.temp.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<sup>°</sup>
                                    </p>

                                </Col>
                            </Row>
                        </div>


                        <Row>
                            <Col xs={6} md={3} className="mb-4">
                                <Card className="cardStatus">
                                    <p className="CardTitle">
                                        <PiThermometer className="me-1" size={25} /> {" "}
                                        Sensação Térmica
                                    </p>
                                    <p className="textInfoCard">
                                        {weatherData.main.feels_like.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}<sup>°</sup>
                                    </p>
                                </Card>
                            </Col>

                            <Col xs={6} md={3} className="mb-4">
                                <Card className="cardStatus">
                                    <p className="CardTitle">
                                        <LiaWindSolid className="me-1" size={25} /> {" "}
                                        Velocidade do Vento
                                    </p>

                                    <p className="textInfoCard">
                                        {weatherData.wind.speed.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} m/s
                                    </p>
                                </Card>
                            </Col>

                            <Col xs={6} md={3} className="mb-4">
                                <Card className="cardStatus">
                                    <p className="CardTitle">
                                        <WiHumidity className="me-1" size={25} />
                                        Umidade
                                    </p>
                                    <p className="textInfoCard">
                                        {weatherData.main.humidity}%
                                    </p>
                                </Card>
                            </Col>

                            <Col xs={6} md={3} className="mb-4">
                                <Card className="cardStatus">
                                    <p className="CardTitle">
                                        <IoRainySharp className="me-1" size={25} /> {" "}
                                        Risco de Chuva
                                    </p>
                                    <p className="textInfoCard">
                                        {weatherData.clouds.all}%
                                    </p>
                                </Card>
                            </Col>
                        </Row>

                        <Card className="cardNextDays mt-3">
                            <p className="forecastTitle">
                                Previsão para os próximos dias
                            </p>

                            <Row>
                                {getWeeklyForecast(dailyForecast).map((forecast, index) => {
                                    const date = new Date(forecast.dt * 1000);
                                    const dayName = date.toLocaleDateString('pt-BR', { weekday: 'short' });

                                    return (
                                        <Col key={index} xs={6} sm={4} md={2}>
                                            <Card className="cardsDay mb-4">
                                                <p className="mt-2 mb-0 text-center">{dayName}</p>
                                                <img
                                                    src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                                    alt="Weather Icon"
                                                    className="forecastIcon mx-auto"
                                                />
                                                <p className="forecastTemp mb-1">
                                                    <span className="tempMax">
                                                        {forecast.main.temp_max.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}°
                                                    </span>
                                                    <span className="tempMin">
                                                        {forecast.main.temp_min.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}°
                                                    </span>
                                                </p>

                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Card>
                    </Col>

                    <Col sm={5} className="rightCol">
                        <Card className="cardTimeForecast">
                            <p className="forecastTitle">
                                Previsão para o resto do dia
                            </p>
                            {getNext24HourForecast(hourlyForecast).map((forecast, index) => (
                                <div key={index} >
                                    <Card className="cardsHour text-center mb-2">
                                        <div className="d-flex align-items-center px-2 py-1" style={{ gap: '6px' }}>
                                            <img
                                                src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                                                alt="Weather Icon"
                                                style={{ width: 35, height: 35 }}
                                            />

                                            <p className="mb-0">
                                                {new Date(forecast.dt * 1000).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>

                                            <p className="mb-0 ms-auto">
                                                {forecast.main.temp.toLocaleString('pt-BR', {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}
                                                <sup>°C</sup>
                                            </p>
                                        </div>
                                    </Card>


                                </div>
                            ))}
                        </Card>



                        <Card className="cardAirQuality mt-3">
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
            )}
        </div>
    );
};

export default cardResult;