require('dotenv').config();
const mongoose = require('mongoose');
const Ride = require('./models/Ride'); // Adjust the path to your Ride model as necessary

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

const rideData = [
  {
    name: "Spooks Ville",
    fastTrackPrice: 4,
    minHeight: 130,
    imageUrl: "/images/spooksville.jpg"
  },
  {
    name: "Rapido Racer",
    fastTrackPrice: 6,
    minHeight: 140,
    imageUrl: "/images/rapidoRacer.jpg"
  },
  // Correct the image URLs as necessary
];

const insertRideData = async () => {
  try {
    await Ride.deleteMany({});
    await Ride.insertMany(rideData);
    console.log('Rides inserted successfully!');
  } catch (error) {
    console.error('Error inserting rides:', error);
  }

  mongoose.connection.close();
};

insertRideData();
