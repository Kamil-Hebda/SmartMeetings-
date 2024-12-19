document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup script loaded');
  
    const sendButton = document.getElementById('send');
    const startStopRecordingButton = document.getElementById('startStopRecording');
    let isRecording = false;
  
    // Obsługa przycisku "Zrób screenshot"
    if (sendButton) {
      sendButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          if (tabs.length === 0) {
            console.error('No active tab found.');
            return;
          }
          chrome.tabs.captureVisibleTab(tabs[0].windowId, { format: 'png' }, function(dataUrl) {
            if (chrome.runtime.lastError) {
              console.error('Error capturing screenshot:', chrome.runtime.lastError.message);
              return;
            }
            const newWindow = window.open();
            newWindow.document.write('<img src="' + dataUrl + '" />');
          });
        });
      });
    } else {
      console.error('Element with id "send" not found.');
    }
  
    // Obsługa przycisku "Rozpocznij/Zatrzymaj nagrywanie"
    if (startStopRecordingButton) {
      startStopRecordingButton.addEventListener('click', function() {
        if (isRecording) {
          console.log('Sending stopRecording message');
          chrome.runtime.sendMessage({ action: 'stopRecording' })
            .then(response => {
              if (response && response.status === 'recording stopped') {
                console.log('Recording stopped');
                startStopRecordingButton.textContent = 'Rozpocznij nagrywanie';
                startStopRecordingButton.className = 'btn btn-success';
                isRecording = false;
              } else {
                console.error('Error stopping recording:', response ? response.message : 'No response');
              }
            })
            .catch(error => {
              console.error('Error stopping recording:', error);
            });
  
        } else {
          console.log('Sending startRecording message');
          chrome.runtime.sendMessage({ action: 'startRecording' })
            .then(response => {
              if (response && response.status === 'recording started') {
                console.log('Recording started');
                startStopRecordingButton.textContent = 'Zatrzymaj nagrywanie';
                startStopRecordingButton.className = 'btn btn-danger';
                isRecording = true;
              } else {
                console.error('Error starting recording:', response ? response.message : 'No response');
              }
            })
            .catch(error => {
              console.error('Error starting recording:', error);
            });
        }
      });
    } else {
      console.error('Element with id "startStopRecording" not found.');
    }
  });

const recordTab = document.getElementById('tab');
const recordScreen = document.getElementById('screen');

const injectCamera = async () => {
  const tab = await chrome.tabs.query({ active: true, currentWindow: true });
  if(!tab) return;

  const tabId = tab[0].id;
  console.log('Tab ID:', tabId);
  await chrome.scripting.executeScript({
      files: ['content.js'],
      target: { tabId }
  });
}


const checkRecording = async () => {
  const recording = await chrome.storage.local.get(['recording', 'type']);
  const recordingStatus = recording.recording || false;
  const recordingType = recording.type || '';
  console.log('Recording status:', recordingStatus, recordingType);
  return { recordingStatus, recordingType };
}

const init = async () => {
  const recordingState = await checkRecording();

  console.log('Recording state:', recordingState);

  if (recordingState[0] === true) {
    if(recordingState[1] === 'tab') {
      recordTab.innerText = 'Stop recording';
    } else {
      recordScreen.innerText = 'Stop recording';
    }
  }

  const updateRecording = async (type) => {
    console.log('start-recording', type)

    const recordingState = await checkRecording();

    if (recordingState[0] === true) {
      await chrome.runtime.sendMessage({ type: 'stop-recording' });
    } else {
      await chrome.runtime.sendMessage({ type: 'start-recording', recordingType: type });

      injectCamera();
    }

  }

  recordTab.addEventListener('click', async() => {
    console.log('tab button clicked');
    updateRecording('tab');
  })

  recordScreen.addEventListener('click', async() => {
    console.log('screen button clicked');
    updateRecording('screen');
  })
}

init()