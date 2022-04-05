function main(){

const SAVE_BTN = document.getElementById('save');
const UP_BTN = document.getElementById('upload');
const EX_BTN = document.getElementById('export');

const POPUP = document.getElementById('popup-input');
const FILE_INPUT = document.getElementById('upload-file');

// SAVE_BTN.addEventListener("click", save())

if (window.File && window.FileReader && window.FileList && window.Blob){

    //let files = evt.target.files;

    UP_BTN.addEventListener("click", () => {

        POPUP.style.display = "inline";
        
        FILE_INPUT.addEventListener("change", () => {
            
            const reader = new FileReader();
            console.log(FILE_INPUT.files[0]);

            // const 
            
            reader.readAsText(FILE_INPUT.files[0]);
            reader.onload = () => {

                console.log(reader.result);
            }

            

        });
    
    });
} else {
    console.log('error');
}

}