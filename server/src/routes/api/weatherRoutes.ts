import { Router } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const { cityname } = req.body;
  // TODO: GET weather data from city name
  const weatherData = await WeatherService.getWeatherData(cityname); 
  await HistoryService.addCity(cityname); // TODO: save city to search history
  return res.json(weatherData);
} catch (error) {
  return res.status(500).json({ error: 'Failed to get weather data' });
}
});


// TODO: GET search history
router.get('/history', async (req, res) => {
  res.json(await HistoryService.getCities());
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const requestedId = Number.parseInt(req.params.id);
  if (requestedId !== -1) {
    HistoryService.removeCity(requestedId.toString());
    return res.json('City deleted');
  }
  return res.json('Not found');
});

export default router;
