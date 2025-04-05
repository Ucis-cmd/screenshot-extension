(function () {
  // Create overlay div
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999999";
  overlay.style.cursor = "crosshair";

  // Create selection rectangle
  const selection = document.createElement("div");
  selection.style.position = "absolute";
  selection.style.border = "2px dashed #fff";
  selection.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
  selection.style.display = "none";
  overlay.appendChild(selection);

  document.body.appendChild(overlay);

  let startX,
    startY,
    isSelecting = false;

  overlay.addEventListener("mousedown", (e) => {
    isSelecting = true;
    startX = e.clientX;
    startY = e.clientY;
    selection.style.left = `${startX}px`;
    selection.style.top = `${startY}px`;
    selection.style.width = "0px";
    selection.style.height = "0px";
    selection.style.display = "block";
  });

  overlay.addEventListener("mousemove", (e) => {
    if (!isSelecting) return;

    const currentX = e.clientX;
    const currentY = e.clientY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);

    selection.style.left = `${left}px`;
    selection.style.top = `${top}px`;
    selection.style.width = `${width}px`;
    selection.style.height = `${height}px`;
  });

  overlay.addEventListener("mouseup", async () => {
    isSelecting = false;

    const rect = selection.getBoundingClientRect();
    document.body.removeChild(overlay);

    try {
      console.log(rect.left, rect.top, rect.width, rect.height);

      await chrome.runtime.sendMessage({
        action: "initiateCapture",
        x: Math.round(rect.left + window.scrollX),
        y: Math.round(rect.top + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      });
    } catch (error) {
      console.error("Error capturing selection:", error);
    }
  });

  // Allow canceling with ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      isSelecting = false;
      overlay.remove();
    }
  });
})();
