import { OpenWeatherAPI } from 'openweather-api-node'


const getLatitudeAndLongitudeFromCityName = async (city: string) => {
  const weatherClient = new OpenWeatherAPI({
    key: process.env.OPEN_WEATHER_API_KEY,
    units: 'standard',
  });

  const response = await weatherClient.getLocation({
    locationName: city
  });
  console.log(response);
  return response;
}


const getCityNameFromLatitudeAndLongitude = async (latitude: number, longitude: number) => {
  const weatherClient = new OpenWeatherAPI({
    key: process.env.OPEN_WEATHER_API_KEY,
    units: 'standard',
  });

  const response = await weatherClient.getLocation({
    coordinates: {
      lat: latitude,
      lon: longitude
    }
  });
  console.log(response);
  return response;
}


export const getLocation = async (args: { city?: string, coordinates?: { lat: number, lon: number } }) => {

  if (args.city && !args.coordinates) {
    return await getLatitudeAndLongitudeFromCityName(args.city);
  }
  if (args.coordinates && !args.city) {
    return await getCityNameFromLatitudeAndLongitude(args.coordinates.lat, args.coordinates.lon);
  }

  if (args.city && args.coordinates) return await getCityNameFromLatitudeAndLongitude(args.coordinates.lat, args.coordinates.lon);

  if (!args.city && !args.coordinates) return null;
}
