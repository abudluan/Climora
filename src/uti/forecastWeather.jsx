export const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getNext24HourForecast = (hourlyForecast) => {
    return hourlyForecast?.filter((forecast) => {
        const forecastTime = new Date(forecast.dt * 1000);
        const currentTime = new Date();
        const diffInHours = (forecastTime - currentTime) / (1000 * 60 * 60);
        return diffInHours >= 0 && diffInHours <= 24;
    }) || [];
};


export const getWeeklyForecast = (dailyForecast) => {
    const currentDate = new Date().toLocaleDateString('pt-BR');

    if (!dailyForecast) return [];

    const forecastByDate = dailyForecast.reduce((acc, forecast) => {
        const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString('pt-BR');
        const forecastHour = new Date(forecast.dt * 1000).getHours();

        if (!acc[forecastDate]) {
            acc[forecastDate] = forecast;
        } else {
            const existingForecastHour = new Date(acc[forecastDate].dt * 1000).getHours();
            if (Math.abs(forecastHour - 12) < Math.abs(existingForecastHour - 12)) {
                acc[forecastDate] = forecast;
            }
        }

        return acc;
    }, {});

    const result = Object.values(forecastByDate);

    result.sort((a, b) => a.dt - b.dt);

    return result;
};
