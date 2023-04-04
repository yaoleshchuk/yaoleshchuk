const Mustache = require('mustache');
const fs = require('fs');
const axios = require('axios');
const MUSTACHE_MAIN_DIR = './main.mustache';
const OPENWEATHER_API_KEY = 'dc966d561328929c144b72940a6ab7e9';

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

function generateReadMe() {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=Cannes&units=metric&appid=${OPENWEATHER_API_KEY}`
    )
    .then((res) => {
      const weather = {
        temp: res.data.main.temp.toFixed(1),
        description: res.data.weather[0].description,
      };
      DATA.weather = weather;
      fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

generateReadMe();
