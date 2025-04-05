document.getElementById("startSelection").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // Inject new overlay
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["selection-overlay.js"],
    });
  });
});
