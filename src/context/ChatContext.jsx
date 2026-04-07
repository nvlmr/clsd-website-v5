// src/context/ChatContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import data from "../data/chatBot.js";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: data.welcomeMessage,
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const setTyping = (typing) => {
    setIsTyping(typing);
  };

  const clearMessages = () => {
    setMessages([
      {
        text: data.welcomeMessage,
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  const value = {
    isOpen,
    setIsOpen,
    messages,
    setMessages,
    isTyping,
    setIsTyping,
    addMessage,
    setTyping,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};