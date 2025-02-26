import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;
  constructor(name: string, id: string){
    this.name = name;
    this.id = id;
  }
}
// TODO: Complete the HistoryService class
class HistoryService { 
  cities: City[] = [];
private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, '../../../searchHistory.json');
  }

  // TODO: Define a read method that reads from the searchHistory.json file
  async read(): Promise<City[]> {
    try {
        if (!existsSync(this.filePath)) {
            await fs.writeFile(this.filePath, '[]');
            return [];
        }
        const data = await fs.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error(error);
    }
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const data = await this.read();
    return data.map((city: { name: string; id: string }) => new City(city.name, city.id));
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    // This should create a new city with unique ID and add it to cities array
    const newCity = new City(city, Date.now().toString());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const  remainingCities = cities.filter((city: City) => city.id !== id);
    await this.write(remainingCities);
  }
}

export default new HistoryService();
