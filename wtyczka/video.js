const downloadVideo = (videoUrl) => {
  console.log("Attempting to download video from: ", videoUrl);

  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = 'recorded_meeting.webm';
  document.body.appendChild(link);

  link.click();
  document.body.removeChild(link);
setTimeout(() => {
    chrome.runtime.reload();
}, 500);
};



// on page open, check if there is a video url
chrome.storage.local.get(["videoUrl"], (result) => {
  console.log("video url", result);
  if (result.videoUrl) {
    console.log("download video from storage", result);
    //downloadVideo(result.videoUrl);
    chrome.storage.local.remove(["videoUrl"])
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  switch (message.type) {
    case "play-video":
      console.log("download video", message);
      downloadVideo(message?.videoUrl || message?.base64);
      break;
    default:
      console.log("default");
  }
});