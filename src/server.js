const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();

//Import Routes
const login = require('./routes/login');
const signup = require('./routes/signup');
const logout = require('./routes/logout');
const home = require('./routes/home');
const user = require('./routes/user');
const newSchedule = require('./routes/newSchedule');

//Store tokens
const authTokens = require('./storedTokens');

app.set('view engine', 'ejs');
app.set('views',"./src/views");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser(''));
app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
});

//Router
app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/', home);
app.use('/user', user);
app.use('/newSchedule', newSchedule);


module.exports = app;