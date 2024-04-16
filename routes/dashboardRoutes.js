const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Ticket = require('../models/Ticket'); // Ensure this is correctly imported

// Assuming user session or authentication provides a user identifier
router.get('/dashboard', async (req, res) => {
    try {
        const rides = await Ride.find();

        // Simulate finding a ticket for the logged-in user (adapt as necessary)
        const ticket = await Ticket.findOne(); // Simplified for demonstration
        const ticketId = ticket ? ticket._id : null; // Use ._id, which is the MongoDB default

        console.log("Rendering dashboard with ticketId:", ticketId);


        res.render('dashboard', { rides: rides, ticketId: ticketId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
