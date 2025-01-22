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
    console.log('------------------------------------------------');
    const charactersWithReducedStamina = reduceStamina(updatedCharacters, postingTime.day_week);
    console.log('------------------------------------------------');
    console.log('The NIGHT has come. Its 22:00PM. Adventurers prepare a campfire and will camp till the next morning.');
    const charactersAfterNightAction = await executeNightAction(charactersWithReducedStamina);
    console.log('------------------------------------------------');
    console.log('The day has come to an end. All adventurers went to sleep.');
    
    // Update all characters in the database
    await updateCharacters(charactersWithReducedStamina);

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
    character.stats[attribute] += points;
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
  await executeCharacterAction(firstCharacter, characters);

  // Sort remaining characters by dexterity in descending order
  orderedCharacters.sort((a, b) => b.stats.dexterity - a.stats.dexterity);

  // Execute actions for the remaining characters
  for (let i = 0; i < orderedCharacters.length; i++) {
    await executeCharacterAction(orderedCharacters[i], characters);
  }

  // Return the characters after all actions
  return [firstCharacter, ...orderedCharacters];
}

const executeCharacterAction = async (character, characters) => {

  const targetIndex = Math.floor(Math.random() * (characters.length - 1));
  const target = characters[targetIndex >= characters.indexOf(character) ? targetIndex + 1 : targetIndex];
  const roll = roll1D100();

  switch (character.occupation) {
    case 'warrior':
      console.log(`${character.name} the warrior prepares to attack.`);

      if (roll < character.stats.dexterity) {
        if (character.equipment.weapons[0].quality > 0) {
          const numDieDamage = character.equipment.weapons[0].num_die_damage;
          const weaponDamage = rollND4(numDieDamage) + Math.ceil(character.equipment.weapons[0].quality / 5);
          const totalDamage = weaponDamage + Math.ceil(character.stats.dexterity / 4);
          target.stats.strength -= totalDamage;
          console.log(`${character.name} attacks ${target.name} dealing ${totalDamage} damage.`);
        } else {
          console.log(`${character.name} attacks ${target.name} dealing 0 damage because of the quality.`);
        }
      } else {
        console.log(`${character.name} misses the attack.`);
      }
      break;
    case 'mage':
      console.log(`${character.name} the mage is about to cast a spell.`);

      if (roll < character.stats.dexterity) {
        if (character.equipment.weapons[0].quality > 0) {
          const numDieDamage = character.equipment.weapons[0].num_die_damage;
          const weaponDamage = rollND4(numDieDamage) + Math.ceil(character.equipment.weapons[0].quality / 5);
          const totalDamage = weaponDamage + Math.ceil(character.stats.dexterity / 4);
          target.stats.strength -= totalDamage;
          console.log(`${character.name} attacks ${target.name} dealing ${totalDamage} damage.`);
        } else {
          console.log(`${character.name} attacks ${target.name} dealing 0 damage because of the quality.`);
        }
      } else {
        console.log(`${character.name} misses the attack.`);
      }
      break;
    case 'gambler':
      console.log(`${character.name} the gambler plays a bet game with ${target.name}.`);
      const gamblerRoll = roll1D2();

        if (gamblerRoll === 1) {
          if (target.equipment.pouch.precious_stones.length > 0) {
            const preciousStone = target.equipment.pouch.precious_stones.pop();
            character.equipment.pouch.precious_stones.push(preciousStone);
            console.log(`${character.name} wins the bet and takes the ${preciousStone.name} from ${target.name}.`);
          } else {
            console.log(`${target.name} has no precious stones to give.`);
          }
        } else {
          if (character.equipment.pouch.precious_stones.length > 0) {
            const preciousStone = character.equipment.pouch.precious_stones.pop();
            target.equipment.pouch.precious_stones.push(preciousStone);
            console.log(`${target.name} wins the bet and takes the ${preciousStone.name} from ${character.name}.`);
          } else {
            console.log(`${character.name} has no precious stones to give.`);
          }
        }
      
      break;
    case 'priest':
      console.log(`${character.name} the priest only offers a prayer. He already acted before.`);
      break;

    case 'thug':
      console.log(`${character.name} the thug is ready to act against ${target.name}`);
      const stealRoll = roll1D3();
      if (stealRoll === 1) {
        if (target.equipment.pouch.gold > 0) {
          target.equipment.pouch.gold -= 1;
          character.equipment.pouch.gold += 1;
          console.log(`${character.name} steals 1 gold from ${target.name}.`);
        } else {
          console.log(`${target.name} has no gold to steal.`);

        }
      } else if (stealRoll === 2) {
        if (target.equipment.pouch.coins > 0) {
          const coins = character.stats.dexterity / 2;
          target.equipment.pouch.coins -= coins;
          character.equipment.pouch.coins += coins;
        } else {
          console.log(`${target.name} has no coins to steal.`);
        }
      } else if (stealRoll === 3) {
        if (target.equipment.quiver > 0) {
          target.equipment.quiver -= 1;
          character.equipment.quiver += 1;
          console.log(`${character.name} steals 1 arrow from ${target.name}.`);
        } else {
          console.log(`${target.name} has no arrows to steal.`);
        }
      } else {
        console.log(`${character.name} failed to do anything to ${target.name}`);
      }

      if (roll < character.stats.dexterity) {
        if (character.equipment.weapons[0].quality > 0) {
          const numDieDamage = character.equipment.weapons[0].num_die_damage;
          const weaponDamage = rollND4(numDieDamage) + Math.ceil(character.equipment.weapons[0].quality / 5);
          const totalDamage = weaponDamage + Math.ceil(character.stats.dexterity / 4);
          target.stats.strength -= totalDamage;
          console.log(`${character.name} attacks ${target.name} dealing ${totalDamage} damage.`);
        } else {
          console.log(`${character.name} attacks ${target.name} dealing 0 damage because of the quality.`);
        }
      } else {
        console.log(`${character.name} misses the attack.`);
      }

      if (target.equipment.quiver > 0) {
        target.equipment.quiver -= 1;
        character.equipment.quiver += 1;
        console.log(`${character.name} steals 1 arrow from ${target.name}.`);
      } else {
        console.log(`${target.name} has no arrows to steal.`);
      }
      break;
    case 'peasant':
      console.log(`${character.name} the peasant tends to the fields.`);
      break;
    default:
      //console.log(`${character.name} does not know what to do.`);
      //If its the joker nothing
      break;
  }

  return characters;
}

const rollND4 = (n) => {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += roll1D4();
  }
  return total;
}

const updateCharacters = async (characters) => {
  for (const character of characters) {
    // Only include the _id fields for weapons, saddlebags, and precious stones
    character.equipment.weapons = character.equipment.weapons.map(weapon => ({ _id: weapon._id }));
    character.equipment.saddlebag = character.equipment.saddlebag.map(saddlebag => ({ _id: saddlebag._id }));
    character.equipment.pouch.precious_stones = character.equipment.pouch.precious_stones.map(stone => ({ _id: stone._id }));

    await Character.findByIdAndUpdate(character._id, character);
  }
}

const reduceStamina = (characters, dayWeek) => {
  const reduction = (dayWeek === 'Saturday' || dayWeek === 'Sunday') ? 4 : 2;
  characters.forEach(character => {
    character.stats.stamina = Math.max(0, character.stats.stamina - reduction);
    console.log(`${character.name}'s stamina reduced by ${reduction}. Current stamina: ${character.stats.stamina}`);
  });
  return characters;
}

const executeNightAction = async (characters) => {
  const songs = [
    'When the fire burns within',
    'A side effect of recovery',
    'Freddy Mercury, the real wayward',
    'Pazus, the impassible: from boast to fail'
  ];
  const randomSong = songs[Math.floor(Math.random() * songs.length)];
  console.log(`The joker sings: '${randomSong}'`);

  characters.forEach(character => {
    if (character.stats.stamina <= 50) {
      let foodToEat = character.stats.stamina < 20 ? 2 : 1;
      while (foodToEat > 0 && character.equipment.saddlebag.length > 0) {
        const food = character.equipment.saddlebag.pop();
        character.stats.stamina += food.recover_stamina;
        console.log(`${character.name} eats ${food.name} and recovers ${food.recover_stamina} stamina. Current stamina: ${character.stats.stamina}`);
        foodToEat--;
      }
    }

    // Adjust weapon quality based on type
    if(character.equipment.weapons.length > 0) {
      character.equipment.weapons.forEach(weapon => {
        if (weapon.type === 'common') {
          weapon.quality = Math.max(0, weapon.quality - 1);
          console.log(`${character.name} lost 1 quality on his ${weapon.name}.`);
          
        } else if (weapon.type === 'arcane') {
          weapon.quality = Math.min(50, weapon.quality + 1);
          console.log(`${character.name} gains 1 quality on his ${weapon.name}.`);
        }
      });
    }

    const recoveryRoll = roll1D3();
    character.stats.strength += recoveryRoll;
    console.log(`The priest recovered ${recoveryRoll} to ${character.name}.`);
    
    
  });
  

  return characters;
}

module.exports = {
  getAllTimes,
  postTime,
};