/*
 * webSocketServer.js
 * Manage the websocket server and clients.
 * There are 2 types of clients, game hosts and game players.
 * Hosts are able to control the game state, players will only
 * receive updates about game state.
 */

 
var TriviaGame = require('./triviaGame.js')
var TriviaQuestion = require('./triviaQuestion.js')
var CommandProcessor = require('./commandProcessor.js')

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
        this.activeHostClients = []
        this.activePlayerClients = []
        this.wss = new WebSocket.Server(wssOptions);
        this.wss.on('connection', this.onNewConnection.bind(this))
    }

    onNewConnection(webSocketClient) {
        /* Determine if this is a host or player */
        var connectionType = "host" //TODO
        if (connectionType == "host") {
            webSocketClient.on('message', TriviaGameWebSocketServer.prototype.onMessageFromHost.bind(this))
            this.activeHostClients.push(webSocketClient)
        }
        else if (connectionType == "player") {
            webSocketClient.on('message', TriviaGameWebSocketServer.prototype.onMessageFromPlayer.bind(this))
            this.activePlayerClients.push(webSocketClient)
        }       
        
    }

    sendToHostClients(message) {
      this.activeHostClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
          console.log(message)
        }
      })
    }

    sendToPlayerClients(message) {
      for (var client in this.activePlayerClients) {
        client.send(message)
      }
    }

    onMessageFromHost(message) {
      try {
        var data = JSON.parse(message)
        var response = CommandProcessor.processHostCommand(data)
        this.sendToHostClients(response) //TODO: Not all messages should go to all clients
      }
      catch (err) {
        console.error("Error while parsing JSON message from host.", err)
        return
      }
    }

    onMessageFromPlayer(message) {

    }
}

module.exports = TriviaGameWebSocketServer