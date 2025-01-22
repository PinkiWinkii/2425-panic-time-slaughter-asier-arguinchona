const characterService = require('../services/characterService');

const getAllCharacters = async (req, res) => {
  try {
    const characters = await characterService.getAllCharacters();
    // console.log('Characters in controller:');
    // console.log(characters);
    
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching characters', error: error.message });
  }
};

module.exports = {
  getAllCharacters
};