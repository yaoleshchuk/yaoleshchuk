const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch');

const MUSTACHE_MAIN_DIR = './main.mustache';

const API_KEY = 'dc966d561328929c144b72940a6ab7e9';

const CITY = 'Cannes';

async function getWeather() {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    const temp = data.main.temp;
    const description = data.weather[0].description;
    return {
      temp,
      description,
    };
  } catch (error) {
    console.log(error);
  }
}

async function generateReadMe() {
  const weather = await getWeather();
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Paris',
  });

  let DATA = {
    name: 'Yaroslav',
    date: date,
    temp: weather.temp,
    description: weather.description,
  };

  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

generateReadMe();
