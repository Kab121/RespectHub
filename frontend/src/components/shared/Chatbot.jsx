import React, { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useAuth } from "../../utils/AuthContext.jsx";
import { chatbotAPI } from "../../services/api.js";

export default function Chatbot() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: `Hi ${user?.fullName || user?.name || "there"} 👋 I’m your RespectHub AI assistant. Ask me about points, badges, rank, leaderboard, submissions, or approval.`,
    },
  ]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const userContext = {
        id: user?.id,
        fullName: user?.fullName || user?.name,
        role: user?.role,
      };

      const response = await chatbotAPI.ask({
        message: input,
        userContext,
      });

      const botMessage = {
        sender: "bot",
        text: response.data.reply || "I could not generate a response.",
      };

      setMessages((prev) => [...prev, botMessage]);
      setInput("");
    } catch (err) {
      const errorMessage = {
        sender: "bot",
        text: "Sorry, I could not connect to the AI service right now.",
      };

      setMessages((prev) => [...prev, errorMessage]);
      console.error("Chatbot request failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button className="chatbot-fab" onClick={() => setIsOpen(true)} type="button">
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <Bot size={20} />
              <span>RespectHub AI</span>
            </div>

            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message ${msg.sender === "user" ? "user" : "bot"}`}
              >
                <div className="chatbot-message-icon">
                  {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="chatbot-message-text">{msg.text}</div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-message bot">
                <div className="chatbot-message-icon">
                  <Bot size={16} />
                </div>
                <div className="chatbot-message-text">Thinking...</div>
              </div>
            )}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
            />
            <button onClick={handleSend} type="button" disabled={loading}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}