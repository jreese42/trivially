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
        this.activeHostClients = []
        this.activePlayerClients = []
        this.wss = new WebSocket.Server(wssOptions);
        this.wss.on('connection', this.onNewConnection.bind(this))
    }

    onNewConnection(webSocketClient) {
      /* Bind to a general message processor until we receive the initialization request */
      webSocketClient.on('message', TriviaGameWebSocketServer.prototype.onMessageFromNewClient.bind(this, webSocketClient))
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

    onMessageFromNewClient(ws, message) {
      try {
        var data = JSON.parse(message)
        var response = this._processInitializationCommand(ws, data)
        ws.send(response)
      }
      catch (err) {
        console.error("Error while parsing JSON message from client.", err)
        return
      }
    }

    onMessageFromHost(ws, message) {
      try {
        var data = JSON.parse(message)
        var response = this._processHostCommand(data)
        this.sendToHostClients(response) //TODO: Not all messages should go to all clients
      }
      catch (err) {
        console.error("Error while parsing JSON message from host.", err)
        return
      }
    }

    onMessageFromPlayer(ws, message) {

    }

    _addHostClient(ws) {
      this.activeHostClients.push(ws)
      ws.on('message', TriviaGameWebSocketServer.prototype.onMessageFromHost.bind(this, ws))    
      console.log("Added host")  
    }

    _addPlayerClient(ws) {
      this.activePlayerClients.push(ws)      
      ws.on('message', TriviaGameWebSocketServer.prototype.onMessageFromPlayer.bind(this, ws))      
      console.log("Added player")  
    }

    _processInitializationCommand(ws, data) {
      if (!data.command || data.command != "initialize") {
        console.warn("Received a message from client with no command")
        return JSON.stringify(_make_error("Missing Command"))
      }
      if (!data.clientMode) {
        console.warn("Bad initialization command from client")
        return JSON.stringify(_make_error("Missing Parameter"))
      }
      if (!data.gameId) {
        console.warn("Bad initialization command from client")
        return JSON.stringify(_make_error("Missing Game ID"))
      }

      switch (data.command) {
        case "initialize":
          switch (data.clientMode) {
            case "host":
              this._addHostClient(ws)
              break
            case "player":
              this._addPlayerClient(ws)
              break
            default:
              console.warn("Unknown client mode during WebSocket initialization.")
              return JSON.stringify(_make_error("Unknown Client Mode"))
          }
          break
        default:
            console.warn("Received unknown command \"" + data.command + "\" from host client.")
            return JSON.stringify(_make_error("Unknown Command"))
      }
      
    }

    _processHostCommand(data) {
      throw "NotImplemented"
    }

    _processPlayerCommand(data) {
      throw "NotImplemented"
    }

    static _make_error(text) {
        return {
            "success": false,
            "error": text
        }
    }
}

module.exports = TriviaGameWebSocketServer