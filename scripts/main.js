const editPlace = $('#work-place');
const displayPlace = $('#display-area');

const specialChars = [
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

    const rawTxt = editPlace.val();

    parser(rawTxt);
});

function containOnly(toCheck, checker) {
    for (let i = 0; i < toCheck.length; i++) {
        if (toCheck[i] != checker) return false;
    }
    return true;
}

function parser(text) {

    const mdCode = text.split('\n');

    readToken(mdCode);
}


function readToken(textarr) {

    let flag = false;

    let ulistCounter = 0;

    for (let i = 0; i < textarr.length; i++) {

        for (let a = 0; a < 5; a++) {

            if (textarr[i].startsWith(specialChars[a])) {

                flag = true;

                switch (a) {

                    case 0:
                        let header = addHeading(textarr[i]);
                        document.getElementById('display-area').appendChild(header);
                        break;
                    case 1:
                    case 2:
                        if (i > 0 && (textarr[i - 1].startsWith(specialChars[1]) || textarr[i - 1].startsWith(specialChars[2]))) {
                            createElement(textarr, i, ulistCounter);
                        } else {
                            ulistCounter++;
                            makeuList(ulistCounter);
                            createElement(textarr, i, ulistCounter);
                        }
                        break;
                    /*case 4:
                        //quote(textarr[i]);
                        break;
                    */
                }
            }
        }

        if (containOnly(textarr[i], specialChars[3]) && i > 0 && textarr[i].length > 0 && !textarr[i - 1].startsWith(specialChars[1])) {
            alternateHeading(textarr[i - 1], 1);
        } else if (containOnly(textarr[i], specialChars[4]) && i > 0 && textarr[i].length > 0 && !textarr[i - 1].startsWith(specialChars[1])) {
            alternateHeading(textarr[i - 1], 2);
        }

        if (flag == false) {

            if (i > 0 && textarr[i - 1].endsWith(specialChars[6])) {

                const perviousPar = document.getElementById('display-area').lastChild.innerText;
                addBrParagraph(textarr[i],perviousPar);
                
            } else {
                addParagraph(textarr[i]);
            }
        
        } else {
            flag = false;
        }
    }
}

function addHeading(headerText) {

    for (let a = 0; a < 7; a++) {

        if (headerText.charAt(a) != specialChars[0]) {

            const headerTag = 'h' + a;

            headerText = headerText.slice(a + 1, headerText.length);
            let header = document.createElement(headerTag);

            header.innerText = headerText;
            a = 7;

            return header;
        }
    }
}

function alternateHeading(headerText, size) {

    const tag = 'h' + size;

    const header = document.createElement(tag);

    header.innerText = headerText;

    const last = document.getElementById('display-area').lastChild;

    document.getElementById('display-area').removeChild(last);

    document.getElementById('display-area').appendChild(header);
}

function createElement(listText, index, listNum) {

    let text = listText[index];
    text = text.slice(2, text.length);

    let element = document.createElement("li");
    let listTag = listNum + '-list';

    //let list = document.getElementById("first-list"); i'd get to know how to make this work

    if (text.charAt(0) == specialChars[0]) {

        let header = addHeading(text);

        element.insertAdjacentElement("beforeend", header);
        document.getElementById(listTag).appendChild(element);

    } else {
        element.innerText = text;
        document.getElementById(listTag).appendChild(element);
    }
}

function makeuList(counter) {

    let tag = counter + '-list';

    let ulist = document.createElement("ul");

    ulist.setAttribute("id", tag);

    document.getElementById('display-area').appendChild(ulist);
}

function addBrParagraph(text, pervText) {

    let last = document.getElementById('display-area').lastChild;

    document.getElementById('display-area').removeChild(last);

    let par = document.createElement("p");

    par.innerHTML = pervText + '\n' + text;

    document.getElementById('display-area').appendChild(par);
}

function addParagraph(text) {

    let par = document.createElement("p");

    par.innerText = text;

    document.getElementById('display-area').appendChild(par);

}