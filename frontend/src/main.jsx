import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import autoAnimate from "https://cdn.jsdelivr.net/npm/@formkit/auto-animate";
import { backend } from "declarations/backend";
import { TopBar } from "./top-bar.jsx";
import { ChatMessage } from "./chat-message.jsx";
import { ChatInput } from "./chat-input.jsx";
import { ClothingGrid } from "./clothing-grid.jsx";
import aiStyloImg from "/ai-stylo.png";
import userImg from "/user.svg";
import "/index.css";

const CLOTHINGS_DATA_URL =
  "https://cdn.jsdelivr.net/gh/DikDns/stylo-assets@main/clothings.json";
const PROMPT_TEMPLATE_URL =
  "https://cdn.jsdelivr.net/gh/DikDns/stylo-assets@main/prompt-template.txt";

const scrollToBottom = (chatBoxRef) => {
  const scrollHeight = chatBoxRef.current.scrollHeight;
  chatBoxRef.current.scrollTo({
    top: scrollHeight,
    behavior: "smooth",
  });
};

const formatDate = (date) => {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();
  return `${h.slice(-2)}:${m.slice(-2)}`;
};

const App = () => {
  const [promptTemplate, setPromptTemplate] = useState("");
  const [clothings, setClothings] = useState([]);
  const [chat, setChat] = useState([
    {
      role: { system: null },
      content: "Hi, I'm Stylo, your fashion advisor. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);
  const chatRef = useRef(null);

  const askAgent = async (messages) => {
    try {
      const response = await backend.chat(messages);
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(response);
      } catch (parseError) {
        parsedResponse = { content: response };
      }
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop();
        newChat.push({
          role: { system: null },
          content: parsedResponse.content,
          clothing_ids: parsedResponse.clothing_ids,
        });
        return newChat;
      });
    } catch (e) {
      console.log(e);
      const eStr = String(e);
      const match = eStr.match(/(SysTransient|CanisterReject), +"([^"]+)/);
      if (match) {
        alert(match[2]);
      }
      setChat((prevChat) => {
        const newChat = [...prevChat];
        newChat.pop();
        return newChat;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: { user: null },
      content: inputValue,
    };
    const thinkingMessage = {
      role: { system: null },
      content: "",
    };
    setChat((prevChat) => [...prevChat, userMessage, thinkingMessage]);
    setInputValue("");
    setIsLoading(true);

    const messageWithPrompt = {
      role: { user: null },
      content: promptTemplate
        .replace("{{user_request}}", inputValue)
        .replace("{{clothing_data}}", JSON.stringify(clothings)),
    };
    const messagesToSend = chat.slice(1).concat(messageWithPrompt);
    askAgent(messagesToSend);
  };

  useEffect(() => {
    chatRef.current && autoAnimate(chatRef.current);
  }, [chatRef]);

  useEffect(() => {
    if (chatBoxRef.current) {
      const timeout = setTimeout(() => {
        scrollToBottom(chatBoxRef);
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [chat]);

  useEffect(() => {
    const fetchClothings = async () => {
      try {
        const response = await fetch(CLOTHINGS_DATA_URL);
        const data = await response.json();
        setClothings(data);
        console.log("Clothing data:", data);
      } catch (error) {
        console.error("Error fetching clothing data:", error);
      }
    };
    const fetchPromptTemplate = async () => {
      try {
        const response = await fetch(PROMPT_TEMPLATE_URL);
        const data = await response.text();
        setPromptTemplate(data);
      } catch (error) {
        console.error("Error fetching prompt template:", error);
      }
    };

    fetchPromptTemplate();
    fetchClothings();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div
        className="flex-1 overflow-y-auto p-8 md:p-16 pb-64"
        ref={chatBoxRef}
      >
        <div className="flex-1 rounded-t-lg p-4 pb-10 md:pb-40" ref={chatRef}>
          {chat.map((message, index) => {
            const isUser = "user" in message.role;
            const img = isUser ? userImg : aiStyloImg;
            const name = isUser ? "User" : "Stylo";
            const text = message.content;

            return (
              <ChatMessage
                key={index}
                isUser={isUser}
                name={name}
                text={text}
                img={img}
                timestamp={formatDate(new Date())}
                isLoading={isLoading}
                isLastMessage={index === chat.length - 1}
              >
                {!isUser && message.clothing_ids && (
                  <ClothingGrid
                    clothingIds={message.clothing_ids}
                    clothings={clothings}
                  />
                )}
              </ChatMessage>
            );
          })}
        </div>
        <div className="absolute left-0 right-0 bottom-0 top-[calc(100%-12rem)] bg-white" />
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
