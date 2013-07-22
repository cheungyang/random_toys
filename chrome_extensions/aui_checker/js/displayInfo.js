function main() {
    var output = chrome.extension.getBackgroundPage().output,
        msg = document.getElementById("msg");

    msg.innerHTML = output["msg"];
}

window.onload = main;