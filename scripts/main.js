const editPlace = $('#work-place');
const displayPlace = $('#display-area');

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
                        if (i > 0 && textarr[i - 1].startsWith(specialChars[1])) { //get to know how to make multiple lists
                            createElement(textarr, i);
                        } else {
                            makeuList();
                            createElement(textarr, i);
                        }
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

        if (flag == false) {
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

    //let list = document.getElementById("first-list"); i'd get to know how to make this work

    element.innerText = listText[index];

    document.getElementById("first-list").appendChild(element);
}

function makeuList() {

    let ulist = document.createElement("ul");

    ulist.setAttribute("id", "first-list");

    document.getElementById('display-area').appendChild(ulist);
}

function addParagraph(text) {

    let par = document.createElement("p");

    par.innerText = text;

    document.getElementById('display-area').appendChild(par);

}

/*function addBreak(text, line) {

    if (text.length > 1 && line != text.length) {

        if (text[line].endsWith(specialChars[5])) {

        }

    }

    return text[line];

}*/