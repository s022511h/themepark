const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Ride = require('../models/Ride');
const Order = require('../models/Order');
const authenticate = require('../middleware/authenticate');  // Ensure this middleware exists and works

// Route to fetch all orders for an authenticated user
router.get('/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to fetch tickets based on the provided date for an authenticated user
router.get('/tickets', authenticate, async (req, res) => {
    const { date } = req.query;
    try {
        const tickets = await Ticket.find({ userId: req.user._id, date: date });
        res.json(tickets);
    } catch (err) {
        console.error('Error fetching tickets:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/tickets/:ticketId/fast-track/:rideId', async (req, res) => {
    try {
        const { ticketId, rideId } = req.params;
        const ticket = await Ticket.findById(ticketId);
        const ride = await Ride.findById(rideId);

        if (!ticket || !ride) {
            return res.status(404).send('Ticket or ride not found');
        }

        ticket.fastTrackRides.push(ride._id);
        await ticket.save();

        // Include ride details in the response
        res.json({
            ticket,
            rideName: ride.name,  // Make sure this matches your database field
            fastTrackPrice: ride.fastTrackPrice  // Assuming the price is stored like this
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
