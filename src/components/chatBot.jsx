// C:\Users\neall\Pending Task\GitHub\clsd-website-v5\src\components\chatBot.jsx

import React, { useState, useEffect, useRef } from 'react';
import logo from "../assets/logo/LSD.png";
import { MessageCircle, X, Send } from 'lucide-react';
import data from "../data/chatBot.js";

// ─── Simple Markdown Renderer ────────────────────────────────────────────────
const MarkdownText = ({ text }) => {
  const lines = text.split('\n');

  const parseInline = (str) => {
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
    let last = 0;
    let match;
    while ((match = regex.exec(str)) !== null) {
      if (match.index > last) parts.push(str.slice(last, match.index));
      if (match[2]) parts.push(<strong key={match.index}>{match[2]}</strong>);
      else if (match[3]) parts.push(<em key={match.index}>{match[3]}</em>);
      last = match.index + match[0].length;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts.length ? parts : str;
  };

  return (
    <div className="text-sm leading-relaxed space-y-1 break-words">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;

        if (/^[•\-\*]\s/.test(line.trim())) {
          return (
            <div key={i} className="flex items-start space-x-2 pl-1">
              <span className="mt-1 text-blue-400 flex-shrink-0">•</span>
              <span className="break-words flex-1">{parseInline(line.replace(/^[•\-\*]\s/, '').trim())}</span>
            </div>
          );
        }

        const numMatch = line.trim().match(/^(\d+)\.\s(.+)/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start space-x-2 pl-1">
              <span className="mt-0 text-blue-500 font-semibold flex-shrink-0 min-w-[16px]">
                {numMatch[1]}.
              </span>
              <span className="break-words flex-1">{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        return <p key={i} className="break-words">{parseInline(line)}</p>;
      })}
    </div>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: data.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  const generateResponse = (message) => {
    const m = message.toLowerCase();

    // Check for greetings
    if (m.match(/^(hello|hi|hey|greetings|good morning|good afternoon|good evening)/)) {
      return data.responses.greetings;
    }

    // Check for thank you messages
    if (m.match(/^(thank|thanks|appreciate)/)) {
      return data.responses.thankYou;
    }

    // Check for about CLSD
    if (m.match(/^(about|what is|tell me about|clsd|center)/) && 
        (m.includes('clsd') || m.includes('center') || m.includes('about'))) {
      return data.responses.about;
    }

    // Check for research
    if (m.match(/research|initiative|study|investigation/)) {
      return data.responses.research;
    }

    // Check for projects
    if (m.match(/project|current|ongoing|initiative/)) {
      return data.responses.projects;
    }

    // Check for contact
    if (m.match(/contact|email|phone|address|reach|call|mail/)) {
      return data.responses.contact;
    }

    // Check for team
    if (m.match(/team|staff|researcher|scientist|expert|personnel/)) {
      return data.responses.team;
    }

    // Check for water quality
    if (m.match(/water quality|monitoring|parameters|turbidity|ph|oxygen|nutrient/)) {
      return data.responses.waterQuality;
    }

    // Check for algal bloom
    if (m.match(/algal bloom|algae|cyanobacteria|eutrophication/)) {
      return data.responses.algalBloom;
    }

    // Check for publications
    if (m.match(/publication|paper|report|article|journal|research paper/)) {
      return data.responses.publications;
    }

    // Check for events
    if (m.match(/event|workshop|seminar|conference|webinar|training/)) {
      return data.responses.events;
    }

    // Check for volunteer
    if (m.match(/volunteer|join|participate|involve|help/)) {
      return data.responses.volunteer;
    }

    // Check for donation
    if (m.match(/donate|support|contribute|fund|sponsor/)) {
      return data.responses.donate;
    }

    // Check for FAQ
    if (m.match(/faq|question|common|frequently/)) {
      return data.responses.faq;
    }

    // Default response
    return data.responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = { text: inputMessage, isUser: true, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateResponse(currentMessage);
      setMessages((prev) => [
        ...prev,
        { text: botResponse, isUser: false, timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {isOpen && (
        <div
          ref={chatContainerRef}
          className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[420px] md:w-[480px] h-[620px] transition-all duration-300"
        >
          <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 py-4 flex justify-between items-center relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-black/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

              <div className="flex items-center space-x-3 relative z-10">
                <div className="relative">
                  <img
                    src={logo}
                    alt="CLSD Logo"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30 shadow-lg"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg tracking-tight">CLSD Assistant</h3>
                </div>
              </div>

              <div className="flex items-center space-x-1 relative z-10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 transition-all duration-200 p-2 rounded-lg backdrop-blur-sm"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 via-gray-50 to-white">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200 ${
                      message.isUser
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <img src={logo} alt="CLSD" className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-xs font-semibold text-blue-600">CLSD Assistant</span>
                      </div>
                    )}
                    {message.isUser ? (
                      <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
                    ) : (
                      <MarkdownText text={message.text} />
                    )}
                    <span
                      className={`text-xs mt-2 block ${
                        message.isUser ? 'text-blue-100' : 'text-gray-400'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start mb-4 animate-fadeIn">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex items-center space-x-2">
                      <img src={logo} alt="CLSD" className="w-5 h-5 rounded-full object-cover" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed Alignment */}
            <div className="border-t border-gray-200 bg-white px-4 py-4 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <textarea
                    ref={(el) => {
                      inputRef.current = el;
                      textareaRef.current = el;
                    }}
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={data.inputPlaceholder}
                    className="w-full resize-none border-2 border-gray-200 rounded-xl px-4 py-[10px] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-400 overflow-y-auto block"
                    style={{ 
                      maxHeight: '120px', 
                      minHeight: '44px',
                      lineHeight: '20px' 
                    }}
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl w-[44px] h-[44px] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex-shrink-0 flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>  
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Open chat"
        >
          <div className="relative">
            <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2">
              <div className="relative">
                <MessageCircle className="w-6 h-6" />
                {messages.length > 1 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </div>
            </div>
          </div>
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-4px); }
        }
        .animate-bounce { animation: bounce 0.5s infinite; }

        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        
        textarea {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E0 #EDF2F7;
        }
        textarea::-webkit-scrollbar {
          width: 6px;
        }
        textarea::-webkit-scrollbar-track {
          background: #EDF2F7;
          border-radius: 10px;
        }
        textarea::-webkit-scrollbar-thumb {
          background: #CBD5E0;
          border-radius: 10px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: #A0AEC0;
        }
        
        /* Fix text wrapping for all messages */
        .break-words {
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </>
  );
};

export default ChatBot; 