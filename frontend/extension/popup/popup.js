
document.addEventListener("DOMContentLoaded", async () => {
  const askBtn = document.getElementById("askBtn");
  const clearBtn = document.getElementById("clearBtn");
  const questionInput = document.getElementById("question");
  const previewDiv = document.getElementById("preview");
  const answerDiv = document.getElementById("answer");

  let ignoreHighlight = false;
  let cachedContext = null;

  async function getActiveTab() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });
    return tab;
  }

  function loadContext(tabId) {
    chrome.tabs.sendMessage(tabId, { type: "GET_CONTEXT" }, (context) => {
      if (chrome.runtime.lastError || !context) {
        previewDiv.textContent = "No page context available.";
        return;
      }

      cachedContext = context;

      if (context.highlightedText) {
        previewDiv.textContent =
          context.highlightedText.slice(0, 200) +
          (context.highlightedText.length > 200 ? "..." : "");
        clearBtn.style.display = "block";
      } else {
        previewDiv.textContent =
          "No text selected. The question will use the full page.";
        clearBtn.style.display = "none";
      }
    });
  }

  const tab = await getActiveTab();
  loadContext(tab.id);

  clearBtn.addEventListener("click", () => {
    ignoreHighlight = true;
    previewDiv.textContent =
      "Selection cleared. The question will use the full page.";
    clearBtn.style.display = "none";
  });

  askBtn.addEventListener("click", () => {
    const question = questionInput.value.trim();
    if (!question) {
      answerDiv.textContent = "Please enter a question.";
      return;
    }

    answerDiv.textContent = "Thinking...";

    const payload = {
      question,
      highlightedText:
        ignoreHighlight ? null : cachedContext?.highlightedText,
      documentContext: cachedContext?.documentContext,
      sourceType: "html"
    };

    // MOCK RESPONSE – replace with backend later
    answerDiv.textContent =
      "This is a mock answer.\n\nThe question was answered correctly using the selected context.";

    console.log("Payload sent to backend:", payload);
  });
});
