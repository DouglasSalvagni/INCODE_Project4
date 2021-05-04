const router = require('express').Router();
const connection = require('../../config/dbConnection');
const { verifyToken } = require('../utils/crypto');
const printWeek = require('../utils/printWeek');
const { parseTimeToInt } = require('../utils/utils');

const { body, validationResult } = require('express-validator');


router.get('/', verifyToken, (req, res) => {

    connection.query(
        `SELECT users.surName, users.firstName, schedules.ID, users.ID as userID, schedules.dayWeek, schedules.startTime, schedules.endTime
        FROM schedules
        LEFT JOIN users ON schedules.userID = users.ID
        WHERE users.ID = ${req.user.ID};`, (error, response) => {
        if(error) return res.send('ERRO 404 L33');
        
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

        res.render('newSchedule',{schedules, message:"", toast: false, dayWeek:"", dayWeekName:"", startTime:"", endTime:"" });
    })
})

router.post(
    "/",
    verifyToken,
    body('startTime').notEmpty(),
    body('endTime').notEmpty(),
    (req, res) => {

    const { dayWeek, startTime, endTime } = req.body;
    const erros = validationResult(req);

    if(!erros.isEmpty()) {
        return res.render('newSchedule', {schedules:[], message:"complete the entire form", toast: true, dayWeek, dayWeekName: printWeek(Number(dayWeek)), startTime, endTime });
    }

    if(parseTimeToInt(startTime) > parseTimeToInt(endTime)) {
        return res.render('newSchedule', {schedules:[],message:"Start time must be greater than the end time", toast: true, dayWeek, dayWeekName: printWeek(Number(dayWeek)), startTime, endTime });
    }

    // Does not overlap the schedules of the loged user

    // connection.query(`SELECT * FROM schedules WHERE schedules.userID = ${req.user.ID} AND schedules.dayWeek = ${dayWeek}`, (error, response) => {

    // Does not overlap the schedules of all users
    connection.query(`SELECT * FROM schedules WHERE schedules.dayWeek = ${dayWeek}`, (error, response) => {
        if(error) return res.send('ERRO 404 L33');
                
        const newSchedule = req.body;

        newSchedule['userID'] = req.user.ID;

        if(response.length > 0){

            for(schedule of response) {
    
                if(parseTimeToInt(startTime) >= parseTimeToInt(schedule.startTime) && parseTimeToInt(startTime) <= parseTimeToInt(schedule.endTime)){
                    return res.render('newSchedule', {schedules:[],message:"Time cannot collide with existing schedule", toast: true, dayWeek, dayWeekName: printWeek(Number(dayWeek)), startTime, endTime });
                } 
                
                if(parseTimeToInt(endTime) >= parseTimeToInt(schedule.startTime) && parseTimeToInt(endTime) <= parseTimeToInt(schedule.endTime)){
                    return res.render('newSchedule', {schedules:[],message:"Time cannot collide with existing schedule", toast: true, dayWeek, dayWeekName: printWeek(Number(dayWeek)), startTime, endTime });
                } 
    
            }

        } 

        connection.query('INSERT INTO schedules SET ?', newSchedule, (errorInsert, responseInsert) => {

            if(errorInsert) return res.send('ERRO 404');

            return res.redirect('/');

        });

    })

});

module.exports = router;