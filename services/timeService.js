const Time = require('../models/Time');
const axios = require('axios');
const Character = require('../models/Character'); // Assuming you have a Character model
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

const calculateTravelDistance = () => {
  return roll1D10();
}

const postTime = async () => {
  try {

    const timeResponse = await axios.get(`http://localhost:${PORT}/getTimes`);
    const charactersResponse = await axios.get(`http://localhost:${PORT}/characters`);
    const saddleBagResponse = await axios.get(`http://localhost:${PORT}/saddleBags`);
    const preciousStonesResponse = await axios.get(`http://localhost:${PORT}/preciousStones`);

    const times = timeResponse.data;
    const characters = charactersResponse.data;
    const saddleBags = saddleBagResponse.data;
    const preciousStones = preciousStonesResponse.data;

    console.log('Characters:', characters);
    console.log('Times:', times);
    console.log('Saddlebags:', saddleBags);
    console.log('Precious Stones:', preciousStones);
    
    

    const postingTime = times[times.length - 1];
    delete postingTime._id;

    postingTime.day_number++;

    const totalTraveled = await getTotalTraveledKM(times);
    await changeTimeDay(postingTime);

    console.log('Good MORNING fellow Adventurers, today is', postingTime.day_week, 'and the day number is', postingTime.day_number);
    console.log('We have traveled ', totalTraveled, 'km so far.'); 

    console.log('We are at 5:00 AM, time to start our journey');
    console.log('Thalys the benevolent starts the healing process');
    console.log('------------------------------------------------');
    
    
    const restedCharacters = await restCharacters(characters);
    console.log('------------------------------------------------');
    console.log('Recollection starts now!');
    const recollectedCharacters = await recollectionCharacters(restedCharacters, saddleBags, preciousStones);
    console.log('------------------------------------------------');
    console.log('The NOON arrived. Its 12:00PM, time to travel a little bit.');
    
    const travelDistance = calculateTravelDistance();
    postingTime.km_traveled = travelDistance;

    console.log('The party traveled for', travelDistance, 'kms.');
    console.log('------------------------------------------------');
    console.log('EVENING is here. Its 17:00PM, adventurers might go crazy.');
    const updatedCharacters = await jokerRoll(characters);

    // Update all characters in the database
   // await updateCharacters(updatedCharacters);

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

const recollectionCharacters = async (characters, saddlebags, preciousStones) => {
  for (const character of characters) {
    const roll = await roll1D100();
    if (roll >= 1 && roll <= 30) {
      character.equipment.pouch.gold += 1;
      console.log(`${character.name} gains 1 gold.`);
    } else if (roll >= 31 && roll <= 80) {
      const coins = await roll1D20();
      character.equipment.pouch.coins += coins;
      console.log(`${character.name} gains ${coins} coins.`);
    } else if (roll >= 81 && roll <= 100) {
      const preciousStone = await getRandomPreciousStone(preciousStones);
      character.equipment.pouch.precious_stones.push(preciousStone);
      console.log(`${character.name} gains a precious stone: ${preciousStone.name}.`);
    }
    const saddlebag = await getRandomSaddlebag(saddlebags);
    character.equipment.saddlebag.push(saddlebag);
    console.log(`${character.name} gains a saddlebag: ${saddlebag.name}.`);
  }
  return characters;
}

const getRandomSaddlebag = async (saddlebags) => {
  const index = Math.floor(Math.random() * saddlebags.length);
  return saddlebags[index];
}

const getRandomPreciousStone = async (preciousStones) => {
  const index = Math.floor(Math.random() * preciousStones.length);
  return preciousStones[index];
}

const roll1D100 = () => Math.floor(Math.random() * 100) + 1;
const roll1D20 = () => Math.floor(Math.random() * 20) + 1;
const roll1D4 = () => Math.floor(Math.random() * 4) + 1;
const roll1D3 = () => Math.floor(Math.random() * 3) + 1;
const roll1D2 = () => Math.floor(Math.random() * 2) + 1;
const roll1D10 = () => Math.floor(Math.random() * 10) + 1;

const jokerRoll = async (characters) => {
  const orderedCharacters = characters;
  
  const randomIndex = Math.floor(Math.random() * characters.length);
  const firstCharacter = orderedCharacters.splice(randomIndex, 1)[0];

  console.log(`The joker rolled a '${randomIndex}', therefore ${firstCharacter.name} is chosen to act first.`);

  // Execute action for the first character
  await executeCharacterAction(firstCharacter);

  // Sort remaining characters by dexterity in descending order
  orderedCharacters.sort((a, b) => b.stats.dexterity - a.stats.dexterity);

  // Execute actions for the remaining characters
  for (let i = 0; i < orderedCharacters.length; i++) {
    await executeCharacterAction(orderedCharacters[i]);
  }

  // Return the characters after all actions
  return [firstCharacter, ...orderedCharacters];
}

const executeCharacterAction = async (character, characters) => {
  switch (character.occupation) {
    case 'warrior':
      console.log(`${character.name} the warrior attacks with their sword.`);
      break;
    case 'mage':
      console.log(`${character.name} the mage casts a spell.`);
      break;
    case 'gambler':
      console.log(`${character.name} the gambler rolls the dice.`);
      break;
    case 'priest':
      console.log(`${character.name} the priest offers a prayer.`);
      break;
    case 'joker':
      console.log(`${character.name} the joker performs a trick.`);
      break;
    case 'thug':
      console.log(`${character.name} the thug intimidates the enemy.`);
      break;
    case 'peasant':
      console.log(`${character.name} the peasant tends to the fields.`);
      break;
    default:
      console.log(`${character.name} does not know what to do.`);
      break;
  }

  return characters;
}

const updateCharacters = async (characters) => {
  for (const character of characters) {
    await Character.findByIdAndUpdate(character._id, character);
  }
}

module.exports = {
  getAllTimes,
  postTime,
};