chrome.runtime.onMessage.addListener(async function (msg, sender, sendResponse) {
    if (msg.url) {
        console.log("Receive url = " + msg.url);
        chrome.cookies.getAll({
            url: msg.url
        }, (cks) => {
            let cookie = cks.map((item) => {
                return item.name + "=" + item.value
            }).join(";") + ";";
            console.log('cookie:', cookie);
        });

        // document.body.style.backgroundurl = msg.url;
        sendResponse("Change url to " + msg.url);
    } else {
        sendResponse("Color message is none.");
    }
});



