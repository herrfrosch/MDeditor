let editPlace = $('#work-place');
let displayPlace = $('#display-area');
let tCheck = $('#check');

editPlace.on('load', setInterval(function(){

    var rawText = editPlace.val();
    var edited;

    edited = mdParser(rawText);

    /*if (rawText[0] == "#"){
    rawText = rawText.substr(1);
    edited = "<h1>"+rawText+"</1>";
    } else {edited = rawText;}*/

    displayPlace.html(edited);

}, 10));


function mdParser(text){

    let mdCode = text.split("\n");
    //var i = 0;
   
    //console.log(mdCode.length);

    //i = mdCode.length-1;

    for(var i = 0; i < mdCode.length; i++){

        if(mdCode[i].startsWith('#')){
            mdCode[i] = mdCode[i].substr(1);
            mdCode[i] = '<h1>'+mdCode[i]+'</h1>';
        }
        else mdCode[i] = mdCode[i];

        mdCode[i]='<p>'+mdCode[i]+'</p>';

    }

    /*for(var i = 2; i < mdCode.length; i++){
        mdCode[i]=mdCode[i-1]+'\n';
    }*/


  
    return  mdCode;
}