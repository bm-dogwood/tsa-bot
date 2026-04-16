"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, MessageCircle, Minimize2 } from "lucide-react";

const botResponses = {
  default:
    "I'm the TSA Screening Assistant. I can help you understand how our AI-powered screening system works. Try asking about wait times, safety, or how the system operates!",
  work: "Our AI-powered screening analyzes X-ray and CT scan images in milliseconds. It flags potential threats and provides recommendations to officers, who always make the final decision.",
  wait: "Automated analysis reduces screening time from 45+ seconds to under 10 seconds per passenger, reducing wait times by up to 70%.",
  safety:
    "The system achieves 99.7% threat detection accuracy and operates 24/7. All decisions are reviewed by trained officers.",
  privacy:
    "All data is encrypted in transit and at rest. No personal data is stored beyond the screening session.",
  integration:
    "Our platform integrates seamlessly with existing TSA hardware including X-ray and CT systems.",
};

const findResponse = (input) => {
  const text = input.toLowerCase();
  if (text.includes("wait") || text.includes("time")) return botResponses.wait;
  if (text.includes("safe") || text.includes("threat"))
    return botResponses.safety;
  if (text.includes("privacy") || text.includes("data"))
    return botResponses.privacy;
  if (text.includes("integrat") || text.includes("hardware"))
    return botResponses.integration;
  if (text.includes("work") || text.includes("how")) return botResponses.work;
  return botResponses.default;
};

const quickQuestions = [
  "How does automated screening work?",
  "How does this reduce wait times?",
  "How is safety ensured?",
];

const BotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: "assistant",
      content:
        "Hello! I'm the TSA Screening Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const message = text || input;
    if (!message.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: message },
    ]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800));

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: findResponse(message),
      },
    ]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500 text-black shadow-xl hover:bg-yellow-400"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-yellow-500 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-5 w-5 text-black" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-black">
                    TSA Screening Assistant
                  </div>
                  <div className="flex items-center gap-1 text-xs text-black/70">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    Online
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="rounded-md p-1 hover:bg-white/20"
                >
                  <Minimize2 className="h-4 w-4 text-black" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-md p-1 hover:bg-white/20"
                >
                  <X className="h-4 w-4 text-black" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                          msg.role === "user"
                            ? "bg-yellow-500 text-black rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="rounded-xl bg-gray-100 px-4 py-2 text-sm text-gray-500">
                        Typing…
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length < 3 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(q)}
                        className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-gray-200 p-3">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Ask a question..."
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isTyping}
                      className="flex h-10 w-10 items-center justify-center rounded-md bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BotAssistant;
