const preciousStoneService = require('../services/preciousStoneService');

const getAllPreciousStones = async (req, res) => {
  try {
    const stones = await preciousStoneService.getAllPreciousStones();
    
    res.status(200).json(stones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching precious stones', error: error.message });
  }
};

module.exports = {
  getAllPreciousStones,
};