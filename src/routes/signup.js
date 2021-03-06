const router = require('express').Router();
const connection = require('../../config/dbConnection');

const { getHashedPassword, generateAuthToken } = require('../utils/crypto');
const authTokens = require('../storedTokens');
const { body, validationResult } = require('express-validator');
const { capitalize } = require('../utils/utils');

router.get("/", (req, res) => {
    res.render('signup', {message:"", toast: false, firstName: "", surName:"", email:""})
});

router.post(
    "/",
    body('firstName').notEmpty().isLength({ min: 2}),
    body('surName').notEmpty().isLength({ min: 2}),
    body('email').isEmail(),
    body('password').isLength({ min: 6}),
    (req, res) => {

    const { firstName, surName, email, password } = req.body;
    const erros = validationResult(req);

    if(!erros.isEmpty()) {
        return res.render('signup', {message:"Validation problem", toast: true, firstName, surName, email, password});
    }

    connection.query('SELECT * FROM users',(error, response) => {
        if(error) 
            return res.render('signup', {message:"There was a error during the request. Pleas try again",toast: true, firstName, surName, email, password});

        if(response.find(row => row.email === email)) {

            return res.render('signup', {message:"User already exist.", toast: true, firstName, surName, email, password});

        } else {

            const hashedPassword = getHashedPassword(password);

            const newUser = {
                firstName:capitalize(firstName.toLowerCase()),
                surName:capitalize(surName.toLowerCase()),
                email: email,
                password: hashedPassword
            }

            connection.query('INSERT INTO users SET ?', newUser, (error,response)=>{
                if(error) 
                    return res.render('signup', {message:"There was a error during the request. Pleas try again", toast: true, firstName, surName, email, password});

                newUser['ID'] = response.insertId;

                               
                const authToken = generateAuthToken();

                // Store authentication token
                authTokens[authToken] = newUser;

                // Setting the auth token in cookies
                res.cookie('AuthToken', authToken);

                // Send email

                // Redirect user to the protected page
                return res.redirect('/');
            })

        }
    });

});


module.exports = router;