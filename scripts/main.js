const editPlace = $('#work-place');
const displayPlace = $('#display-area');
//let tCheck = $('#check');

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

editPlace.on('input', function () {

    displayPlace.html('');

    let rawTxt = editPlace.val();

    parser(rawTxt);
});

function parser(text) {

    let mdCode = text.split('\n');

    readToken(mdCode);
}


function readToken(textarr) {

    let flag = false;

    for (var i = 0; i < textarr.length; i++) {

        for (var a = 0; a < 5; a++) {

            if (textarr[i].startsWith(specialChars[a])) {

                flag = true;

                switch (a) {

                    case 0:
                        addHeading(textarr[i], 0, 6);
                        break;
                    case 1:
                    case 2:
                        createElement(textarr, i);
                        break;
                    /*case 3:
                        //underline(textarr[i]);
                        break;
                    case 4:
                        //quote(textarr[i]);
                        break;
                    */
                }
            }
        }

        if(flag == false){
            addParagraph(textarr[i]);
        } else {
            flag = false;
        }
    }
}

function addHeading(headerText, initA, limitA) {

    for (let a = initA + 1; a < limitA + 1; a++) {

        if (headerText.charAt(a) != specialChars[0]) {

            let headerTag = 'h' + a;

            headerText = headerText.slice(a, headerText.length);
            let header = document.createElement(headerTag);

            header.innerText = headerText;

            document.getElementById('display-area').appendChild(header);

            a = limitA;
        }
    }
}

function createElement(listText, index) {

    listText[index] = listText[index].slice(1, listText[index].length);

    let element = document.createElement("li");

    element.innerText = listText[index];

    document.getElementById('display-area').appendChild(element);

    //makeList();
}

/*function makeList(){

    const unlisted = $('li');
}*/

function addParagraph(text){

    let par = document.createElement("p");

    par.innerText = text;

    document.getElementById('display-area').appendChild(par);

}