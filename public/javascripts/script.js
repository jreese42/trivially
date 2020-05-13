//TODO: API Modeling
//TODO: Game/Websocket Modeling
//TODO: Game View
//TODO: Game Viewmodel

//The WebSocket is global because it's fundamental to almost everything
var ws = null

$(function() {

    $('#input_gameCode').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            console.log($(this).val())
            // ws.send($(this).val())
            $.post({
                url: "/api/lookupGame/" + $(this).val()
            })
            .done(function(data) {
                console.log(data)
                if (!data.gameId) {
                    console.log("Couldn't find gameId in response.")
                    return
                }
                setupWssSocket_playerMode(data.gameId)
            })
    
            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
        }
    });

    $("#createNewGame").click(function() {
        //Testing
        $.post({
            url: "/api/createGame"
        })
        .done(function(data) {
            console.log(data)
            if (!data.gameId) {
                console.log("Couldn't find gameId in response.")
                return
            }
            setupWssSocket_hostMode(data.gameId)
        })
    });
});


const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = $(element)
    node.addClass(`${prefix}animated`).addClass(animationName).on('animationend', function() {
        $(this).removeClass(`${prefix}animated`).removeClass(animationName)
    });
  });

//Open socket, send gameId to server to request game data
//TODO: Some security around this (player accounts would help too)
function setupWssSocket_hostMode(gameId) {
    openWssSocket()
    ws.onopen = wssHelper_hostMode_onOpen.bind(this, gameId)
}

//Open socket, send gameId to server to request game state
function setupWssSocket_playerMode(gameId) {
    openWssSocket()
    ws.onopen = wssHelper_playerMode_onOpen.bind(this, gameId)
}

function openWssSocket() {
    ws = new WebSocket('ws://localhost:33053');
    ws.onmessage = function (ev) {
        console.log(ev.data)
    }
    console.log("Socket open")
}

function wssHelper_hostMode_onOpen(gameId) {
    if (ws == null)
        return

    ws.send(JSON.stringify({
        "command": "initialize",
        "clientMode": "host",
        "gameId": gameId
    }))    
}

function wssHelper_playerMode_onOpen(gameId) {
    if (ws == null)
        return

    ws.send(JSON.stringify({
        "command": "initialize",
        "clientMode": "player",
        "gameId": gameId
    }))    
}