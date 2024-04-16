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
    required: true // Adjust as needed
  },
  imageUrl: {
    type: String // Adjust as needed
  }
  // You can include additional fields as needed
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;
