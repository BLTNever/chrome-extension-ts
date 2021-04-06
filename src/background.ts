function polling() {
    console.log("polling");
    setTimeout(polling, 1000 * 30);
}

polling();

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(request);
        chrome.cookies.getAll({
            url: request.url
        }, (cks) => {
            let cookie = cks.map((item) => {
                return item.name + "=" + item.value
            }).join(";") + ";";
            console.log('cookie:', cookie);
        });
        sendResponse("cookie update are trigger");
    });