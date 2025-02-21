import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
  private async read() {
    try {
        if (!fs.existsSync(this.filePath)) {
            await fs.promises.writeFile(this.filePath, '[]');
            return [];
        }
        const data = await fs.promises.readFile(this.filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return [];
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.promises.writeFile(this.filePath, JSON.stringify(cities, null, 2));
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
    const newCity = new City(city, Date.now().toString());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const removeCities = cities.filter((city: City) => city.id !== id);
    await this.write(removeCities);
  }
}

export default new HistoryService();
