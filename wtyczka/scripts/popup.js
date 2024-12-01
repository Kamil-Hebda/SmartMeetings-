document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('send');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: 'png' }, function(dataUrl) {
                    const newWindow = window.open();
                    newWindow.document.write('<img src="' + dataUrl + '" />');
                });
            });
        });
    } else {
        console.error('Element with id "send" not found.');
    }
});
