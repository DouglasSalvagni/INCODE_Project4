const router = require('express').Router();
const connection = require('../../config/dbConnection');
const { verifyToken } = require('../utils/crypto');
const printWeek = require('../utils/printWeek');

router.get("/", verifyToken, (req, res) => {

    connection.query(
        `SELECT users.ID, users.surName, users.firstName, schedules.dayWeek, schedules.startTime, schedules.endTime
        FROM schedules
        LEFT JOIN users ON schedules.userID = users.ID;`, (error, response) => {
        if(error) 
            return res.render('signup', {message:"There was a error during the request. Pleas try again"});
        
        let schedules = [];
        response.forEach((element, index) => {
            let formatedRow = {
                ID: element.ID,
                firstName: element.firstName,
                surName: element.surName,
                dayWeek: printWeek(element.dayWeek),
                startTime: element.startTime,
                endTime: element.endTime
            }
            schedules.push(formatedRow);
        });
        res.render('home',{schedules: schedules});
    })

    
});

module.exports = router;