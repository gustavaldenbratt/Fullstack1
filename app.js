const express = require ('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



const app = express();

// Passport config
require('./config/passport')(passport);

// DB Connection
const db = require('./config/keys').MongoURI;

mongoose.connect(db, {useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs', 'hbs');

// Bodyparser
app.use(express.urlencoded({extended: false}));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use("/style", (request, response) => response.sendFile(__dirname +'//views//style.css'));
app.use("/product", (request, response) => response.render(__dirname +'//views//product.ejs'));
app.use("/img", (request, response) => response.sendFile(__dirname +'//views//img.jpg'));

const PORT = process.env.PORT || 5000;
const host = 'localhost';
// app.listen(PORT, console.log(`Server started on port ${PORT}`));
app.listen(PORT,host, function f() {
    console.log(`Server up and running att http://${ host}:${PORT}`);
}); 