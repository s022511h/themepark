const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  basePrice: {
    type: Number,
    default: 20 // Default price for a ticket
  },
  fastTrackRides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride'
  }]
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
