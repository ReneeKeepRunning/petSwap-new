import React from 'react';
import { useFlash } from '../contexts/FlashContext';
import './FlashMessage.css';

const FlashMessage = () => {
  const { messages, removeMessage } = useFlash();

  if (messages.length === 0) return null;

  return (
    <div className="flash-messages-container">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`alert alert-${msg.type} alert-dismissible fade show`}
          role="alert"
        >
          {msg.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => removeMessage(msg.id)}
            aria-label="Close"
          ></button>
        </div>
      ))}
    </div>
  );
};

export default FlashMessage;
