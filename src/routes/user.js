const router = require('express').Router();
const connection = require('../../config/dbConnection');
const { verifyToken } = require('../utils/crypto');
const printWeek = require('../utils/printWeek');

router.get('/:userId', verifyToken, (req, res) => {

    const {userId} = req.params;

    connection.query(`SELECT * FROM users WHERE users.ID = ${userId}`, (error, response) => {
            
        if(error) return res.status(404).send('Erro 404');

        connection.query(`SELECT * FROM schedules WHERE schedules.userID = ${userId}`, (errorSchedules, schedules) => {

            if(errorSchedules) return res.status(404).send('Erro 404 schedules');

            let formatedSchedules = [];
            
            schedules.forEach(element => {
                let formatedRow = {
                    id: element.ID,
                    dayWeek: printWeek(element.dayWeek),
                    startTime: element.startTime,
                    endTime: element.endTime
                }
                formatedSchedules.push(formatedRow);
            });

            return res.render('user', {user: response[0], schedules: formatedSchedules, toast: false});

        })


    })
    

});

module.exports = router;