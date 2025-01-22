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
    const charactersResponse = await axios.get(`http://localhost:${PORT}/characters`);

    const times = timeResponse.data;
    const characters = charactersResponse.data;

    console.log('Characters:', characters);
    console.log('Times:', times);

    const postingTime = times[times.length - 1];
    delete postingTime._id;

    postingTime.day_number++;

    const totalTraveled = await getTotalTraveledKM(times);
    postingTime.km_total = totalTraveled + postingTime.km_traveled;

    console.log(postingTime.km_total);
    

    await changeTimeDay(postingTime);

    const newTime = new Time(postingTime); // Adjusted to access the correct object
    const savedTime = await newTime.save();

    return savedTime;

  } catch (error) {
    console.error('Error posting times:', error.message);
  }


}

const getTotalTraveledKM = async (times) => {
  let totalTraveled = 0;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    console.log(time.km_traveled);
    
    totalTraveled += time.km_traveled;
  }

  console.log('TOTAL TRAVELED');
  console.log(totalTraveled);
  
  return totalTraveled;
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