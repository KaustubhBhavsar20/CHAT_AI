import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;

  console.log("API Key:", apiKey);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  async function generateAnswer() {
    if (!question.trim()) return; // Prevent empty submissions

    // Add the user's question to the chat history
    const newChatHistory = [
      ...chatHistory,
      { type: "user", text: question },
    ];
    setChatHistory(newChatHistory);

    // Clear the input and set "Loading..." for bot response
    setQuestion("");
    setChatHistory((prev) => [
      ...prev,
      { type: "bot", text: "Loading..." },
    ]);

    try {
      const response = await axios({
        url: apiKey, // Replace with your API endpoint
        method: "post",
        data: {
          contents: [
            {
              parts: [{ text: question }],
            },
          ],
        },
      });

      const botResponse =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];

      // Update the bot's response in the chat history
      setChatHistory((prev) => [
        ...prev.slice(0, -1), // Remove "Loading..." message
        { type: "bot", text: botResponse },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev.slice(0, -1),
        { type: "bot", text: "Error: Unable to generate a response." },
      ]);
    }
  }

  return (
    <div className="chat-container">
      <h1>CHAT AI - Always ready to Help!</h1>
      <div className="chat-box">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={question}
          rows="3"
          placeholder="Type your question here..."
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button onClick={generateAnswer}>Generate Answer</button>
      </div>
    </div>
  );
}

export default App;
