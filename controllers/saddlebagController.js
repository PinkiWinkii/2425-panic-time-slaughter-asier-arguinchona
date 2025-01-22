const saddlebagservice = require('../services/saddleBagService');

const getAllSaddleBags = async (req, res) => {
  try {
    const saddlebags = await saddlebagservice.getAllSaddleBags();
    res.status(200).json(saddlebags);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saddlebags', error: error.message });
  }
};

module.exports = {
  getAllSaddleBags,
};