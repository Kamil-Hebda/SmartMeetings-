chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('message received', request, sender);

    switch (request.type) {
        case 'start-recording':
            console.log('start recording', request);
            break;
        case 'stop-recording':
            console.log('stop recording', request);
            break;
        default:
            console.error('default case')
    }

    return true;
});