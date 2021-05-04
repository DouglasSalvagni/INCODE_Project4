const router = require('express').Router();
const connection = require('../../config/dbConnection');
const { verifyToken } = require('../utils/crypto');
const printWeek = require('../utils/printWeek');

router.get("/", verifyToken, (req, res) => {
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

        res.render('userSchedules',{schedules, message:"", toast: false});
    })
})

router.delete("/delete/:scheduleId", verifyToken, (req,res) => {
    const {scheduleId} = req.params;

    connection.query(`DELETE FROM schedules WHERE schedules.ID = ${scheduleId}`, (error, response) => {
        if(error) return res.send('ERRO 404');

        return res.status(200).json({success: "success"})
    })
})

module.exports = router;