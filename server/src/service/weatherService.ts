import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  temp: number;
  wind: number;
  humidity: number;

  constructor(temp: number, wind: number, humidity: number) {
    this.temp = temp;
    this.wind = wind;
    this.humidity = humidity;
  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  baseURL: string;
  APIKey: string;
  cityName: string;

  constructor(
    baseURL: string = "https://api.openweathermap.org/data/3.0", 
    APIKey: string = "d2ce08e75ccc1746161bc125de6ce70f", 
    cityName: string
  ) {
    this.baseURL = baseURL;
    this.APIKey = APIKey;
    this.cityName = cityName;
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.APIKey}`);
    if (!response.ok) throw new Error('Failed to fetch location data');
    const data = await response.json();
    return data;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.APIKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const response = await fetch(this.buildGeocodeQuery());
    if (response.ok) {
        const data = await response.json();
        if (!data || data.length === 0) {
            throw new Error('City not found');
        }
        let cityCoordinates: Coordinates = {
            lat: data[0].lat,  // Access first item in array
            lon: data[0].lon   // Access first item in array
        }
        return this.destructureLocationData(cityCoordinates);
    }
    throw new Error('Failed to fetch location data');
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    throw new Error('Failed to fetch weather data');
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    let currentWeather = new Weather(
      response.temp,
      response.wind_speed,
      response.humidity
    );
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let forecastArray: Weather[] = [currentWeather];
    for (let i = 1; i < 6; i++) {
      let forecastWeather = new Weather(
        weatherData[i].temp,
        weatherData[i].wind_speed,
        weatherData[i].humidity
      );
      forecastArray.push(forecastWeather);
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const cityCoordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(cityCoordinates);
    const currentWeather = this.parseCurrentWeather(weatherData.current);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return forecastArray;
  }

  // Rename method to match what's called in routes
  async getWeatherData(city: string) {
    return this.getWeatherForCity(city);
  }
}

export default new WeatherService();
