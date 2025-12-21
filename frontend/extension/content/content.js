// Cache the last highlighted text
let lastHighlightedText = null;

// Listen for text selection changes on the page
document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  const text = selection ? selection.toString().trim() : "";

  if (text) {
    lastHighlightedText = text;
  }
});

// Respond to popup requests for context
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_CONTEXT") {
    sendResponse({
      highlightedText: lastHighlightedText,
      documentContext: document.body.innerText || ""
    });
  }
});
