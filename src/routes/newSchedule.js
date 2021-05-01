const router = require('express').Router();
const connection = require('../../config/dbConnection');
const { verifyToken } = require('../utils/crypto');
const printWeek = require('../utils/printWeek')

const { body, validationResult } = require('express-validator');


router.get('/', verifyToken, (req, res) => {
    res.render('newSchedule',{message:"", toast: true, dayWeek:"", dayWeekName:"", startTime:"", endTime:"" });
})

router.post(
    "/", 
    body('startTime').notEmpty(),
    body('endTime').notEmpty(),
    (req, res) => {

    const { dayWeek, startTime, endTime } = req.body;
    const erros = validationResult(req);

    if(!erros.isEmpty()) {
        return res.render('newSchedule', {message:"complete the entire form", toast: true, dayWeek, dayWeekName: printWeek(Number(dayWeek)), startTime, endTime });
    }
    
    const newSchedule = req.body;

    newSchedule['userID'] = req.user.ID;

    connection.query('INSERT INTO schedules SET ?', newSchedule, (error, response) => {

        if(error) return res.status(404).send('ERRO 404');

        res.redirect('/');

    })
})

module.exports = router;