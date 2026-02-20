const fs = require('fs');
require('dotenv').config(); // Carga las variables del .env

// Aquí definimos la ruta del archivo que Angular usa
const targetPath = './src/app/core/env/env.dev.ts';

// Construimos el contenido del archivo con la variable inyectada
const envConfigFile = `export const API = {
  baseUrl: '${process.env.DOMAIN}',
  showLog: ${process.env.SHOW_LOG === 'true'},
};

export const GOOGLE_MAPS = {
  apiKey: '${process.env.MAP_KEY}',
  geolocationApiKey: '${process.env.GEOLOCATION_KEY}',
  geocodingApiKey: '${process.env.GEOCODING_KEY}',
};
`;

// Escribimos el archivo físicamente
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.error(err);
  } else {
    console.log(`Variables de entorno generadas en ${targetPath}`);
  }
});
