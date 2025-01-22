const characterService = require('../services/characterService');
const Character = require('../models/Character');

const getAllCharacters = async (req, res) => {
  try {
    const characters = await characterService.getAllCharacters();
    // console.log('Characters in controller:');
    // console.log(characters);
    const populatedCharacters = await populateCharacters(characters);

    // console.log('POPULATED CHARACTERS');
    // console.log(populatedCharacters[0].equipment.saddlebag);
    // console.log(populatedCharacters[1].equipment.saddlebag);
    
    res.status(200).json(populatedCharacters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching characters', error: error.message });
  }
};

const getAllUnpopulatedCharacters = async (req, res) => {
  try {
    const characters = await characterService.getAllCharacters();

    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching characters', error: error.message });
  }
};

const populateCharacters = async (characters) => {
  // console.log("ABOUT TO POPULATE CHARACTER");
  for(let i = 0; i < characters.length; i++){
    try {
      // console.log("POPULATING CHARACTER");
      const character = characters[i];
      // console.log("CHARACTER: ", character);
      characters[i] = await populateCharacter(character);
    } catch (error) {
      console.error("Error populating character:", error);
    }
  }

  return characters;
}

const populateCharacter = async (character) => {
  await character.populate('equipment.saddlebag');
  await character.populate('equipment.weapons');
  await character.populate('equipment.pouch.precious_stones');

  return character;
}

module.exports = {
  getAllCharacters,
  getAllUnpopulatedCharacters
};