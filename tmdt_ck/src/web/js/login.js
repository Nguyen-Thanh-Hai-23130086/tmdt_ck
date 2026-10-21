//====== LẤY PHẦN TỬ ======
const mainLayout = document.querySelector(".main-layout");
const signupButton = document.getElementById("signupButton");
const loginButton = document.querySelector(".login-top");
const registerLink = document.getElementById("registerLink");

//====== CHUYỂN GIAO DIỆN ======
function showRegisterMode(event) {
    event.preventDefault();

    if (mainLayout) {
        mainLayout.classList.add("register-mode");
    }
}

function showLoginMode(event) {
    event.preventDefault();

    if (mainLayout) {
        mainLayout.classList.remove("register-mode");
    }
}

//====== GẮN SỰ KIỆN ======
if (signupButton) {
    signupButton.addEventListener("click", showRegisterMode);
}

if (registerLink) {
    registerLink.addEventListener("click", showRegisterMode);
}

if (loginButton) {
    loginButton.addEventListener("click", showLoginMode);
}

//====== HIỆN / ẨN MẬT KHẨU ======
const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";
        togglePassword.setAttribute(
            "aria-label",
            isPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
        );
    });
}