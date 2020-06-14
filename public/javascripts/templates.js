function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;
function pug_rethrow(n,e,r,t){if(!(n instanceof Error))throw n;if(!("undefined"==typeof window&&e||t))throw n.message+=" on line "+r,n;try{t=t||require("fs").readFileSync(e,"utf8")}catch(e){pug_rethrow(n,null,r)}var i=3,a=t.split("\n"),o=Math.max(r-i,0),h=Math.min(a.length,r+i),i=a.slice(o,h).map(function(n,e){var t=e+o+1;return(t==r?"  > ":"    ")+t+"| "+n}).join("\n");throw n.path=e,n.message=(e||"Pug")+":"+r+"\n"+i+"\n\n"+n.message,n}function renderView_player_question(locals) {var pug_html = "", pug_mixins = {}, pug_interp;var pug_debug_filename, pug_debug_line;try {;var locals_for_with = (locals || {});(function (questionNum, questionText) {;pug_debug_line = 1;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003C!--Incoming variables: questionText = text of the question, questionNum = number within round--\u003E";
;pug_debug_line = 3;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cdiv class=\"container my-2\"\u003E";
;pug_debug_line = 4;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cp\u003E";
;pug_debug_line = 4;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "Question ";
;pug_debug_line = 4;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = questionNum) ? "" : pug_interp)) + "\u003C\u002Fp\u003E";
;pug_debug_line = 5;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Ch5\u003E";
;pug_debug_line = 5;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + (pug_escape(null == (pug_interp = questionText) ? "" : pug_interp)) + "\u003C\u002Fh5\u003E";
;pug_debug_line = 6;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cdiv class=\"container\"\u003E";
;pug_debug_line = 7;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cdiv class=\"row\"\u003E";
;pug_debug_line = 8;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cdiv class=\"col-8 mr-2\"\u003E";
;pug_debug_line = 9;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cinput class=\"form-control\" type=\"text\" maxlength=\"256\" placeholder=\"Answer\"\u002F\u003E\u003C\u002Fdiv\u003E";
;pug_debug_line = 10;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cdiv class=\"col-3\"\u003E";
;pug_debug_line = 11;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "\u003Cbutton" + (" class=\"btn btn-secondary\""+" type=\"button\""+pug_attr("data-questionnum", questionNum, true, false)) + "\u003E";
;pug_debug_line = 11;pug_debug_filename = "views\u002Fclient\u002Fplayer_question.pug";
pug_html = pug_html + "Submit Answer\u003C\u002Fbutton\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"questionNum" in locals_for_with?locals_for_with.questionNum:typeof questionNum!=="undefined"?questionNum:undefined,"questionText" in locals_for_with?locals_for_with.questionText:typeof questionText!=="undefined"?questionText:undefined));} catch (err) {pug_rethrow(err, pug_debug_filename, pug_debug_line);};return pug_html;}