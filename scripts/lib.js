window.onload = () => {
    const DOC_LIST = document.getElementById('document-list');

    if (localStorage.length > 0) {
        console.log('here');
        loadNotes(localStorage.length, DOC_LIST);
    } else {
        console.log('tutej');
        const EMPTY_LIST = document.createElement('div');
        EMPTY_LIST.innerText = 'Empty! There are no saved notes';
        EMPTY_LIST.className = 'document-item';
        DOC_LIST.appendChild(EMPTY_LIST);
    }

    DOC_LIST.addEventListener('click', () => {
        console.log(localStorage.length, localStorage);
    });
}

function loadNotes(itemsNum, LIST) {

    for (let i = 0; i < itemsNum - 1; i++) {

        let itemName = `note${i}`;
        let note = localStorage.getItem(itemName);

        const LIST_ITEM = document.createElement('div');
        LIST_ITEM.className = 'document-item';

        note = note.split(' ');

        const TITLE = document.createElement('strong');
        const BREAK = document.createElement('br');

        TITLE.innerText = note[0];

        LIST_ITEM.appendChild(TITLE);
        LIST_ITEM.appendChild(BREAK);

        note = localStorage.getItem(itemName);
        console.log(note);
        let description = '';

        if (note.length >= 72) {
            for (let i = 0; i < 72; i++) { description += note[i]; }
        } else {
            for (let i = 0; i < note.length; i++) { description += note[i]; }
        }

        LIST_ITEM.insertAdjacentText('beforeend', description);
        LIST.appendChild(LIST_ITEM);
    }
}