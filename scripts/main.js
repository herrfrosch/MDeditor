const EDIT_PLACE = document.getElementById('work-place');
const DISP_PLACE = document.getElementById('display-area');

const SPECIAL_CHAR = [
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

EDIT_PLACE.addEventListener('input', function () {

    DISP_PLACE.innerHTML = '';

    const RAW_TEXT = EDIT_PLACE.value;
    parser(RAW_TEXT);
});

function containOnly(toCheck, checker) {
    for (let i = 0; i < toCheck.length; i++) {
        if (toCheck[i] != checker) return false;
    }
    return true;
}

function parser(text) {

    const MD_CODE = text.split('\n');

    readToken(MD_CODE);
    readInner();
}

//parser main loop

function readToken(textarr) {

    let flag = false;

    let firstChar;
    let earlierChar;

    let listCounter = 0;
    let blockQCounter = 0;

    for (let i = 0; i < textarr.length; i++) {

        firstChar = textarr[i].charAt(0);
        firstChar = parseInt(firstChar);

        if (i > 0) {
            earlierChar = textarr[i - 1].charAt(0);
            earlierChar = parseInt(earlierChar);
        }

        for (let a = 0; a < 6; a++) {

            if (textarr[i].startsWith(SPECIAL_CHAR[a])) {

                flag = true;

                switch (a) {

                    case 0:
                        if (i == 0) {

                            const HEADER = addHeading(textarr[i]);

                            HEADER.classList.add('horizonLine');
                            DISP_PLACE.appendChild(HEADER);

                        } else {

                            const HEADER = addHeading(textarr[i]);
                            DISP_PLACE.appendChild(HEADER);

                        }
                        break;
                    case 1:
                    case 2:
                        if (i > 0 && (textarr[i - 1].startsWith(SPECIAL_CHAR[1]) || textarr[i - 1].startsWith(SPECIAL_CHAR[2]))) {
                            createElement(textarr, i, listCounter);
                        } else {
                            listCounter++;
                            makeuList(listCounter);
                            createElement(textarr, i, listCounter);
                        }
                        break;
                    case 5:
                        if (i > 0 && (textarr[i - 1].startsWith(SPECIAL_CHAR[5]))) {
                            addQuote(textarr[i], blockQCounter);
                        } else {
                            blockQCounter++;
                            createBlockquote(blockQCounter);
                            addQuote(textarr[i], blockQCounter);
                        }
                        break;
                }
            }
        }

        if ((i > 0 && !isNaN(firstChar) && isNaN(earlierChar)) || (i == 0 && !isNaN(firstChar))) {

            flag = true;

            listCounter++;
            makeoList(listCounter);
            createElement(textarr, i, listCounter);

        } else if (i > 0 && !isNaN(firstChar) && !isNaN(earlierChar)) {

            flag = true;
            createElement(textarr, i, listCounter);
        }

        if (containOnly(textarr[i], SPECIAL_CHAR[3]) && i > 0 && textarr[i].length > 0 && !textarr[i - 1].startsWith(SPECIAL_CHAR[1])) {
            alternateHeading(textarr[i - 1], 1);
        } else if (containOnly(textarr[i], SPECIAL_CHAR[4]) && i > 0 && textarr[i].length > 0 && !textarr[i - 1].startsWith(SPECIAL_CHAR[1])) {
            alternateHeading(textarr[i - 1], 2);
        }

        if (i > 0 && (containOnly(textarr[i], SPECIAL_CHAR[7]) || containOnly(textarr[i], SPECIAL_CHAR[8]) || containOnly(textarr[i], SPECIAL_CHAR[4])) && textarr[i] !== "" && textarr[i - 1] === "") {

            flag = true;
            addHorizonLine();
        }

        if (flag == false) {

            if (i > 0 && textarr[i - 1].endsWith(SPECIAL_CHAR[6])) {

                const PERVIOUS_PAR = DISP_PLACE.lastChild.innerText;
                addBrParagraph(textarr[i], PERVIOUS_PAR);

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

        if (headerText.charAt(a) != SPECIAL_CHAR[0]) {

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

    const last = DISP_PLACE.lastChild;

    DISP_PLACE.removeChild(last);
    DISP_PLACE.appendChild(header);
}

function createElement(listText, index, listNum) {

    let text = listText[index];
    text = text.slice(2, text.length);

    let element = document.createElement("li");
    let listTag = listNum + '-list';

    if (text.charAt(0) == SPECIAL_CHAR[0]) {

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

    DISP_PLACE.appendChild(ulist);
}

function makeoList(counter) {

    let tag = counter + '-list';
    let olist = document.createElement("ol");

    olist.setAttribute("id", tag);

    DISP_PLACE.appendChild(olist);
}

function addBrParagraph(text, pervText) {

    DISP_PLACE.removeChild(DISP_PLACE.lastChild);

    let par = document.createElement("p");
    par.innerHTML = pervText + '\n' + text;

    DISP_PLACE.appendChild(par);
}

function addParagraph(text) {

    let par = document.createElement("p");
    par.innerText = text;

    DISP_PLACE.appendChild(par);
}

function addQuote(quote, blockNum) {

    quote = quote.slice(1, quote.length);

    let quoteLine = document.createElement("p");
    quoteLine.innerText = quote;

    const TAG = blockNum + '-bqr';
    const BLOCK = document.getElementById(TAG);

    BLOCK.appendChild(quoteLine);
}

function createBlockquote(blockNum) {

    const TAG = blockNum + '-bq';

    const BLOCK = document.createElement("blockquote");

    BLOCK.classList.add("bquote");
    BLOCK.setAttribute("id", TAG);

    DISP_PLACE.appendChild(BLOCK);
}

function addHorizonLine() {

    DISP_PLACE.removeChild(DISP_PLACE.lastChild);
    const LAST = DISP_PLACE.lastChild;
    LAST.classList.add("horizonLine");
}

//parser inner text function (italics, bold, code, images, links)

function readInner() {

    let counter = -1;

    const TEXT = DISP_PLACE.innerHTML;
    const REGEX = /[\*|\_|\`]+[\!-\}\ ]+?[\*|\_|\`]+/gi;

    let matchText = new Array();
    let replacementText = new Array();
    let codeFlag = new Array();

    matchText = TEXT.match(REGEX);

    if (matchText != undefined) {

        matchText.forEach((element, index) => {
            codeFlag[index] = (element.charAt(0) == SPECIAL_CHAR[12]) ? true : false;
            replacementText[index] = element.slice(1, element.length - 1);
        });
    }

    let result = TEXT.replace(REGEX, () => {
        counter++;

        if (codeFlag[counter] == true) {
            tag = '<code>';
            endTag = '</code>';
        } else {

            let charNum = (replacementText[counter].charAt(0) == SPECIAL_CHAR[7]) ? 7 : 8;

            for (let i = 0; i < 3; i++) {

                if (replacementText[counter].charAt(i) != SPECIAL_CHAR[charNum]) {

                    switch (i) {

                        case 0:
                            tag = '<em>';
                            endTag = '</em>';
                            break;

                        case 1:
                            tag = '<strong>';
                            endTag = '</strong>';
                            replacementText[counter] = replacementText[counter].slice(1, replacementText[counter].length - 1);
                            break;

                        case 2:
                            tag = '<strong><em>';
                            endTag = '</strong></em>';
                            replacementText[counter] = replacementText[counter].slice(2, replacementText[counter].length - 2);
                            break;
                    }
                    i += 3;
                }
            }
        }

        replacementText[counter] = tag + replacementText[counter] + endTag;
        return replacementText[counter];
    });

    DISP_PLACE.innerHTML = result;
}