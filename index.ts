const Mustache = require('mustache');
const fs = require('fs');
const axios = require('axios');

const MUSTACHE_MAIN_DIR = './main.mustache';

interface WeatherData {
  name: string;
  description: string;
  temp: number;
  feelsLike: number;
}

interface MustacheData {
  name: string;
  date: string;
  weather: WeatherData;
}

const generateReadMe = async (): Promise<void> => {
  const date = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Paris',
  });

  const weather = await getWeather();

  const data: MustacheData = {
    name: 'Yaroslav',
    date: date,
    weather: weather,
  };

  fs.readFile(MUSTACHE_MAIN_DIR, (err, file) => {
    if (err) {
      console.error(err);
      return;
    }

    const output = Mustache.render(file.toString(), data);
    fs.writeFileSync('README.md', output);
  });
};

const getWeather = async (): Promise<WeatherData> => {
  const city = 'Cannes';
  const apiKey = 'dc966d561328929c144b72940a6ab7e9';
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const { name, weather, main } = response.data;
    return {
      name: name,
      description: weather[0].description,
      temp: main.temp,
      feelsLike: main.feels_like,
    };
  } catch (error) {
    console.error(error);
    return {
      name: 'Unknown',
      description: 'Unknown',
      temp: 0,
      feelsLike: 0,
    };
  }
};

generateReadMe();
