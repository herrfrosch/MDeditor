window.onload = () => {

    const DOC_LIST = document.getElementById('document-items');
    const PREVIEW_PLACE = document.getElementById('document-view');
    const DEL_BTN = document.getElementById('del-btn');
    const OPEN_BTN = document.getElementById('open-btn');

    let itemNum = localStorage.length / 3;
    let whichNote = undefined;

    DOC_LIST.innerHTML = '';

    if (itemNum > 0) {
        loadNotes(itemNum, DOC_LIST);
    } else {
        const EMPTY_LIST = document.createElement('div');
        EMPTY_LIST.innerText = 'Empty! There are no saved notes';
        EMPTY_LIST.className = 'document-item';
        EMPTY_LIST.setAttribute('id', 'item-no-hover');
        DOC_LIST.appendChild(EMPTY_LIST);
    }

    for (let i = 1; i <= itemNum; i++) {

        const NOTE_NAME = document.getElementById(i);

        NOTE_NAME.addEventListener('click', () => {
            whichNote = i;
            eventsForList(i, PREVIEW_PLACE, NOTE_NAME);
        });
    }

    DEL_BTN.addEventListener('click', () => {

        if (whichNote != undefined) {

            deleteNote(whichNote);
            itemNum--;
            DOC_LIST.innerHTML = '';
            whichNote = undefined;

            if (itemNum > 0) {
                loadNotes(itemNum, DOC_LIST);
            } else {
                const EMPTY_LIST = document.createElement('div');
                EMPTY_LIST.innerText = 'Empty! There are no saved notes';
                EMPTY_LIST.className = 'document-item';
                EMPTY_LIST.setAttribute('id', 'item-no-hover');
                DOC_LIST.appendChild(EMPTY_LIST);
            }

            PREVIEW_PLACE.innerHTML = '<h1>Library</h1><h4>Click note to view</h4>';
            animateNotification('Note deleted', 'delete');

        } else if (itemNum > 0 && whichNote == undefined) {
            animateNotification("Note isn't selected", 'select');
        } else {
            animateNotification("There isn't any saved notes", 'saved');
        }

        for (let i = 1; i <= itemNum; i++) {

            const NOTE_NAME = document.getElementById(i);

            NOTE_NAME.addEventListener('click', () => {
                whichNote = i;
                eventsForList(i, PREVIEW_PLACE, NOTE_NAME);
            });
        }
    });

    OPEN_BTN.addEventListener('click', () => {

        if (whichNote != undefined) {
            openEditor(whichNote);
        } else {
            animateNotification("Note isn't selected", 'select');
        }

    });
}

function loadNotes(itemsNum, LIST) {

    for (let i = 1; i <= itemsNum; i++) {

        let itemName = `note${i}`;

        let note = localStorage.getItem(itemName);
        let title = localStorage.getItem(`title${i}`);

        const LIST_ITEM = document.createElement('div');
        const TITLE = document.createElement('strong');
        const BREAK = document.createElement('br');

        TITLE.innerText = title;

        LIST_ITEM.className = 'document-item';
        LIST_ITEM.appendChild(TITLE);
        LIST_ITEM.appendChild(BREAK);

        LIST_ITEM.setAttribute('id', i);

        note = localStorage.getItem(itemName);
        let description = '';

        if (note.length >= 72) {
            for (let i = 0; i < 72; i++) { description += note[i]; }
            description += '...';
        } else {
            for (let i = 0; i < note.length; i++) { description += note[i]; }
        }

        LIST_ITEM.insertAdjacentText('beforeend', description);
        LIST.appendChild(LIST_ITEM);
    }
}

function deleteNote(noteNum) {

    let itemNum = parseInt(localStorage.length / 3);
    let keysArr = ['note', 'title', 'document'];

    localStorage.removeItem(`note${noteNum}`);
    localStorage.removeItem(`title${noteNum}`);
    localStorage.removeItem(`document${noteNum}`);

    for (let i = noteNum + 1; i <= itemNum; i++) {
        for (let j = 0; j < 3; j++) {

            let content = localStorage.getItem(`${keysArr[j]}${i}`);

            localStorage.setItem(`${keysArr[j]}${i - 1}`, content);
            localStorage.removeItem(`${keysArr[j]}${i}`);
        }
    }
}

function openEditor(noteNum) {
    localStorage.setItem('open', `${noteNum}`);
    window.open("./editor.html", "_self");
}

function eventsForList(i, DISP_PLACE, NOTE) {
    
    const IS_OPEN_NOTE = document.querySelector(`.open-cl`);

    if (IS_OPEN_NOTE) {
        IS_OPEN_NOTE.removeAttribute('class');
        IS_OPEN_NOTE.setAttribute('class', 'document-item')
        IS_OPEN_NOTE.style.backgroundColor = 'rgba(255, 255, 255, 0)';
    }

    NOTE.setAttribute('class', 'open-cl document-item');
    NOTE.style.backgroundColor = 'rgba(255, 255, 255, 1)';

    DISP_PLACE.innerHTML = localStorage.getItem(`document${i}`);
}

//animations

function animateNotification(message, tag) {

    let isAnotherNotifi = document.querySelectorAll(`div.mini-notification`);
    let isSameNotifi = null;

    if (isAnotherNotifi) {
        isSameNotifi = document.querySelector(`div.mini-notification#${tag}`);
    }

    if (!isSameNotifi) {
        const notification = document.createElement('div');
        notification.setAttribute('class', 'mini-notification');
        notification.setAttribute('id', tag);
        notification.innerText = message;
        document.body.appendChild(notification);

        if (isAnotherNotifi) {
            notification.style.bottom = `${isAnotherNotifi.length * 3.5}vw`;
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
            if (otherNotif.length > 0) {

                let height = otherNotif.length * 3.5;

                for (let i = otherNotif.length - 1; i >= 0; i--) {

                    height -= 3.5;
                    otherNotif[i].style.bottom = `${height}vw`;
                }
            }
        }
    }, 50);
}