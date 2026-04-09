// src/components/chatBot.jsx

import React, { useState, useEffect, useRef } from 'react';
import logo from "../assets/logo/LSD.png";
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import data from "../data/chatBot.js";
import { useChat } from '../context/ChatContext.jsx';

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
  const { isOpen, setIsOpen, messages, setMessages, isTyping, setIsTyping } = useChat();
  
  const [inputMessage, setInputMessage] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
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
      setHasUnreadMessages(false);
      setLastMessageCount(messages.length);
      setShowSuggestions(true);
    }
  }, [isOpen, messages.length]);

  // Track new messages when chat is closed
  useEffect(() => {
    if (!isOpen && messages.length > lastMessageCount) {
      setHasUnreadMessages(true);
    }
  }, [messages.length, lastMessageCount, isOpen]);

  const handleClickOutside = (event) => {
    if (isOpen && chatContainerRef.current && !chatContainerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  // Auto-resize textarea when content exceeds 3 lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const lineHeight = parseInt(window.getComputedStyle(textareaRef.current).lineHeight);
      const maxHeight = lineHeight * 3;
      const scrollHeight = textareaRef.current.scrollHeight;
      
      if (scrollHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`;
        textareaRef.current.style.overflowY = 'auto';
      } else {
        textareaRef.current.style.height = `${scrollHeight}px`;
        textareaRef.current.style.overflowY = 'hidden';
      }
    }
  }, [inputMessage]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputMessage(value);
    setShowSuggestions(false);
  };

  const generateResponse = (message) => {
    const m = message.toLowerCase().trim();
    
    // Check for specific keywords
    if (m.match(/^(hello|hi|hey|greetings|good morning|good afternoon|good evening)/)) {
      return data.responses.greetings;
    }
    if (m.match(/^(thank|thanks|appreciate)/)) {
      return data.responses.thankYou;
    }
    if (m.match(/about|what is clsd|what does clsd do|mission|vision/)) {
      return data.responses.about;
    }
    if (m.match(/research|initiative|study|studies|rd|r&d/)) {
      return data.responses.research;
    }
    if (m.match(/project|current|ongoing|program/)) {
      return data.responses.projects;
    }
    if (m.match(/contact|email|phone|address|location|reach|call/)) {
      return data.responses.contact;
    }
    if (m.match(/team|staff|researcher|who works|personnel/)) {
      return data.responses.team;
    }
    if (m.match(/water quality|quality|parameters|monitoring/)) {
      return data.responses.waterQuality;
    }
    if (m.match(/algal bloom|algae|bloom|cyanobacteria|harmful algae/)) {
      return data.responses.algalBloom;
    }
    if (m.match(/lab|laboratory|facilities|equipment|instrument/)) {
      return data.responses.laboratories;
    }
    if (m.match(/service|offer|provide|testing|analysis/)) {
      return data.responses.services;
    }
    if (m.match(/publication|paper|report|article|journal|output/)) {
      return data.responses.publications;
    }
    if (m.match(/event|workshop|training|seminar|webinar|program/)) {
      return data.responses.events;
    }
    if (m.match(/volunteer|intern|join|participate|get involved/)) {
      return data.responses.volunteer;
    }
    if (m.match(/partner|collaboration|collaborate|institution|stakeholder/)) {
      return data.responses.partner;
    }
    if (m.match(/faq|question|common question|frequently asked/)) {
      return data.responses.faq;
    }
    if (m.match(/equipment|device|machine|tool|apparatus/)) {
      return data.responses.equipment;
    }
    if (m.match(/aquaculture|fish farming|fisheries/)) {
      return data.responses.aquaculture;
    }
    if (m.match(/food innovation|product development|fisheries product/)) {
      return data.responses.foodInnovation;
    }
    
    return data.responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage = { text: inputMessage, isUser: true, timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setShowSuggestions(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    setIsTyping(true);

    // Simulate typing delay for natural feel
    setTimeout(() => {
      const response = generateResponse(currentMessage);
      setMessages((prev) => [
        ...prev,
        { text: response, isUser: false, timestamp: new Date() },
      ]);
      setIsTyping(false);
    }, 500 + Math.random() * 500);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    setShowSuggestions(false);
    // Auto-send after a short delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const clearChat = () => {
    setMessages([
      {
        text: data.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  // Responsive sizing - 500px height and 350px width on mobile
  const chatHeight = 'h-[550px] sm:h-[600px]';
  const chatWidth = 'w-[320px] sm:w-[420px] md:w-[480px]';

  return (
    <>
      {isOpen && (
        <div 
          ref={chatContainerRef} 
          className={`fixed bottom-6 right-6 z-50 ${chatWidth} ${chatHeight} transition-all duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
            {/* Header Area */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-5 py-4 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img src={logo} alt="CLSD Logo" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white"></div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">CLSD Assistant</h3>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <Bot className="w-3 h-3" />
                    <span>Knowledge Base</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={clearChat}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all text-xs"
                  title="Clear Chat"
                >
                  Clear
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-2">Welcome to CLSD Assistant!</h3>
                  <p className="text-gray-500 text-sm max-w-[80%]">
                    Ask me anything about lake dynamics, water quality, algal blooms, or CLSD research projects.
                  </p>
                </div>
              )}
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}>
                    {!message.isUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <img src={logo} alt="CLSD" className="w-5 h-5 rounded-full" />
                        <span className="text-xs font-bold text-blue-600">CLSD Assistant</span>
                      </div>
                    )}
                    {message.isUser ? (
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm break-words flex-1">{message.text}</p>
                      </div>
                    ) : (
                      <MarkdownText text={message.text} />
                    )}
                    <span className={`text-[10px] mt-1 block ${message.isUser ? 'text-blue-100' : 'text-gray-400'}`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <img src={logo} alt="CLSD" className="w-5 h-5 rounded-full" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Quick Suggestions */}
              {showSuggestions && messages.length === 1 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Quick questions you can ask:</p>
                  <div className="flex flex-wrap gap-2">
                    {data.quickSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white flex-shrink-0">
              <div className="flex gap-2 items-center"> 
                <div className="flex-1 relative">
                  <textarea
                    ref={(el) => {
                      inputRef.current = el;
                      textareaRef.current = el;
                    }}
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder={data.inputPlaceholder}
                    className="w-full resize-none border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                    rows={1}
                    style={{ 
                      minHeight: '44px',
                      maxHeight: '84px',
                      overflowY: 'auto',
                      display: 'block'
                    }}
                  />
                </div>
                <button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isTyping}
                  className={`p-2.5 rounded-xl transition-all flex-shrink-0 ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 group z-50"
        >
          <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          <span className={`absolute -top-0.5 right-1 w-3 h-3 rounded-full ring-2 ring-white transition-colors duration-300 ${
            hasUnreadMessages ? 'bg-red-500' : 'bg-green-400'
          }`}></span>
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-8px);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s ease-in-out infinite;
        }
        
        .break-words {
          word-wrap: break-word;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        
        /* Custom scrollbar for messages */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        /* Textarea scrollbar */
        textarea::-webkit-scrollbar {
          width: 4px;
        }
        
        textarea::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        textarea::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
      `}} />
    </>
  );
};

export default ChatBot;