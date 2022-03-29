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

    const TAG = blockNum + '-bq';
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

    formatEmp();
    formatImage();
    formatLink();
    formatRefLink();
    formatAltLink();
}

function formatEmp() {

    let counter = -1;

    const TEXT = DISP_PLACE.innerHTML;
    const REGEX = /[\*|\_|\`]+.{1,}?[\*|\_|\`]+/gi;

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

function formatLink() {

    let counter = -1;

    const TEXT = DISP_PLACE.innerHTML;
    const REGEX = /\[+.{1,}?\]+?\(+.{1,}?\)/gi;

    let matchText = new Array();
    let linkName = new Array();
    let link = new Array();
    let tempList = new Array();
    let replacement = new Array();
    let titleAttr = new Array();
    let titleFlag = new Array();

    matchText = TEXT.match(REGEX);

    if (matchText != undefined) {
        matchText.forEach((element, index) => {
            tempList[index] = element.split('](');
        });
    }

    if (tempList != undefined) {
        tempList.forEach((element, index) => {

            linkName[index] = element[0].slice(1);
            link[index] = element[1].slice(0, -1);

        });
    }

    link.forEach((element, index) => {
        const REG = /\"{1}.{1,}?\"{1}?/gi;

        titleAttr[index] = element.match(REG);

        if (titleAttr[index] != null) {

            link[index] = link[index].replace(titleAttr[index], '').replace(' ', '');
            titleAttr[index] = titleAttr[index][0].slice(1, -1);

            titleFlag[index] = true;
        } else {
            titleFlag[index] = false;
        }

    })

    let result = TEXT.replace(REGEX, () => {
        counter++;

        if (titleFlag[counter] == true) {
            replacement[counter] = '<a href="' + link[counter] + '\" title=\"' + titleAttr[counter] + '">' + linkName[counter] + '</a>';
        } else {
            replacement[counter] = '<a href="' + link[counter] + '">' + linkName[counter] + '</a>';
        }

        return replacement[counter];
    });

    DISP_PLACE.innerHTML = result;
}

function formatRefLink() {

    let counter = -1;

    const REGEX = /\[+.{1,}?\]+?\[+.{1,}?\]/gi;
    const TEXT = DISP_PLACE.innerHTML;

    matchText = new Array();
    matchText = TEXT.match(REGEX);

    if (matchText != null) {

        let reference = new Array();
        let linkText = new Array();
        let preRef;

        matchText.forEach((element, index) => {
            preRef = element.split('][');
            reference[index] = preRef[1];
            linkText[index] = preRef[0].replace('[', '');
            reference[index] = '[' + reference[index] + ':';
        })

        let adRef = new Array();

        reference.forEach((element, index) => {
            adRef[index] = TEXT.indexOf(element)
        });

        let link = new Array();
        let title = new Array();

        adRef.forEach((element, index) => {

            if (element != -1) {

                for (let i = element; i < TEXT.length; i++) {

                    if (link[index] == null) {
                        link[index] = '';
                        link[index] = TEXT[i];
                    } else {
                        if (link[index].includes('</p>')) {
                            i = TEXT.length;
                            link[index] = link[index].slice(0, link[index].length - 4);
                        } else {
                            link[index] += TEXT[i];
                        }
                    }
                }
                let arrLink = link[index].split(' ');

                link[index] = arrLink[1];

                if (arrLink.length > 2) {
                    title[index] = '';
                    for (let i = 2; i < arrLink.length; i++) {
                        title[index] += arrLink[i] + ' ';
                    }
                }

            }
        })

        let linkTag = new Array();

        let result = TEXT.replace(REGEX, () => {

            counter++;
            if (link[counter] != null) {
                if (title[counter] != null) {
                    linkTag[counter] = '<a href="' + link[counter] + '" title="' + title[counter].replace('</p>', '') + '">' + linkText[counter] + '</a>';
                } else {
                    linkTag[counter] = '<a href="' + link[counter].replace('</p>', '') + '">' + linkText[counter] + '</a>';
                }
            } else {
                linkTag[counter] = '<a href="#">' + linkText[counter] + '</a>';                
            }

            return linkTag[counter];
        });

        let REF_REG = /\[{1}.+?\]{1}\:{1}\s{1}.+/gi;
        result = result.replace(REF_REG, '');

        DISP_PLACE.innerHTML = result;
    }

}

function formatAltLink() {

    let counter = -1;

    const TEXT = DISP_PLACE.innerHTML;
    const REGEX = /(&lt;){1}.{1,}?(&gt;)/gi

    let matchText = new Array();
    matchText = TEXT.match(REGEX);

    let result = TEXT.replace(REGEX, () => {

        counter++;

        let innerLink = matchText[counter].slice(4, -4);
        let link = '<a href="' + innerLink + '">' + innerLink + '</a>';

        return link;
    })

    DISP_PLACE.innerHTML = result;
}

function formatImage() {

    let counter = -1;

    const TEXT = DISP_PLACE.innerHTML;
    const REGEX = /\!+\[+.{1,}?\]+?\(+.{1,}?\)/gi;
    const INNER_REG = /\(+.{1,}?\)/gi;
    const TITLE_REG = /\"{1}.{1,}?\"{1}?/gi;

    let matchText = new Array();
    matchText = TEXT.match(REGEX);

    let result = TEXT.replace(REGEX, () => {

        counter++;

        let img;
        let imageSrc = matchText[counter].match(INNER_REG);
        let imgTitle = imageSrc[0].match(TITLE_REG);

        if (imgTitle != null) {
            imageSrc = imageSrc[0].replace(imgTitle[0], '')
                .replace('(', '')
                .replace(')', '')
                .replace(' ', '');
            imgTitle = imgTitle[0].replace('"', '');
            img = '<img src="' + imageSrc + '" title="' + imgTitle + '"/>';
        } else {
            imageSrc = imageSrc[0].replace('(', '').replace(')', '');
            img = '<img src="' + imageSrc + '"/>';
        }

        return img;
    })

    DISP_PLACE.innerHTML = result;
}