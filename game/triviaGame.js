/*
 * game.js
 * Model of an active game.
 */

var utils = require('./util.js');
const TriviaQuestion = require('./triviaQuestion.js');

class TriviaGame {
    constructor() {
        this.questions = []
        this._gameId = utils.create_UUID()

        this.activeHostClients = []
        this.activePlayerClients = []
    }

    getGameId() {
        return this._gameId;
    }

    addQuestion(question) {
        this.questions.push(question)
    }

    getGameState() {
        var gameState = {
            "questions": []
        }
        this.questions.for
        this.questions.forEach(question => {
            gameState.questions.push(question.questionText)
        })
        return gameState
    }

    /* WebSocket Management Functions */
    /* Hosts and Clients are directly attached to this object */
    /* Data from the WSS is routed here, and this object is expected to forumulate responses. */
    addHostClient(wsClient) {
        this.activeHostClients.push(wsClient)
    }

    addPlayerClient(wsClient) {
        this.activePlayerClients.push(wsClient)
    }

    sendFullGameState(wsClient) {
        console.log(this.getGameState())
        console.log(JSON.stringify(this.getGameState()))
        wsClient.send(JSON.stringify(this.getGameState()))
    }
    
    _sendToHostClients(message) {
        this.activeHostClients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message)
            console.log(message)
          }
        })
    }
  
    _sendToPlayerClients(message) {
        for (var client in this.activePlayerClients) {
          client.send(message)
        }
    }

    _processHostCommand(wsClient, data) {

    }

    _processPlayerCommand(wsClient, data) {

    }
}

module.exports = TriviaGame


 /* Game ID - used to idenfify a game */
 /* game join code - a 4-digit code used for joining the game */
 /* Rounds */
 /* A round is a collection of questions */
 /* A question is text with an answer, plus an answer stats object */