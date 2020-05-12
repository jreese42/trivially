/*
 * commandProcessor.js
 * Objects which handle incoming commands from the websocket and form responses
 */

function processHostCommand(data) {
    if (!data.command) {
        console.warn("Received a message from host with no command")
        return JSON.stringify(make_error("Missing Command"))
    }
    switch (data.command) {
        case "initialize":
            return JSON.stringify(host_initialize(data))
        default:
            console.warn("Received unknown command \"" + data.command + "\" from host client.")
            return JSON.stringify(make_error("Unknown Command"))
    }
}

function processPlayerCommand(data) {
    throw "NotImplemented"
}

function make_error(text) {
    return {
        "success": false,
        "error": text
    }
}

/** Initialize a new Host client.
 * The client will need to know all details about the game to get started.
 */
function host_initialize(data) {
    var gameId = data.gameId
    return {
        "test": "test"
    }
}

module.exports = {
    "processHostCommand": processHostCommand,
    "processPlayerCommand": processPlayerCommand
}