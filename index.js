#!/usr/bin/env node
import Mustache from 'mustache';
import fs from 'fs';
import axios from 'axios';

const MUSTACHE_MAIN_DIR = './main.mustache';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY!;

interface IData {
  name: string;
  date: string;
  weather?: {
    temp: string;
    description: string;
  }
}

const generateReadMe = () => {
  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Cannes&units=metric&appid=${OPENWEATHER_API_KEY}`)
    .then((res) => {
      const weather = {
        temp: res.data.main.temp.toFixed(1),
        description: res.data.weather[0].description,
      };
      const DATA: IData = {
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
        weather,
      };
      fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

generateReadMe();
