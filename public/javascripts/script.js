$(function() {

    var ws = new WebSocket('ws://localhost:33053');
    ws.onmessage = function (ev) {
        $("#testText").text(ev.data)
        animateCSS("#testText", 'pulse')
    }

    ws.onopen = function() {
        console.log('websocket is connected ...')
        // ws.send('connected')
    }

    $('#testInput').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            
            ws.send($(this).val())
    
            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
        }
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
