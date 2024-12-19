window.cameraID = 'camera1';
window.camera = document.getElementById(cameraID);

if (window.camera) {
    console.log('camera found', camera);
} else {
    const cameraElement = document.createElement('iframe');
    cameraElement.id = cameraID;
    cameraElement.setAttribute(
        'style',
        'all: initial; position: fixed; width: 200px; height: 200px; border-radius: 100px; background: black; z-index: 999999; right: 10px; top: 10px; border: none;'
    )

    cameraElement.setAttribute('allow', 'camera; microphone');

    cameraElement.src = chrome.runtime.getURL('../camera.html');
    document.body.appendChild(cameraElement);
}