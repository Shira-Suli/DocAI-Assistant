// import React, { useEffect, useState } from "react";
// import { createRoot } from "react-dom/client";
// import "./popup.css";
// import { marked } from "marked";

// /* ---------- markdown renderer (bold only) ---------- */
// function renderMarkdown(text) {
//   if (!text) return "";
//   return marked.parse(text);
// }


// function Popup() {
//   const [question, setQuestion] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [context, setContext] = useState(null);
//   const [largeFont, setLargeFont] = useState(false);
//   const [ignoreHighlight, setIgnoreHighlight] = useState(false);

//   /* ---------- get page context ---------- */
//   useEffect(() => {
//     chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
//       chrome.tabs.sendMessage(tab.id, { type: "GET_CONTEXT" }, (ctx) => {
//         setContext(ctx);
//         setIgnoreHighlight(false); // reset when popup opens
//       });
//     });
//   }, []);

//   /* ---------- ask AI ---------- */
//   async function askAI() {
//     if (!question.trim()) return;

//     const updatedMessages = [
//       ...messages,
//       { role: "user", content: question }
//     ];

//     setMessages(updatedMessages);
//     setQuestion("");

//     const res = await fetch("http://localhost:3000/ask", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         question,
//         chatHistory: updatedMessages,
//         highlightedText: ignoreHighlight
//           ? null
//           : context?.highlightedText,
//         documentContext: context?.documentContext
//       })
//     });

//     const data = await res.json();

//     setMessages([
//       ...updatedMessages,
//       {
//         role: "assistant",
//         content: data.answer || "No answer returned."
//       }
//     ]);

//     /* ---------- clear highlight after first answer ---------- */
//     setIgnoreHighlight(true);
//   }

//   return (
//     <div className="container">
//       {/* Header */}
//       <div className="header">✨ Ask AI</div>

//       {/* Question input */}
//       <textarea
//         placeholder="Ask a question about this page..."
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//       />

//       <button onClick={askAI}>Ask AI</button>

//       {/* Font size toggle */}
//       <button
//         className="font-toggle"
//         onClick={() => setLargeFont(!largeFont)}
//       >
//         {largeFont ? "-font size" : "+font size"}
//       </button>

//       {/* Highlight preview (shown once) */}
//       {!ignoreHighlight && context?.highlightedText && (
//         <div className="preview">
//           {context.highlightedText.slice(0, 200)}
//         </div>
//       )}

//       {/* Conversation */}
//       <div className={`chat ${largeFont ? "large" : ""}`}>
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={msg.role}
//             dangerouslySetInnerHTML={{
//               __html:
//                 msg.role === "assistant"
//                   ? renderMarkdown(msg.content)
//                   : msg.content
//             }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// createRoot(document.getElementById("root")).render(<Popup />);
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";
import { marked } from "marked";

/* ---------- markdown renderer ---------- */
function renderMarkdown(text) {
  if (!text) return "";
  return marked.parse(text);
}

function Popup() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [context, setContext] = useState(null);
  const [largeFont, setLargeFont] = useState(false);
  const [ignoreHighlight, setIgnoreHighlight] = useState(false);

  /* ---------- request page context from content script ---------- */
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      if (!tab?.id) return;

      chrome.tabs.sendMessage(tab.id, { type: "GET_CONTEXT" }, (ctx) => {
        setContext(ctx);
        setIgnoreHighlight(false);
      });
    });
  }, []);

  /* ---------- ask AI ---------- */
  async function askAI() {
    if (!question.trim()) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: question }
    ];

    setMessages(updatedMessages);
    setQuestion("");

    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        chatHistory: updatedMessages,
        highlightedText: ignoreHighlight
          ? null
          : context?.highlightedText,
        documentContext: context?.documentContext
      })
    });

    const data = await res.json();

    setMessages([
      ...updatedMessages,
      {
        role: "assistant",
        content: data.answer || "No answer returned."
      }
    ]);

    /* ---------- ignore highlight after first question ---------- */
    setIgnoreHighlight(true);
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">✨ Ask AI</div>

      {/* Question input */}
      <textarea
        placeholder="Ask a question about this page..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={askAI}>Ask AI</button>

      {/* Font size toggle */}
      <button
        className="font-toggle"
        onClick={() => setLargeFont(!largeFont)}
      >
        {largeFont ? "- font size" : "+ font size"}
      </button>

      {/* Highlight preview (shown once) */}
      {!ignoreHighlight && context?.highlightedText && (
        <div className="preview">
          {context.highlightedText.slice(0, 200)}
        </div>
      )}

      {/* Conversation */}
      <div className={`chat ${largeFont ? "large" : ""}`}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role}
            dangerouslySetInnerHTML={{
              __html:
                msg.role === "assistant"
                  ? renderMarkdown(msg.content)
                  : msg.content
            }}
          />
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<Popup />);
