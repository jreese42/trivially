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
        this.wss = new WebSocket.Server(wssOptions);
        this.wss.on('connection', this.onNewConnection.bind(this))
        this.gameTracker = null
    }

    inject_gameTracker(gameTracker) {
      this.gameTracker = gameTracker
    }

    onNewConnection(webSocketClient) {
      /* Bind to a general message processor until we receive the initialization request */
      webSocketClient.on('message', TriviaGameWebSocketServer.prototype.onMessageFromNewClient.bind(this, webSocketClient))
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

    //Pass this message along to the bound gameObj. gameObj will send responses as needed.
    onMessageFromHost(ws, gameObj, message) {
      try {
        var data = JSON.parse(message)
        gameObj._processHostCommand(ws, data)
      }
      catch (err) {
        console.error("Error while parsing JSON message from host.", err)
        return
      }
    }

    //Pass this message along to the bound gameObj. gameObj will send responses as needed.
    onMessageFromPlayer(ws, gameObj, message) {

    }

    //Bind this new Host client to the game object
    _addHostClient(ws, gameObj) {
      ws.removeAllListeners()
      ws.on('message', TriviaGameWebSocketServer.prototype.onMessageFromHost.bind(this, ws, gameObj))    
      gameObj.addHostClient(ws)
      gameObj.sendHostGameState(ws)
      console.log("Added host")  
    }

    //Bind this new Player client to the game object
    _addPlayerClient(ws, gameObj) {
      ws.removeAllListeners()
      ws.on('message', TriviaGameWebSocketServer.prototype.onMessageFromPlayer.bind(this, ws, gameObj)) 
      gameObj.addPlayerClient(ws)
      gameObj.sendPlayerGameState(ws)
      //Syncronize this player with the current game state
      console.log("Added player")
    }

    //Received an init request from a new client.  Attempt to find a gameObj for this client to bind to.
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
          if (!this.gameTracker) {
            console.error("Received Initialization command but gameTracker wasn't ready!")
            return
          }
          var gameObj = this.gameTracker.lookupByGameId(data.gameId)
          switch (data.clientMode) {
            case "host":
              this._addHostClient(ws, gameObj)
              break
            case "player":
              this._addPlayerClient(ws, gameObj)
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

    static _make_error(text) {
        return {
            "success": false,
            "error": text
        }
    }
}

module.exports = TriviaGameWebSocketServer