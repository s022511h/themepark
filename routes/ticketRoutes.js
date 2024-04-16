const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Ride = require('../models/Ride');
const Order = require('../models/Order');
const authenticate = require('../middleware/authenticate'); 

//fetch all orders for user
router.get('/orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// fetch tickets based on date for user
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

        res.json({
            ticket,
            rideName: ride.name, 
            fastTrackPrice: ride.fastTrackPrice
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
