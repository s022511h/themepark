const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Ticket = require('../models/Ticket'); 

router.get('/dashboard', async (req, res) => {
    try {
        const rides = await Ride.find();
        const ticket = await Ticket.findOne(); 
        const ticketId = ticket ? ticket._id : null; 

        console.log("Rendering dashboard with ticketId:", ticketId);


        res.render('dashboard', { rides: rides, ticketId: ticketId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
