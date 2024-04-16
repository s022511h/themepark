require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Successfully connected to MongoDB.'))
.catch(err => console.error('Connection error', err));

// Passport Configuration
require('./config/passportConfig')(passport);

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Route files
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api', ticketRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);

app.get('/login', (req, res) => {
    res.render('login', { error_msg: req.flash('error_msg'), success_msg: req.flash('success_msg') });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), function(req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/dashboard');
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
});

const Order = require('./models/Order');
const User = require('./models/User');

app.post('/api/checkout', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    const newOrder = new Order({
        userId: req.user._id,
        items: req.body.items,
        total: req.body.items.reduce((total, item) => total + item.price, 0),
        date: new Date()
    });

    newOrder.save()
    .then(order => res.json({ success: true, order }))
    .catch(err => {
        console.error('Error processing order:', err);
        res.status(500).send('Failed to create order');
    });
});

app.get('/api/userinfo', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ email: req.user.email });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
});

// Logout user
app.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login'); // Redirect to the login page after logging out
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
