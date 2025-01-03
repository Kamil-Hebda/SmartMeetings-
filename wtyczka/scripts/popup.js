document.addEventListener('DOMContentLoaded', function() {
    console.log('Popup script loaded');
  
    const sendButton = document.getElementById('send');
  
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
  

  });