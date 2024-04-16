const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    items: [{
        description: String,
        price: Number,
        date: Date
    }],
    total: Number
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;  
