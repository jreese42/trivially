/*
 * game.js
 * Model of an active game.
 */

class TriviaGame {
    constructor() {
        this.questions = []
    }

    addQuestion(question) {
        this.questions.push(question)
    }

    getGameState() {
        var question = ""
        if (this.questions.length > 0)
            question = this.questions[this.questions.length - 1].questionText
        console.log(question)
        var gameState = {
            "question": question
        }
        return gameState
    }
}

module.exports = TriviaGame


 /* Game ID - used to idenfify a game */
 /* game join code - a 4-digit code used for joining the game */
 /* Rounds */
 /* A round is a collection of questions */
 /* A question is text with an answer, plus an answer stats object */