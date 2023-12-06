import { OpenWeatherAPI } from 'openweather-api-node'

const getCurrentWeather = async (coordinates: {
  latitude: number,
  longitude: number,
}) => {

  const weatherClient = new OpenWeatherAPI({
    key: process.env.OPEN_WEATHER_API_KEY,
    units: 'standard',
    coordinates: {
      lat: coordinates.latitude,
      lon: coordinates.longitude
    }
  });

  const response = await weatherClient.getCurrent();
  console.log(response);
  return response.weather;
};

const getHourlyWeatherForecast = async (coordinates: {
  latitude: number,
  longitude: number,
}) => {
  const weatherClient = new OpenWeatherAPI({
    key: process.env.OPEN_WEATHER_API_KEY,
    units: 'standard',
    coordinates: {
      lat: coordinates.latitude,
      lon: coordinates.longitude
    }
  });

  const response = await weatherClient.getHourlyForecast(5);
  console.log(response);
  const extractedWeatherData = response.map((weatherData) => weatherData.weather);
  return extractedWeatherData;
}

const getDailyWeatherForecast = async (coordinates: {
  latitude: number,
  longitude: number,
}) => {
  const weatherClient = new OpenWeatherAPI({
    key: process.env.OPEN_WEATHER_API_KEY,
    units: 'standard',
    coordinates: {
      lat: coordinates.latitude,
      lon: coordinates.longitude
    }
  });

  const response = await weatherClient.getDailyForecast(5, true);
  console.log(response);
  const extractedWeatherData = response.map((weatherData) => weatherData.weather);
  return extractedWeatherData;
}


export const getWeather = async (args: {
  city?: string,
  coordinates: { latitude: number, longitude: number },
  weather: 'CURRENT' | 'FORECAST',
  forecastType?: 'DAILY' | 'HOURLY'
}) => {

  if (args.weather === 'CURRENT') {
    return await getCurrentWeather(args.coordinates);
  }

  if (args.weather === 'FORECAST') {
    if (!args.forecastType) throw new Error('forecastType is required');

    if (args.forecastType === 'DAILY') {
      return await getDailyWeatherForecast(args.coordinates);
    }

    if (args.forecastType === 'HOURLY') {
      return await getHourlyWeatherForecast(args.coordinates);
    }
  }

  return null;

}
