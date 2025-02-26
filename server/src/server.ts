import dotenv from 'dotenv';
import express from 'express';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Import the routes
import routes from './routes/index.js';

const app = express();

const port = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
app.use(express.static(path.join(__dirname, '../../client/dist')));
// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });