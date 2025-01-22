const Time = require('../models/Time');

const getAllTimes = async () => {
  try {
    const times = await Time.find();

    return times;
  } catch (error) {
    throw new Error('Error fetching times: ' + error.message);
  }
}

const postTime = async (time) => {
  try {
    const newTime = new Time(time.time); // Adjusted to access the correct object
    const savedTime = await newTime.save();

    return savedTime;
  } catch (error) {
    throw new Error('Error posting time: ' + error.message);
  }
}

module.exports = {
  getAllTimes,
  postTime
};