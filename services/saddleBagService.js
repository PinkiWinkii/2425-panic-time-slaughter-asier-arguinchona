const SaddleBag = require('../models/SaddleBag');

const getAllSaddleBags = async () => {
  try {
    const sadlebags = await SaddleBag.find();

    return sadlebags;
  } catch (error) {
    throw new Error('Error fetching saddlebags: ' + error.message);
  }
}

module.exports = {
  getAllSaddleBags,
};