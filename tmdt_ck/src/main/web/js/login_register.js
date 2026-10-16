//====== LẤY PHẦN TỬ ======
const mainLayout = document.querySelector(".main-layout");
const signupButton = document.getElementById("signupButton");
const loginButton = document.querySelector(".login-top");
const registerLink = document.getElementById("registerLink");

//====== CHUYỂN GIAO DIỆN ======
function showRegisterMode(event) {
    event.preventDefault();
    mainLayout.classList.add("register-mode");
}

function showLoginMode(event) {
    event.preventDefault();
    mainLayout.classList.remove("register-mode");
}

//====== GẮN SỰ KIỆN ======
signupButton.addEventListener("click", showRegisterMode);
registerLink.addEventListener("click", showRegisterMode);
loginButton.addEventListener("click", showLoginMode);