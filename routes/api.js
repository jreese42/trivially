var express = require('express');
var router = express.Router();

var utils = require('../game/util.js')

/* eslint-disable no-unused-vars */

//Dummy api call for testing
var create_new_triviagame = (req, res) => {
    var gameTracker = req.app.get('component_gameTracker')
    var gameData = gameTracker.createNewGame()
    res.send(gameData)
}

var lookup_triviagame = (req, res) => {
    /* Input validation */
    var gameCode = req.params.gameCode.toUpperCase()
    if (!utils.gameCodeIsValid(gameCode)) {
        res.send({"errorMessage": "Game Code was not valid."})
    }
    else {
        var gameTracker = req.app.get('component_gameTracker')
        var game = gameTracker.lookupByGameCode(gameCode)
        if (game == null) {
            res.send({"errorMessage": "Couldn't find game"})
        }
        res.send({"gameId": game.getGameId()})
    }
}

router.post('/createGame', [create_new_triviagame]);
router.post('/lookupGame/:gameCode', [lookup_triviagame])
/* eslint-enable no-unused-vars */

module.exports = router;