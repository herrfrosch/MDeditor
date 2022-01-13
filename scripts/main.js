let editPlace = $('#work-place');
let displayPlace = $('#display-area');
let tCheck = $('#check');

window.on('load', setInterval(function(){

    var rawText = editPlace.val();
    var edited;

    edited = mdParser(rawText);

    displayPlace.html(edited);

}, 10));


function mdParser(text){

    let mdCode = text.split('\n');

    for(var i = 0; i < mdCode.length; i++){

        if(mdCode[i].startsWith('# ')){
            mdCode[i] = mdCode[i].substr(1);
            mdCode[i] = '<h1>'+mdCode[i]+'</h1>';
        } else if (mdCode[i].startsWith('## ')){
            mdCode[i] = mdCode[i].substr(2);
            mdCode[i] = '<h2>'+mdCode[i]+'</h2>';
        } else if (mdCode[i].startsWith('### ')){
            mdCode[i] = mdCode[i].substr(3);
            mdCode[i] = '<h3>'+mdCode[i]+'</h3>';
        } 
        else mdCode[i] = mdCode[i];

        mdCode[i]='<p>'+mdCode[i]+'</p>';
    }

    var mdLength = mdCode[0].length-4;

    mdCode[0] = mdCode[0].substr(3, mdLength);

    //mdCode[0] = mdCode[0]+"</br>";

    return  mdCode;
}