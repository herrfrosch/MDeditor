const EDIT_PLACE = document.getElementById('work-place');
const DISP_PLACE = document.getElementById('display-area');

const SPECIAL_CHAR = [
    "#",//0
    "- ",//1
    "+ ",//2
    "=",//3
    "-",//4
    ">",//5
    "* ",//6
    "  ",//7
    "*",//8
    "_",//9
    ".",//10
    "\\",//11
    "!",//12
    "`",//13
    "[",//14
    "]"//15
];

EDIT_PLACE.addEventListener('input', parser);

function containOnly(toCheck, checker) {
    for (let i = 0; i < toCheck.length; i++) {
        if (toCheck[i] != checker) return false;
    }
    return true;
}

function parser() {
    DISP_PLACE.innerHTML = '';
    const MD_CODE = EDIT_PLACE.value.split('\n');
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

        for (let j = 0; j < 7; j++) {

            if (textarr[i].startsWith(SPECIAL_CHAR[j])) {

                flag = true;

                switch (j) {

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
                    case 6:
                        if (i > 0 && (textarr[i - 1].startsWith(SPECIAL_CHAR[1]) || textarr[i - 1].startsWith(SPECIAL_CHAR[2]) || textarr[i - 1].startsWith(SPECIAL_CHAR[6]))) {
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

        if (i > 0 && (containOnly(textarr[i], SPECIAL_CHAR[8]) || containOnly(textarr[i], SPECIAL_CHAR[9]) || containOnly(textarr[i], SPECIAL_CHAR[4])) && textarr[i] !== "" && textarr[i - 1] === "") {

            flag = true;
            addHorizonLine();
        }

        if (flag == false) {

            if (i > 0 && textarr[i - 1].endsWith(SPECIAL_CHAR[7])) {

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

    for (let a = 0; a < 8; a++) {

        if (headerText.charAt(a) != SPECIAL_CHAR[0] && a < 7) {

            const headerTag = 'h' + a;
            headerText = headerText.slice(a + 1, headerText.length);
            let header = document.createElement(headerTag);
            header.innerText = headerText;
            a = 8;

            return header;

        } else if (a >= 7) {

            a = 6;
            const headerTag = 'h' + a;
            headerText = headerText.split(' ').slice(1, headerText.length);
            let hdTxt = "";

            headerText.forEach((element) => {
                hdTxt += element;
                hdTxt += " ";
            });

            let header = document.createElement(headerTag);
            header.innerText = hdTxt;
            a = 8;

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
    let headerQuote, inBlock;

    for (let i = 0; i < 7; i++) {
        if (quote.charAt(1) == SPECIAL_CHAR[i] || quote.charAt(0) == SPECIAL_CHAR[i]) {
            switch (i) {
                case 0:
                    if (quote.charAt(1) == SPECIAL_CHAR[0] && quote.charAt(0) != SPECIAL_CHAR[0]) {
                        quote = quote.slice(1, quote.length);
                    }
                    headerQuote = addHeading(quote);
                    break;
                case 5:
                    const TAG = blockNum + '-bq2';

                    inBlock = document.createElement("blockquote");
                    inBlock.classList.add("bquote");
                    inBlock.setAttribute("id", TAG);
                    inBlock.innerText = quote.slice(1, quote.length);

                    break;
            }
        }
    }

    let quoteLine = document.createElement("p");

    if (headerQuote != undefined) {
        quoteLine.appendChild(headerQuote);
    } else if (inBlock != undefined) {
        quoteLine.appendChild(inBlock);
    } else {
        quoteLine.innerText = quote;
    }

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
    let altCounter = -1;

    const TEXT = DISP_PLACE.innerHTML;
    const REGEX = /[\*|\_|\`]+.{1,}?[\*|\_|\`]+/gi;
    const ALT_REGEX = /\`{1}\`+.{1,}?\`{1}\`/gi;

    let matchText = new Array();
    let replacementText = new Array();
    let codeFlag = new Array();
    let doubleCode = new Array();
    let doubleText = new Array();

    doubleCode = TEXT.match(ALT_REGEX);
    if (doubleCode != undefined) {
        doubleCode.forEach((element, index) => {
            doubleText[index] = element.slice(2, element.length - 2);
        });
    }

    let partialResult = TEXT.replace(ALT_REGEX, () => {
        altCounter++;
        doubleText[altCounter] = "<code>" + doubleText[altCounter] + "</code>";
        return doubleText[altCounter].replaceAll('`', '&grave;');
    });

    matchText = partialResult.match(REGEX);
    if (matchText != undefined) {
        matchText.forEach((element, index) => {
            codeFlag[index] = (element.charAt(0) == SPECIAL_CHAR[13]) ? true : false;
            replacementText[index] = element.slice(1, element.length - 1);
        });
    }

    let result = partialResult.replace(REGEX, () => {

        let tag, endTag;
        counter++;

        if (codeFlag[counter] == true) {
            tag = '<code>';
            endTag = '</code>';
        } else {
            for (let i = 0; i < 3; i++) {
                if (replacementText[counter].charAt(i) != SPECIAL_CHAR[8] && replacementText[counter].charAt(i) != SPECIAL_CHAR[9]) {
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

    let matchText = new Array();
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
    });

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

//save export functions

function upload() {

    const UP_BTN = document.getElementById('upload');
    const EX_BTN = document.getElementById('export');

    const POPUP = document.getElementById('popup-input');
    const FILE_INPUT = document.getElementById('upload-file');
    const CLOSE_BTN = document.getElementById('popup-close');
    const CLOSE_BTN_MOBILE = document.getElementById('mobile-close');
    const UPL_BTN = document.getElementById('upload-btn');
    const SECTION = document.querySelectorAll("section");
    const SMALL_TAG = document.querySelectorAll(".window-tag");

    if (window.File && window.FileReader && window.FileList && window.Blob) {

        UP_BTN.addEventListener("click", () => {

            SECTION.forEach((element) => { element.style.position = "static"; });
            SMALL_TAG.forEach((element) => { element.style.display = "none"; });

            POPUP.style.display = "inline";
            FILE_INPUT.addEventListener("change", () => {

                const reader = new FileReader();

                reader.readAsText(FILE_INPUT.files[0]);
                reader.onload = () => {

                    let text = reader.result;

                    UPL_BTN.removeAttribute("disabled");
                    UPL_BTN.addEventListener("click", () => {

                        EDIT_PLACE.value = text;
                        POPUP.style.display = "none";

                        parser(); //possibility of html injection
                        SECTION.forEach((element) => { element.style.position = "relative"; });
                        SMALL_TAG.forEach((element) => { element.style.display = "inline"; });
                    });
                }
            });

        });

        CLOSE_BTN.addEventListener('click', () => { 
            SECTION.forEach((element) => { element.style.position = "relative"; });
            SMALL_TAG.forEach((element) => { element.style.display = "inline"; });
            POPUP.style.display = "none"; 
        });
        CLOSE_BTN_MOBILE.addEventListener('click', () => { POPUP.style.display = "none"; });

        EX_BTN.addEventListener('click', () => {
            if (EDIT_PLACE.value != "") {
                let downloadFile = new Blob([EDIT_PLACE.value], { type: 'text/MD' });
                let anchor = document.createElement('a');
                anchor.download = EDIT_PLACE.value.split(' ')[0] + '.md';
                anchor.href = window.URL.createObjectURL(downloadFile);
                anchor.click();
            } else {
                alert('File is empty');
            }
        });
    } else {
        alert("Your browser doesn't support FILE API, please update or change your browser");
    }

    saveDocument();
}

//saving in browser

function saveDocument() {
    const SAVE_BTN = document.getElementById('save');
    const TITLE_INPUT = document.getElementById('doc-title');
    const NEW_BTN = document.getElementById('new-doc');

    let documentsNum = localStorage.length;
    let noteNum = 0;

    let whichOpen = localStorage.getItem('open');

    if (documentsNum > 0 && whichOpen == null) {
        noteNum = documentsNum / 3;
        noteNum = parseInt(noteNum, 10);
        loadDocument(noteNum);
    } else if (documentsNum > 0 && whichOpen != null) {
        localStorage.removeItem('open');
        loadDocument(whichOpen);
        noteNum = whichOpen - 1;
        whichOpen = null;
    }

    SAVE_BTN.addEventListener('click', () => {

        if (EDIT_PLACE.value != '' && TITLE_INPUT.value != '') {

            noteNum++;

            localStorage.setItem(`note${noteNum}`, EDIT_PLACE.value);
            localStorage.setItem(`document${noteNum}`, DISP_PLACE.innerHTML);
            localStorage.setItem(`title${noteNum}`, TITLE_INPUT.value);

            animateNotification('File saved successfully', 'success');
        } else if (EDIT_PLACE.value != '' && TITLE_INPUT.value == '') {
            animateNotification("Enter a title", 'title');
            TITLE_INPUT.focus();
        } else {
            animateNotification("There's nothing to save", 'save');
        }
    });

    NEW_BTN.addEventListener('click', () => {
        EDIT_PLACE.value = '';
        TITLE_INPUT.value = '';
        parser();
        animateNotification('Created new note', 'new');
    });
}

function loadDocument(noteNum) {
    let documentString = localStorage.getItem(`note${noteNum}`);
    let titleString = localStorage.getItem(`title${noteNum}`);
    EDIT_PLACE.value = documentString;
    document.getElementById('doc-title').value = titleString;
    parser();
}

// animations

function animateNotification(message, tag) {

    let isAnotherNotifi = document.querySelectorAll(`div.mini-notification`);
    let isSameNotifi = null;
    let heightArr = new Array();

    if (isAnotherNotifi) {
        isAnotherNotifi.forEach((element, index) => { heightArr[index] = element.clientHeight ;});
        isSameNotifi = document.querySelector(`div.mini-notification#${tag}`);
    }

    if (!isSameNotifi) {
        const notification = document.createElement('div');
        notification.setAttribute('class', 'mini-notification');
        notification.setAttribute('id', tag);
        notification.innerText = message;
        document.body.appendChild(notification);

        if (isAnotherNotifi) {
            notification.style.bottom = `${ spaceBetween(heightArr) }px`;
        }

        let transparency = 0.0;
        let isClosed = false;

        const showAnimation = setInterval(() => {
            transparency += 0.2;

            notification.style.backgroundColor = `rgba(255, 255, 255, ${transparency})`;
            notification.style.borderColor = `rgba(0, 0, 0, ${transparency})`;
            notification.style.color = `rgba(0, 0, 0, ${transparency})`;

            if (transparency >= 1.0) {
                clearInterval(showAnimation);
            }
        }, 50);

        notification.addEventListener('click', () => {
            closeAnimation(transparency, notification);
            isClosed = true;
        });

        setTimeout(() => {
            if (!isClosed) {
                closeAnimation(transparency, notification);
            }
        }, 5000);
    }
}

function closeAnimation(transparency, notification) {
    const closeAnimation = setInterval(() => {
        transparency -= 0.2;

        notification.style.backgroundColor = `rgba(255, 255, 255, ${transparency})`;
        notification.style.borderColor = `rgba(0, 0, 0, ${transparency})`;
        notification.style.color = `rgba(0, 0, 0, ${transparency})`;

        if (transparency <= 0.0) {
            clearInterval(closeAnimation);
            document.body.removeChild(notification);

            let otherNotif = document.querySelectorAll('div.mini-notification');
            let otherNotifHeight = new Array();
            otherNotif.forEach((element, index) => { otherNotifHeight[index] = element.clientHeight; });

            if (otherNotif.length > 0) {

                let heightSum = spaceBetween(otherNotifHeight);
                let height = heightSum / otherNotif.length;
 
                for (let i = otherNotif.length - 1; i >= 0; i--) {

                    heightSum -= height;
                    otherNotif[i].style.bottom = `${ heightSum }px`;
                }
            }
        }
    }, 50);
}

function spaceBetween(heightArr) {
    let retVal = 0;
    heightArr.forEach( (element) => { retVal += (element + 8); } );
    return retVal;
}