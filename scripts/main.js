let editPlace = $('#work-place');
let displayPlace = $('#display-area');
let tCheck = $('#check');

let specialChars = [
    "#",
    "- ",
    "+ ",
    "=",
    ">",
    "  ",
    "*",
    "_",
    ".",
    "\\",
    "!",
    "`",
    "[",
    "]"
];

window.on('load', setInterval(function () {

    let rawText = editPlace.val();
    let edited;

    edited = startParser(rawText);

    displayPlace.html(edited);

}, 10));


function startParser(text) {

    let mdCode = text.split('\n');

    mdCode = readToken(mdCode);

    return mdCode;
}

function readToken(textarr) {

    for (var i = 0; i < textarr.length; i++) {

        for (var a = 0; a < 5; a++) {

            if (textarr[i].startsWith(specialChars[a])) {

                switch (a) {

                    case 0:
                        textarr[i] = addHeading(textarr[i], 0, 6);
                        break;
                    case 1:
                    case 2:
                        makeList(textarr, i);
                        break;
                    /*case 3:
                        //underline(textarr[i]);
                        break;
                    case 4:
                        //quote(textarr[i]);
                        break;
                    //case 4:*/


                }
            }
        }
    }

    return textarr;
}

function addHeading(headerText, initA, limitA) {

    for (var a = initA + 1; a < limitA + 1; a++) {

        if (headerText.charAt(a) != specialChars[0]) {

            headerText = headerText.substr(a, headerText.length);
            headerText = '<h' + a + '>' + headerText + '<h' + a + '>';
            a = limitA;
        }
    }

    return headerText;
}

/*function makeList(list, listIndex) {

    let counter = 0;

    for (var i = 0; i < (list.length - 1); i++) {
        if (list[i].startsWith(specialChars[1])) {
            counter++;
            if (counter == 1) {
                list[i] = '<ul><li>' + list[i] + '</li>';
            } else {
                list[i-1] = list[i-1].slice(0,list[i-1].length-5);
                list[i] = '<li>' + list[i] + '</li>';
            }
        } else if (counter > 1) {
            list[i - 1] = '<li>' + list[i] + '</li></ul>';
            counter = 0;
        }
    }
    return list;
}*/