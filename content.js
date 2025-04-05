chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cropImage") {
    cropImage(request.dataUrl, request.cropParams)
      .then((croppedUrl) => sendResponse({ success: true, croppedUrl }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open for async response
  }
});

async function cropImage(dataUrl, { x, y, width, height }) {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        resolve(canvas.toDataURL("image/png"));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = dataUrl;
  });
}
