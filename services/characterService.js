const Character = require('../models/Character');

const getAllCharacters = async () => {
  try {
    const characters = await Character.find();
    return characters;
  } catch (error) {
    throw new Error('Error fetching characters: ' + error.message);
  }
};

module.exports = {
  getAllCharacters
};