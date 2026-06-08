// var back = document.getElementById('back');
// window.onmousemove = function (event) {
//     var offsetX = (event.clientX - window.innerWidth / 2) / 10;
//     var offsetY = (event.clientY - window.innerHeight / 2) / 15;
//     back.style.backgroundPosition = 'calc(50% + ' + offsetX + 'px) calc(50% + ' + offsetY + 'px)';
// };

var demoModal = document.getElementById('demoModal');
var demoClose = document.getElementById('demoClose');

function showDemoModal() {
    demoModal.classList.add('show');
}

function hideDemoModal() {
    demoModal.classList.remove('show');
}

function login() {
    showDemoModal();
    return false;
}

document.getElementById('adminLogin').onclick = function () {
    showDemoModal();
};

document.getElementById('registerLink').onclick = function () {
    showDemoModal();
};

demoClose.onclick = hideDemoModal;

demoModal.onclick = function (event) {
    if (event.target === demoModal) {
        hideDemoModal();
    }
};

var con = document.getElementById('con');

function loadoff() {
    con.style.display = 'none';
}

function loadon() {
    con.style.display = 'flex';
}

window.onload = function () {
    loadon();
    setTimeout(loadoff, 3000);
};
