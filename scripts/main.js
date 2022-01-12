let editPlace = $('#work-place');
let displayPlace = $('#display-area');

let tCheck = $('#check');

window.on('load', setInterval(function(){

    var rawText = editPlace.val();
    var edited;

    if (rawText.includes("#")){
    rawText = rawText.substr(1);
    edited = "<h1>"+rawText+"</h1>";
    } else { edited = rawText;}

    displayPlace.html(edited);

}, 10));