// // ChatContext.jsx
// import React, { createContext, useContext, useState } from 'react';

// const ChatContext = createContext();

// export const useChat = () => useContext(ChatContext);

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);

//   const appendMessage = (message) => {
//     console.log("Before updating messages: ", messages);
//     setMessages(currentMessages => {
//       const updatedMessages = [...currentMessages, message];
//       console.log("After updating messages: ", updatedMessages);
//       return updatedMessages;
//     });
//     };

//   return (
//     <ChatContext.Provider value={{ messages, appendMessage }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };



// ChatContext.jsx

// ChatContext.jsx
import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [systemMessages, setSystemMessages] = useState([]);

  const appendSystemMessage = (message) => {
    setSystemMessages((currentMessages) => [...currentMessages, message]);
  };

  return (
    <ChatContext.Provider value={{ systemMessages, appendSystemMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

