var express = require('express');
var router = express.Router();

/* eslint-disable no-unused-vars */

//Dummy api call for testing
var create_new_triviagame = (req, res) => {
    console.log("Create New Game")
    res.send({"result": "OK"})
}

router.post('/createGame', [create_new_triviagame]);

/* eslint-enable no-unused-vars */

module.exports = router;
