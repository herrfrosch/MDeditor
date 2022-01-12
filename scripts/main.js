let editPlace = $('#work-place');
let displayPlace = $('#display-area');

let tCheck = $('#check');

window.on('load', setInterval(function(){

    var rawText = editPlace.val();

    displayPlace.text(rawText);

}, 10));