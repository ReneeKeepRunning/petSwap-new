import React, { createContext, useState, useContext, useCallback } from 'react';

const FlashContext = createContext();

export const useFlash = () => {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider');
  }
  return context;
};

export const FlashProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const removeMessage = useCallback((id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const addMessage = useCallback((message, type = 'info') => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeMessage(id);
    }, 5000);
  }, [removeMessage]);

  const success = useCallback((message) => addMessage(message, 'success'), [addMessage]);
  const error = useCallback((message) => addMessage(message, 'error'), [addMessage]);
  const info = useCallback((message) => addMessage(message, 'info'), [addMessage]);
  const warning = useCallback((message) => addMessage(message, 'warning'), [addMessage]);

  const value = {
    messages,
    addMessage,
    removeMessage,
    success,
    error,
    info,
    warning,
  };

  return <FlashContext.Provider value={value}>{children}</FlashContext.Provider>;
};
