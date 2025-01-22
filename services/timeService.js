const Time = require('../models/Time');
const axios = require('axios');
require('dotenv').config();
const PORT = process.env.PORT || 3000;

const getAllTimes = async () => {
  try {
    const times = await Time.find();

    return times;
  } catch (error) {
    throw new Error('Error fetching times: ' + error.message);
  }
}

const postTime = async () => {
  try {

    const timeResponse = await axios.get(`http://localhost:${PORT}/getTimes`);
    console.log('Times:', timeResponse.data);

    const postingTime = timeResponse.data[timeResponse.data.length - 1];
    delete postingTime._id;

    postingTime.day_number++;

    changeTimeDay(postingTime);

    const newTime = new Time(postingTime); // Adjusted to access the correct object
    const savedTime = await newTime.save();

    return savedTime;

  } catch (error) {
    console.error('Error posting times:', error.message);
  }


}

const changeTimeDay = async (time) => {
  switch (time.day_week) {
    case 'Monday':
      time.day_week = 'Tuesday';
      break;
    case 'Tuesday':
      time.day_week = 'Wednesday';
      break;
    case 'Wednesday':
      time.day_week = 'Thursday';
      break;
    case 'Thursday':
      time.day_week = 'Friday';
      break;
    case 'Friday':
      time.day_week = 'Saturday';
      break;
    case 'Saturday':
      time.day_week = 'Sunday';
      break;
    case 'Sunday':
      time.day_week = 'Monday';
      break;
    default:
      throw new Error('Invalid day of the week');
  }
  return time;
}

module.exports = {
  getAllTimes,
  postTime
};