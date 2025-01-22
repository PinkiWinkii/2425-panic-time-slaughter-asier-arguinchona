const timeservice = require('../services/timeService');

const getAllTimes = async (req, res) => {
  try {
    const times = await timeservice.getAllTimes();
    
    res.status(200).json(times);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching times', error: error.message });
  }
};

module.exports = {
  getAllTimes
};