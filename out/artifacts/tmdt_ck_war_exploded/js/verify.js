
const contextPath = window.TALENTMATCH_CONTEXT_PATH || "";

const form = document.getElementById("verifyForm");
const codeInput = document.getElementById("code");
const button = document.getElementById("verifyButton");
const message = document.getElementById("message");
const emailDisplay = document.getElementById("verifyEmail");

const email = emailDisplay.textContent.trim();

function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

if (!email) {
    emailDisplay.textContent = "Không tìm thấy email đăng ký";
    form.hidden = true;

    showMessage(
        "Không tìm thấy email cần xác nhận. Vui lòng đăng ký lại.",
        "error"
    );
}

codeInput.addEventListener("input", function () {
    codeInput.value = codeInput.value
        .replace(/[^0-9]/g, "")
        .slice(0, 6);
});

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!email) {
        showMessage("Không tìm thấy email cần xác nhận.", "error");
        return;
    }

    const code = codeInput.value.trim();

    if (!/^[0-9]{6}$/.test(code)) {
        showMessage("Vui lòng nhập mã xác nhận gồm 6 chữ số.", "error");
        return;
    }

    button.disabled = true;
    button.textContent = "Đang xác nhận...";
    message.className = "";
    message.textContent = "";

    try {
        const response = await fetch(
            contextPath + "/api/auth/verify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    code: code
                })
            }
        );

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            throw new Error(
                "Máy chủ chưa trả về JSON. Hãy kiểm tra endpoint xác nhận email."
            );
        }

        const data = await response.json();

        if (!response.ok || data.success === false) {
            throw new Error(
                data.message ||
                data.error ||
                "Mã xác nhận không hợp lệ hoặc đã hết hạn."
            );
        }

        showMessage(
            data.message || "Xác nhận email thành công! Bạn có thể đăng nhập.",
            "success"
        );

        button.textContent = "Xác nhận thành công";

        form.querySelectorAll("input").forEach(function (input) {
            input.disabled = true;
        });

        setTimeout(function () {
            window.location.href = contextPath + "/login";
        }, 1800);

    } catch (error) {
        showMessage(
            error.message || "Không thể kết nối máy chủ. Vui lòng thử lại.",
            "error"
        );

        button.disabled = false;
        button.textContent = "Xác nhận email";
    }
});