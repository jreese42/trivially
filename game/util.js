/*
 * util.js
 * Some commonly used utility functions
 */

/** User input checking on game code.
* Return true if valid, else false.
*/
function gameCodeIsValid(code) {
 if (code.length == 4 && code.match("^[A-Za-z]+$"))
   return true
 return false
}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

module.exports = {
    gameCodeIsValid: gameCodeIsValid,
    create_UUID: create_UUID
}