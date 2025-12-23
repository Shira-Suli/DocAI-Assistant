chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_CONTEXT") {
    sendResponse({
      highlightedText: window.getSelection()?.toString() || "",
      documentContext: document.body?.innerText || ""
    });
  }
});
