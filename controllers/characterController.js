const characterService = require('../services/characterService');

const getAllCharacters = async (req, res) => {
  try {
    const characters = await characterService.getAllCharacters();
    res.status(200).json(characters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching characters', error: error.message });
  }
};

module.exports = {
  getAllCharacters
};