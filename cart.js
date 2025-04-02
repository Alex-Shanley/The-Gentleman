document.addEventListener("DOMContentLoaded", function() {
    const messageBox = document.querySelector(".Message");
    const charCount = document.createElement("div");
    messageBox.parentNode.appendChild(charCount);

    const maxChars = 300;

    messageBox.addEventListener("input", function() {
        const remainingChars = maxChars - messageBox.value.length;
        charCount.textContent = `${remainingChars} characters remaining`;
    });
});

