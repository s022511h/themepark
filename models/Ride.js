const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fastTrackPrice: {
    type: Number,
    required: true
  },
  minHeight: {
    type: Number,
    required: true 
  },
  imageUrl: {
    type: String 
  }
 
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
