window.onload = cookies();

function cookies() {
    const info = localStorage.getItem("cookies");

    if (info == null) {
        localStorage.clear();
        showInfo();
        handleInfo();
    }
}

function showInfo() {

    const info = document.createElement('div');
    info.style.position = 'fixed';
    info.style.bottom = '0';
    info.style.width = '100%';
    info.style.height = 'auto';
    info.style.backgroundColor = 'rgba(0, 0, 0, .8)';
    info.style.color = '#fff';
    info.style.textAlign = 'center';
    info.style.padding = '1% 2%';
    info.setAttribute('id', 'cookie-banner');
    info.innerHTML = "Emdeet uses cookies only to save your notes in your browser.</br>" +
        " Our cookies doesn't track you and don't identify you in the web. Learn more in the <a href=\"#\">Cookie Policy</a>.</br>";

    const okBtn = document.createElement('button');
    okBtn.style.width = 'auto';
    okBtn.style.borderRadius = '20px';
    okBtn.style.borderWidth = '1px';
    okBtn.style.borderColor = '#e9820c';
    okBtn.style.borderStyle = 'solid';
    okBtn.style.margin = '10px 5px 0 0';
    okBtn.style.padding = '0 8px';
    okBtn.innerText = "Ok";
    okBtn.setAttribute("id", "ok-btn");

    document.body.appendChild(info);
    info.appendChild(okBtn);
}

function handleInfo() {
    const okBtn = document.getElementById("ok-btn");

    okBtn.addEventListener("mouseover", () => { onBtnHover(okBtn); });
    okBtn.addEventListener("mouseleave", () => { offBtnHover(okBtn); });

    okBtn.addEventListener('click', () => { 

        document.body.removeChild(document.getElementById("cookie-banner"));
        localStorage.setItem("cookies", "true");
    });    
}

function onBtnHover(button) {
    let i = 255;

    const onInterval = setInterval(() => {

        if (i <= 0) {
            i = 0;
            clearInterval(onInterval);
        }

        i -= 15;
        let j = 255 - i;

        button.style.backgroundColor = `rgb(${i},${i},${i}, .2)`;
        button.style.color = `rgb(${j},${j},${j})`;

    }, 10);
}

function offBtnHover(button) {
    let i = 0

    const offInterval = setInterval(() => {

        if (i >= 255) {
            i = 255;
            clearInterval(offInterval);
        }

        i += 15;
        let j = 255 - i;

        button.style.backgroundColor = `rgb(${i},${i},${i})`;
        button.style.color = `rgb(${j},${j},${j})`;

    }, 10);
}