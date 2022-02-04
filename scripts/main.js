const editPlace = $('#work-place');
const displayPlace = $('#display-area');

let specialChars = [
    "#",
    "- ",
    "+ ",
    "=",
    "-",
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

function containOnly(toCheck, checker) {
    for (let i = 0; i < toCheck.length; i++) {
        if (toCheck[i] != checker)  return false;
    }
    return true;
}

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
                        let header = addHeading(textarr[i]);
                        document.getElementById('display-area').appendChild(header);
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
                    /*case 4:
                        //quote(textarr[i]);
                        break;
                    */
                }
            }
        }

        if (containOnly(textarr[i], specialChars[3]) && i > 0 && textarr[i].length > 0) {
            alternateHeading(textarr[i - 1], 1);
        } else if (containOnly(textarr[i], specialChars[4]) && i > 0 && textarr[i].length > 0) {
            alternateHeading(textarr[i - 1], 2);
        }

        if (flag == false) {
            addParagraph(textarr[i]);
        } else {
            flag = false;
        }
    }
}

function addHeading(headerText) {

    let limitA = 7;

    for (let a = 0; a < limitA; a++) {

        if (headerText.charAt(a) != specialChars[0]) {

            let headerTag = 'h' + a;

            headerText = headerText.slice(a, headerText.length);
            let header = document.createElement(headerTag);

            header.innerText = headerText;
            a = limitA;

            return header;
        }
    }
}

function alternateHeading(headerText, size) {

    let tag = 'h' + size;

    let header = document.createElement(tag);

    header.innerText = headerText;

    let last = document.getElementById('display-area').lastChild;

    document.getElementById('display-area').removeChild(last);

    document.getElementById('display-area').appendChild(header);
}

function createElement(listText, index) {

    listText[index] = listText[index].slice(2, listText[index].length);

    let element = document.createElement("li");

    //let list = document.getElementById("first-list"); i'd get to know how to make this work

    if (listText[index].charAt(0) == specialChars[0]) {

        let header = addHeading(listText[index]);

        element.insertAdjacentElement("beforeend", header);
        document.getElementById("first-list").appendChild(element);

    } else {
        element.innerText = listText[index];
        document.getElementById("first-list").appendChild(element);
    }
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