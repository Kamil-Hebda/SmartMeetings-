document.addEventListener('DOMContentLoaded', function() {
    const recordButton = document.getElementById('screen-record');
    let mediaRecorder;
    let recordingChunks = [];
    let isRecording = false;
    let stream;
    const body = document.querySelector('body');

    recordButton.addEventListener('click', function() {
        if (!isRecording) {
            body.style.width = '800px';
            body.style.height = '800px';
            startRecording();
        } else {
            stopRecording();
        }
    });

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true,
                audio: true
            });

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = handleDataAvailable;
            mediaRecorder.onstop = handleStop;
            mediaRecorder.start();
            recordButton.textContent = 'Stop nagrywanie';
            isRecording = true;
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    function handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            recordingChunks.push(event.data);
        }
    }

    function handleStop() {
        const blob = new Blob(recordingChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screen-recording.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        recordedChunks = [];
        recordButton.textContent = 'Start nagrywanie';
        isRecording = false;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

    function stopRecording() {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            console.log('Recording stopped');
        }
    }
});