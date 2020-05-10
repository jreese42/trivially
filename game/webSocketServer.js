/*
 * webSocketServer.js
 * Manage the websocket server and clients.
 * There are 2 types of clients, game hosts and game players.
 * Hosts are able to control the game state, players will only
 * receive updates about game state.
 */

 
var TriviaGame = require('./triviaGame.js')
var TriviaQuestion = require('./triviaQuestion.js')

const WebSocket = require('ws');
const wssOptions = {
    port: 33053,
    perMessageDeflate: {
      zlibDeflateOptions: {
        // See zlib defaults.
        chunkSize: 1024,
        memLevel: 7,
        level: 3
      },
      zlibInflateOptions: {
        chunkSize: 10 * 1024
      },
      // Other options settable:
      clientNoContextTakeover: true, // Defaults to negotiated value.
      serverNoContextTakeover: true, // Defaults to negotiated value.
      serverMaxWindowBits: 10, // Defaults to negotiated value.
      // Below options specified as default values.
      concurrencyLimit: 10, // Limits zlib concurrency for perf.
      threshold: 1024 // Size (in bytes) below which messages
      // should not be compressed.
    }
  }

class TriviaGameWebSocketServer {
    constructor() {
        this.game = new TriviaGame()
        this.wss = new WebSocket.Server(wssOptions);
        this.wss.on('connection', this.onNewConnection)
    }

    onNewConnection(webSocketClient) {
        /* Determine if this is a host or player */
        var connectionType = "host" //TODO
        if (connectionType == "host") {
            webSocketClient.on('message', TriviaGameWebSocketServer.prototype.onMessageFromHost.bind(this))
        }
        else if (connectionType == "player") {
            webSocketClient.on('message', TriviaGameWebSocketServer.prototype.onMessageFromPlayer.bind(this))
        }
        // webSocketClient.on('message', function incoming(message) {
        //     console.log('received: %s', message);
        //     this.game.addQuestion(new TriviaQuestion(message))
        //     console.log(this.game.getGameState())
            // this.wss.clients.forEach(function each(client) {
            //     if (client.readyState === WebSocket.OPEN) {
            //     client.send(this.game.getGameState()["question"]);
            //     }
            // })
        // })
        
        
    }

    onMessageFromHost(message) {
        console.log("Message from host: " + message)
    }

    onMessageFromPlayer(message) {

    }
}

module.exports = TriviaGameWebSocketServer