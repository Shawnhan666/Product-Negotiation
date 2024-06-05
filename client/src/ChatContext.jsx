

import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [systemMessages, setSystemMessages] = useState([]);
  // 添加一个状态来维护消息的编号
  const [messageCounter, setMessageCounter] = useState(1); // 从1开始编号

  const appendSystemMessage = (message) => {
    // 为新的系统消息添加编号
    const taggedMessage = { ...message, number: messageCounter };

    
    setSystemMessages((currentMessages) => [...currentMessages, taggedMessage]);
    // 消息编号递增
    setMessageCounter(messageCounter + 1);
  };

  return (
    <ChatContext.Provider value={{ systemMessages, appendSystemMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
