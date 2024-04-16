require('dotenv').config();
const mongoose = require('mongoose');
const Ride = require('./models/Ride'); 

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
  {
    name: "Bees",
    fastTrackPrice: 5.5,
    minHeight: 140,
    imageUrl: "/images/bees.jpg"
  },
  {
    name: "Tidal Run",
    fastTrackPrice: 3,
    minHeight: 120,
    imageUrl: "/images/tidalrun.jpg"
  },
  {
    name: "Ride the Rapids",
    fastTrackPrice: 1,
    minHeight: 110,
    imageUrl: "/images/ridetherapids.jpg"
  },
  {
    name: "The Teacups",
    fastTrackPrice: 1,
    minHeight: 90,
    imageUrl: "/images/teacups.jpg"
  }
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
