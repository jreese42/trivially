//TODO: API Modeling
//TODO: Game/Websocket Modeling
//TODO: Game View
//TODO: Game Viewmodel

//The WebSocket is global because it's fundamental to almost everything
var ws = null
var gameHostModel = null
var gameHostViewModel = null

const UIView = {
    VIEW_ENTRY: 0,
    VIEW_HOST: 1,
    VIEW_PLAYER: 2,
}

$(function() {
    gameHostModel = new GameHostModel()
    gameHostViewModel = new GameHostViewModel(gameHostModel)

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
                switchView(2) //TODO: Fix magic number. This is Player Mode.
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
            setup_hostView_handlers()
            switchView(1) //TODO: Fix magic number. This is Host Mode.
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
//TODO: Some security around this (player accounts would help to verify game ownership)
function setupWssSocket_hostMode(gameId) {
    openWssSocket()
    ws.onopen = wssHelper_hostMode_onOpen.bind(this, gameId)
    ws.onmessage = wssHelper_hostMode_onMessage.bind(this)
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
    var json = null
    try {
        json = JSON.parse(message.data)
    } catch {
        return
    }
    if (json == null)
        return
    console.log(json)
    //TODO: Handle adding questions in the middle, removing questions, adding question to end
    //TODO: Make this a viewmodel/view
    if (json.questions) {
        for (let index = 0; index < json.questions.length; index++) {
            const question = json.questions[index];
            $("#questionsContainer").append(renderView_player_question(question))
        }
    }
}

function wssHelper_hostMode_onMessage(message) {
    console.log("Host recv Message")
    var json = null
    try {
        json = JSON.parse(message.data)
    } catch {
        return
    }
    if (json == null)
        return
    if (json.questions) {
        console.log(json.questions)
        gameHostModel.processQuestionListFromServer(json.questions)
    }
}

function setup_hostView_handlers() {
    $("#btn_host_addQuestion").click(function() {
        gameHostModel.addNewQuestion()
    })
}


//All of this MVVM stuff should be moved to React instead
class Model {
    constructor() {
        this.viewModelSubscribers = []
    }

    attachViewModel(viewModel) {
        this.viewModelSubscribers.push(viewModel)
    }

    _notifyChanges() {
        for (let index = 0; index < this.viewModelSubscribers.length; index++) {
            const viewModel = this.viewModelSubscribers[index];
            viewModel.onModelChanged(this)
        }
    }
}

class ViewModel {
    constructor(model) {
        this.model = model
    }

    onModelChanged() {
        throw new Error("onModelChanged was not implemented for this class")
    }

    render() {
        throw new Error("render was not implemented for this class")
    }
}

class TriviaQuestionModel extends Model {
    constructor(questionNum, questionText) {
        super()
        this.questionText = questionText
        this.questionNum = questionNum
    }

    getQuestionNum() {
        return this.questionNum
    }

    getQuestionText() {
        return this.questionText
    }

    setQuestionText(newText) {
        this.questionText = newText
    }

    render() {
        return renderView_host_questionEditable({
            "questionNum": this.questionNum,
            "questionText": this.questionText
        })
    }
}

class TriviaQuestionViewModel extends ViewModel {
    constructor(model) {
        super(model)
    }

    render(triviaQuestionModel) {

    }
}

class GameHostModel {
    constructor() {
        this.questions = []
    }
    
    /* Ask server to create a new question. */
    /* Server will respond with new question list containing this new slot */
    addNewQuestion() {
        console.log("Add Q")
        ws.send(JSON.stringify({
            "command": "addQuestion"
        }))
    }

    processQuestionListFromServer(questionList) {
        this.questions = []
        for (let index = 0; index < questionList.length; index++) {
            const question = questionList[index];
            this.questions.push(new TriviaQuestionModel(question.questionNum, question.questionText))
        }
        gameHostViewModel._renderQuestionViewModels()
    }
    
}

class GameHostViewModel {
    constructor(model) {
        this.model = model
        this._renderQuestionViewModels()
    }

    _renderQuestionViewModels() {
        $('#container_hostQuestions').empty()
        for (let index = 0; index < this.model.questions.length; index++) {
            const question = this.model.questions[index];
            $('#container_hostQuestions').append(question.render())
        }
    }
}