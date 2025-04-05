chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "initiateCapture") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      // Forward the screenshot to content script for cropping
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "cropImage",
            dataUrl: dataUrl,
            cropParams: {
              x: request.x,
              y: request.y,
              width: request.width,
              height: request.height,
            },
          },
          (response) => {
            if (response.success) {
              // Download the cropped image
              chrome.downloads.download({
                url: response.croppedUrl,
                filename: `screenshot-${Date.now()}.png`,
              });
            } else {
              console.error("Cropping failed:", response.error);
            }
          }
        );
      });
    });
    // return true; // Keep message channel open for async response
  }
});
