/*
 * gameTracker.js
 * Tracks the list of current game codes.
 * A Game Code is a 4-letter code used for joining a game.
 * Game Codes should expire after some time, but could be regenerated for a given TriviaGame object.
 * In effect, this class is used to route a user to a known Game using a temporary invite link.
 */

var TriviaGame = require('./triviaGame.js')
var utils = require('./util.js')
const TriviaQuestion = require('./triviaQuestion.js')

var testGame = new TriviaGame()
testGame.addQuestion(new TriviaQuestion("Test Question 1"))
testGame.addQuestion(new TriviaQuestion("Test Question 2"))

class GameTracker {
    constructor() {
        /* For now, a map of game sessions. Later, change to map gameCode => uuid for db lookup */
        this.gameCodeMap = {"AAAA": testGame} 
        this.gameCodeExpirationTimes = {}
    }

    /** Create a new game. Returns the game object. */
    createNewGame() {
        //Generate new code
        let gameCode = this._generate_unusedGameCode()
        if (gameCode == null) {
            //Uh-oh, couldn't generate a game code.
            console.error("Unable to generate a new game code!")
            return null
        }
        //Generate new game
        var game = new TriviaGame()

        //Assign code to game
        this.gameCodeMap[gameCode] = game
        this.gameCodeExpirationTimes[gameCode] = "TODO"

        console.log("Generated a new TriviaGame with game code", gameCode, "(gameId: ", game.getGameId(), ")")
        return {"gameCode": gameCode, "gameId": game.getGameId()}
    }

    /** Returns a Game object if present, or null if the game code was not valid. */
    lookupByGameCode(gameCode) {
        if (!utils.gameCodeIsValid(gameCode))
            return null
        if (gameCode in this.gameCodeMap) {
            return this.gameCodeMap[gameCode]
        }
        return null
    }

    /** Returns a Game object if present, or null if the game id was not valid. */
    lookupByGameId(gameId) {
        for (const game in this.gameCodeMap) {
            if (this.gameCodeMap.hasOwnProperty(game)) {
                const foundGameId = this.gameCodeMap[game].getGameId();
                console.log(this.gameCodeMap[game])
                if (gameId == foundGameId)
                    return this.gameCodeMap[game]
            }
        }
        return null
    }

    /** Generate a 4-letter game code. */
    _generate_gameCode() {
        // TODO: Banned word check
        // TODO: reduce confusable letters
        let random_string = ''
        let random_ascii
        let ascii_low = 65
        let ascii_high = 90
        let string_length = 4
        for (let i = 0; i < string_length; i++) {
            random_ascii = Math.floor((Math.random() * (ascii_high - ascii_low)) + ascii_low)
            random_string += String.fromCharCode(random_ascii)
        }
        return random_string
    }

    _generate_unusedGameCode() {
        const max_attempts = (26 * 4 * 2) //give up after a while
        var attempt_count = 0
        var gameCode = ''
        do {
            gameCode = this._generate_gameCode()
        } while (this._gameCodeIsInUse(gameCode) && (attempt_count++ < max_attempts))
        return (attempt_count < max_attempts) ? gameCode : null;
    }

    _gameCodeIsInUse(code) {
        return (code in this.gameCodeMap)
    }
}

module.exports = GameTracker