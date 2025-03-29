import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { backend } from "declarations/backend";
import { Button } from "./button.jsx";
import aiStyloImg from "/ai-stylo.png";
import userImg from "/user.svg";
import sparklingIcon from "/sparkling-icon.svg";
import "/index.css";

const CLOTHING_DATA = [
  {
    id: 1,
    clothing_type: "T-Shirt",
    color: "Navy Blue",
    brand: "Nike",
    image_url: "https://example.com/images/nike_navy_tshirt.jpg",
    category: "upper",
  },
  {
    id: 2,
    clothing_type: "Jeans",
    color: "Dark Wash",
    brand: "Levi's",
    image_url: "https://example.com/images/levis_darkwash_jeans.jpg",
    category: "lower",
  },
  {
    id: 3,
    clothing_type: "Sneakers",
    color: "White",
    brand: "Adidas",
    image_url: "https://example.com/images/adidas_white_sneakers.jpg",
    category: "footwear",
  },
  {
    id: 4,
    clothing_type: "Blazer",
    color: "Black",
    brand: "Zara",
    image_url: "https://example.com/images/zara_black_blazer.jpg",
    category: "outerwear",
  },
  {
    id: 5,
    clothing_type: "Scarf",
    color: "Multicolor",
    brand: "Gucci",
    image_url: "https://example.com/images/gucci_multicolor_scarf.jpg",
    category: "accessories",
  },
];

const PROMPT_TEMPLATE = `You are a helpful and creative fashion advisor. Your goal is to recommend the best outfit from a given list of clothing items based on the user's stated situation or desired look.

Here is the list of clothing items available:
\`\`\`json
${JSON.stringify(CLOTHING_DATA)}
\`\`\`

The user's request is about:
\`\`\`
{{user_request}}
\`\`\`

Based on the user's request and the available clothing, recommend an outfit. Consider the occasion and suggest a cohesive look. Briefly explain your reasoning for the outfit choices.

Your output should ONLY be in JSON format like this, don't add other responses.

Example Output:
\`\`\`json
{
  "content": "For a party, I recommend pairing the Black Blazer with the Dark Wash Jeans for a stylish yet comfortable look. You can layer the Navy Blue T-Shirt underneath for a touch of casualness. Complete the outfit with the White Sneakers for a modern and fun vibe.",
  "clothing_ids": [4, 2, 1, 3]
}
\`\`\`
`;

const App = () => {
  const [chat, setChat] = useState([
    {
      role: { system: null },
      content:
        "Hi, I'm AI Stylo, your fashion advisor. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  const formatDate = (date) => {
    const h = "0" + date.getHours();
    const m = "0" + date.getMinutes();
    return `${h.slice(-2)}:${m.slice(-2)}`;
  };

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
        });
        return newChat;
      });
    } catch (e) {
      console.log(e);
      const eStr = String(e);
      const match = eStr.match(/(SysTransient|CanisterReject), \+"([^\"]+)/);
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
      content: "Composing the best personalized outfit for you...",
    };
    setChat((prevChat) => [...prevChat, userMessage, thinkingMessage]);
    setInputValue("");
    setIsLoading(true);

    const messageWithPrompt = {
      role: { user: null },
      content: PROMPT_TEMPLATE.replace("{{user_request}}", inputValue),
    };
    const messagesToSend = chat.slice(1).concat(messageWithPrompt);
    askAgent(messagesToSend);
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-lg">
        <div
          className="flex-1 overflow-y-auto rounded-t-lg bg-gray-100 p-4"
          ref={chatBoxRef}
        >
          {chat.map((message, index) => {
            const isUser = "user" in message.role;
            const img = isUser ? userImg : aiStyloImg;
            const name = isUser ? "User" : "Stylo AI";
            const text = message.content;

            return (
              <div
                key={index}
                className={`flex ${
                  isUser ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {!isUser && (
                  <div
                    className="mr-2 h-10 w-10 rounded-full"
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                )}
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isUser ? "bg-blue-500 text-white" : "bg-white shadow"
                  }`}
                >
                  <div
                    className={`mb-1 flex items-center justify-between text-sm ${
                      isUser ? "text-white" : "text-gray-500"
                    }`}
                  >
                    <div>{name}</div>
                    <div className="mx-2">{formatDate(new Date())}</div>
                  </div>
                  <div>{text}</div>
                </div>
                {isUser && (
                  <div
                    className="ml-2 h-10 w-10 rounded-full"
                    style={{
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
        <form
          className="flex rounded-b-lg border-t bg-white p-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="flex-1 rounded-l border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Create Your Own Favorite Outfit!"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <span>Send</span>
            <div
              className="h-5 w-5"
              style={{
                backgroundImage: `url(${sparklingIcon})`,
                backgroundSize: "cover",
              }}
            ></div>
          </Button>
        </form>
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
