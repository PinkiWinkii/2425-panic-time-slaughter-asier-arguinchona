const PreciousStones = require('../models/PreciousStone');

const getAllPreciousStones = async () => {
  try {
    const stones = await PreciousStones.find();

    return stones;
  } catch (error) {
    throw new Error('Error fetching stones: ' + error.message);
  }
}
module.exports = {
  getAllPreciousStones,
};