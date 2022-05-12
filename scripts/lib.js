window.onload = () => {
    const DOC_LIST = document.getElementById('document-list');

    let itemNum = localStorage.length / 3;

    if ( itemNum > 0) {
        loadNotes(itemNum, DOC_LIST);
    } else {
        const EMPTY_LIST = document.createElement('div');
        EMPTY_LIST.innerText = 'Empty! There are no saved notes';
        EMPTY_LIST.className = 'document-item';
        DOC_LIST.appendChild(EMPTY_LIST);
    }

    DOC_LIST.addEventListener('click', () => {
        console.log(itemNum, localStorage);
    });
}

function loadNotes(itemsNum, LIST) {

    for (let i = 1; i <= itemsNum; i++) {

        let itemName = `note${i}`;
        let titleName = `title${i}`;
        
        let note = localStorage.getItem(itemName);
        let title = localStorage.getItem(titleName);

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
        } else {
            for (let i = 0; i < note.length; i++) { description += note[i]; }
        }

        LIST_ITEM.insertAdjacentText('beforeend', description);
        LIST.appendChild(LIST_ITEM);
    }
}