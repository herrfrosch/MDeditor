function main() {

    //const SAVE_BTN = document.getElementById('save');
    const UP_BTN = document.getElementById('upload');
    const EX_BTN = document.getElementById('export');

    const POPUP = document.getElementById('popup-input');
    const FILE_INPUT = document.getElementById('upload-file');
    const WORK_PLACE = document.getElementById('work-place');

    if (window.File && window.FileReader && window.FileList && window.Blob) {

        UP_BTN.addEventListener("click", () => {

            POPUP.style.display = "inline";

            FILE_INPUT.addEventListener("change", () => {

                const reader = new FileReader();

                reader.readAsText(FILE_INPUT.files[0]);
                reader.onload = () => {

                    let text = reader.result;

                    text = text.replaceAll('<', '&lt;');
                    text = text.replaceAll('>', '&gt;');
                    /*there is issue that it doesn't change automaticaly*/
                    WORK_PLACE.value = text;//add 'upload' button and change innerHTML after clicking
                    POPUP.style.display = "none";//disappering after clicking 'upload' 
                }
            });
        });
    } else {
        alert("Your browser doesn't support FILE API, please update or change your browser");
    }

}