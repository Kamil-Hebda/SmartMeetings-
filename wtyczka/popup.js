const recordTab = document.querySelector("#tab");
const recordScreen = document.querySelector("#screen");
const generateNotesButton = document.querySelector("#generate_ss");


// check chrome storage if recording is on
const checkRecording = async () => {
  const recording = await chrome.storage.local.get(["recording", "type"]);
  const recordingStatus = recording.recording || false;
  const recordingType = recording.type || "";
  console.log("recording status", recordingStatus, recordingType);
  return [recordingStatus, recordingType];
};

const init = async () => {
  const recordingState = await checkRecording();

  console.log("recording state", recordingState);

  if (recordingState[0] === true) {
    if (recordingState[1] === "tab") {
      recordTab.innerText = "Zatrzymaj nagrywanie karty";
    } else {
      recordScreen.innerText = "Zatrzymaj nagrywanie ekranu";
    }
  }

  const updateRecording = async (type) => {
    console.log("start recording", type);

    const recordingState = await checkRecording();

    if (recordingState[0] === true) {
      // stop recording
      chrome.runtime.sendMessage({ type: "stop-recording" });
    } else {
      // send message to service worker to start recording
      chrome.runtime.sendMessage({
        type: "start-recording",
        recordingType: type,
      });
    }

    // close popup
    window.close();
  };

   generateNotesButton.addEventListener('click', function() {
        const notesService = 'http://localhost:5173/';
        window.open(notesService, '_blank');
    });


  recordTab.addEventListener("click", async () => {
    console.log("updateRecording tab clicked");
    updateRecording("tab");
  });

  recordScreen.addEventListener("click", async () => {
    console.log("updateRecording screen clicked");
    updateRecording("screen");
  });
};

init();
