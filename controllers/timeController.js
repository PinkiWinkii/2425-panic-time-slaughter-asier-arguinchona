const timeservice = require('../services/timeService');

const getAllTimes = async (req, res) => {
  try {
    const times = await timeservice.getAllTimes();
    
    res.status(200).json(times);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching times', error: error.message });
  }
};

const postTime = async (req, res) => {
  try {
    const time = await timeservice.postTime(req.body);
    
    res.status(200).json(time);
  } catch (error) {
    res.status(500).json({ message: 'Error posting time', error: error.message });
  }
};

module.exports = {
  getAllTimes,
  postTime
};