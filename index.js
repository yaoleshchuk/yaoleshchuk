// index.js
const Mustache = require('mustache');
const fs = require('fs');
const axios = require('axios');
const MUSTACHE_MAIN_DIR = './main.mustache';
const OPENWEATHER_API_KEY = 'dc966d561328929c144b72940a6ab7e9';

/**
 * DATA is the object that contains all
 * the data to be provided to Mustache
 * Notice the "name" and "date" property.
 */
let DATA = {
    name: 'Yaroslav',
    date: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
        timeZone: 'Europe/Paris',
    }),
};

/**
 * A - We open 'main.mustache'
 * B - We ask Mustache to render our file with the data
 * C - We create a README.md file with the generated output
 */
function generateReadMe() {
    // Get weather data
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Cannes&units=metric&appid=${OPENWEATHER_API_KEY}`)
        .then(res => {
            const weather = {
                temp: res.data.main.temp,
                description: res.data.weather[0].description
            };
            // Update DATA object with weather data
            DATA.weather = weather;

            // Render template with updated DATA object
            fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
                if (err) throw err;
                const output = Mustache.render(data.toString(), DATA);
                fs.writeFileSync('README.md', output);
            });
        })
        .catch(err => {
            console.error(err);
        });
}

generateReadMe();
