const runCode = async () => {
    const cameraElement = document.querySelector('#camera');
    console.log('cameraElement', cameraElement);

    const permissions = await navigator.permissions.query({ name: 'camera' });

    if (permissions.state === 'prompt') {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        return;
    }

    if (permissions.state === 'denied') {
        alter('Camera permission is required')
        return;
    }

    console.log(permissions)

    const startCamera = async () => {
        const videoElement = document.createElement('video');
        videoElement.setAttribute('style', `
            height: 200px;
            border-radius: 100px;
            transform: scaleX(-1);
        `);
        videoElement.autoplay = true;
        videoElement.muted = true;

        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        videoElement.srcObject = cameraStream;

        cameraElement.appendChild(videoElement);
    }

    startCamera()
}

runCode()