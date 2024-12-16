let mediaRecorder;
let recordedChunks = [];
let isRecording = false;

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    console.log('Received message:', message);

    if (message.action === 'startRecording') {
      return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length === 0) {
            console.error('No active tab found.');
            reject({ status: 'error', message: 'No active tab found' });
            return;
          }

          const sourceType = message.sourceType || 'tab';

          chrome.desktopCapture.chooseDesktopMedia(['screen', 'window', 'tab'], tabs[0], (streamId) => {
            if (!streamId) {
              console.error('Error capturing tab: No streamId');
              reject({ status: 'error', message: 'No streamId' });
              return;
            }

            // Przechwytujemy strumień w background script
            navigator.mediaDevices.getUserMedia({
              audio: {
                mandatory: {
                  chromeMediaSource: sourceType,
                  chromeMediaSourceId: streamId
                }
              },
              video: {
                mandatory: {
                  chromeMediaSource: sourceType,
                  chromeMediaSourceId: streamId
                }
              }
            }).then((stream) => {
              console.log('Capture started successfully');

              mediaRecorder = new MediaRecorder(stream);
              recordedChunks = [];

              mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                  recordedChunks.push(event.data);
                }
              };

              mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                chrome.runtime.sendMessage({ action: 'download', url: url });
                console.log('Recording saved');

                // Zatrzymujemy strumień po zakończeniu nagrywania
                stream.getTracks().forEach(track => track.stop()); 
              };

              mediaRecorder.start();
              isRecording = true;

              resolve({ status: 'recording started' });

            }).catch((error) => {
              console.error('Error capturing media:', error);
              reject(error);
            });

          });
        });
      });
    }

    if (message.action === 'stopRecording') {
      return new Promise((resolve, reject) => {
        if (mediaRecorder && isRecording) {
          mediaRecorder.stop();
          isRecording = false;
          resolve({ status: 'recording stopped' });
        } else {
          reject({ status: 'error', message: 'No active recording' });
        }
      });
    }

    if (message.action === 'download' && message.url) {
      chrome.downloads.download({
        url: message.url,
        filename: 'recording.webm'
      });
      sendResponse({ status: 'ok' });
    }

  } catch (e) {
    console.error('Unhandled error in background script:', e);
    sendResponse({ status: 'error', message: e.message });
  }
});