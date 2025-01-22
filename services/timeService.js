const Time = require('../models/Time');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const getAllTimes = async () => {
  try {
    const times = await Time.find();

    return times;
  } catch (error) {
    throw new Error('Error fetching times: ' + error.message);
  }
}

const postTime = async () => {
  try {

    const timeResponse = await axios.get(`http://localhost:${PORT}/getTimes`);
    const charactersResponse = await axios.get(`http://localhost:${PORT}/characters`);

    const times = timeResponse.data;
    const characters = charactersResponse.data;

    console.log('Characters:', characters);
    console.log('Times:', times);

    const postingTime = times[times.length - 1];
    delete postingTime._id;

    postingTime.day_number++;

    const totalTraveled = await getTotalTraveledKM(times);
    await changeTimeDay(postingTime);

    console.log('Good Morning fellow Adventurers, today is', postingTime.day_week, 'and the day number is', postingTime.day_number);
    console.log('We have traveled ', totalTraveled, 'km so far.'); 

    console.log('We are at 5:00 AM, time to start our journey');
    console.log('Thalys the benevolent starts the healing process');
    console.log('------------------------------------------------');
    
    
    const restedCharacters = await restCharacters(characters);
    console.log('------------------------------------------------');
    console.log('Recollection starts now!');
    
    postingTime.km_total = totalTraveled + postingTime.km_traveled;


    



    const newTime = new Time(postingTime); // Adjusted to access the correct object
    const savedTime = await newTime.save();

    return savedTime;

  } catch (error) {
    console.error('Error posting times:', error.message);
  }


}

const getTotalTraveledKM = async (times) => {
  let totalTraveled = 0;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    console.log(time.km_traveled);
    
    totalTraveled += time.km_traveled;
  }

  console.log('TOTAL TRAVELED');
  console.log(totalTraveled);
  
  return totalTraveled;
}

const changeTimeDay = async (time) => {
  switch (time.day_week) {
    case 'Monday':
      time.day_week = 'Tuesday';
      break;
    case 'Tuesday':
      time.day_week = 'Wednesday';
      break;
    case 'Wednesday':
      time.day_week = 'Thursday';
      break;
    case 'Thursday':
      time.day_week = 'Friday';
      break;
    case 'Friday':
      time.day_week = 'Saturday';
      break;
    case 'Saturday':
      time.day_week = 'Sunday';
      break;
    case 'Sunday':
      time.day_week = 'Monday';
      break;
    default:
      throw new Error('Invalid day of the week');
  }
  return time;
}

const restCharacters = async (characters) => {
  characters.forEach(character => {
    const points = Math.floor(Math.random() * 2) + 1; // Random 1 or 2 points
    const attribute = Math.random() < 0.5 ? 'strength' : 'dexterity'; // Random choose attribute
    character[attribute] += points;
    console.log(`${character.name} gains ${points} ${attribute} points.`);
  });
  return characters;
}

const recollectionCharacters = async (characters) => {
  characters.forEach(character => {
    const roll = roll1D100();
    if (roll >= 1 && roll <= 30) {
      character.equipment.pouch.gold += 1;
      console.log(`${character.name} gains 1 gold.`);
    } else if (roll >= 31 && roll <= 80) {
      const coins = roll1D20();
      character.equipment.pouch.coins += coins;
      console.log(`${character.name} gains ${coins} coins.`);
    } else if (roll >= 81 && roll <= 100) {
      // Handle this case later
    }
  });
  return characters;
}

const roll1D100 = () => Math.floor(Math.random() * 100) + 1;
const roll1D20 = () => Math.floor(Math.random() * 20) + 1;
const roll1D4 = () => Math.floor(Math.random() * 4) + 1;
const roll1D3 = () => Math.floor(Math.random() * 3) + 1;
const roll1D2 = () => Math.floor(Math.random() * 2) + 1;
const roll1D10 = () => Math.floor(Math.random() * 10) + 1;

module.exports = {
  getAllTimes,
  postTime,

};