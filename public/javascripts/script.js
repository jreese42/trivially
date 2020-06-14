//TODO: API Modeling
//TODO: Game/Websocket Modeling
//TODO: Game View
//TODO: Game Viewmodel

//The WebSocket is global because it's fundamental to almost everything
var ws = null

const UIView = {
    VIEW_ENTRY: 0,
    VIEW_HOST: 1,
    VIEW_PLAYER: 2,
}

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
                switchView(2)
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
            switchView(1)
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
    ws.onmessage = wssHelper_playerMode_onMessage.bind(this)
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

function switchView(newView) {
    switch (newView) {
    case 0:
        $("#view_host").addClass("collapse")
        $("#view_player").addClass("collapse")
        $("#view_entry").removeClass("collapse")
        console.log("Entry View")
        break
    case 1:
        $("#view_entry").addClass("collapse")
        $("#view_player").addClass("collapse")
        $("#view_host").removeClass("collapse")
        console.log("Host View")
        break
    case 2:
        $("#view_entry").addClass("collapse")
        $("#view_host").addClass("collapse")
        $("#view_player").removeClass("collapse")
        console.log("Player View")
        break
    default:
        break
    }
}

function wssHelper_playerMode_onMessage(message) {
    console.log("Player recv Message")
    console.log(message.data)
}