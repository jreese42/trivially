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

    getPlayerGameState() {
        var gameState = {
            "questions": []
        }
        var questionNum = 1
        this.questions.forEach(question => {
            gameState.questions.push({
                "questionNum": questionNum++,
                "questionText": question.questionText,
            })
        })
        return gameState
    }

    getHostGameState() {
        var gameState = {
            "questions": []
        }
        var questionNum = 1
        this.questions.forEach(question => {
            gameState.questions.push({
                "questionNum": questionNum++,
                "questionText": question.questionText,
                "questionAnswer": question.answer
            })
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

    sendPlayerGameState(wsClient) {
        console.log(this.getGameState())
        console.log(JSON.stringify(this.getPlayerGameState()))
        wsClient.send(JSON.stringify(this.getPlayerGameState()))
    }

    sendHostGameState(wsClient) {
        wsClient.send(JSON.stringify(this.getHostGameState()))
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
        if (!data.command)
            return
        switch (data.command) {
            case "addQuestion":
                console.log("Add Q")
                this.questions.push(new TriviaQuestion("New Question"))
                this.sendHostGameState(wsClient)
                break
            case "deleteQuestion":
                console.log("Remove Q")
                break
        }
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