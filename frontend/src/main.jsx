import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { backend } from 'declarations/backend';
import { Button } from './button.jsx';
import aiStyloImg from '/ai-stylo.png';
import userImg from '/user.svg';
import sparklingIcon from '/sparkling-icon.svg';
import '/index.css';
import { ImageCard } from './image-card.jsx';

const CLOTHING_DATA = [
    {
        id: 1,
        clothing_type: 'T-Shirt',
        color: 'Navy Blue',
        brand: 'Nike',
        image_url: 'https://example.com/images/nike_navy_tshirt.jpg',
        category: 'upper'
    },
    {
        id: 2,
        clothing_type: 'Jeans',
        color: 'Dark Wash',
        brand: "Levi's",
        image_url: 'https://example.com/images/levis_darkwash_jeans.jpg',
        category: 'lower'
    },
    {
        id: 3,
        clothing_type: 'Sneakers',
        color: 'White',
        brand: 'Adidas',
        image_url: 'https://example.com/images/adidas_white_sneakers.jpg',
        category: 'footwear'
    },
    {
        id: 4,
        clothing_type: 'Blazer',
        color: 'Black',
        brand: 'Zara',
        image_url: 'https://example.com/images/zara_black_blazer.jpg',
        category: 'outerwear'
    },
    {
        id: 5,
        clothing_type: 'Scarf',
        color: 'Multicolor',
        brand: 'Gucci',
        image_url: 'https://example.com/images/gucci_multicolor_scarf.jpg',
        category: 'accessories'
    }
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
            content: "Hi, I'm AI Stylo, your fashion advisor. How can I help you today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBoxRef = useRef(null);

    const formatDate = (date) => {
        const h = '0' + date.getHours();
        const m = '0' + date.getMinutes();
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
                    clothing_ids: parsedResponse.clothing_ids
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
            content: inputValue
        };
        const thinkingMessage = {
            role: { system: null },
            content: 'Composing the best personalized outfit for you...'
        };
        setChat((prevChat) => [...prevChat, userMessage, thinkingMessage]);
        setInputValue('');
        setIsLoading(true);

        const messageWithPrompt = {
            role: { user: null },
            content: PROMPT_TEMPLATE.replace('{{user_request}}', inputValue)
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
    <div className="h-screen flex flex-col">
        {/* Top Bar */}
        <div className="w-full bg-white px-6 py-4 flex justify-between items-center">
            {/* Bagian Kiri - Logo Stylo */}
            <div className="text-xl font-bold text-gray-900">Stylo</div>

            {/* Bagian Tengah - Menu */}
            <div className="flex space-x-8 text-gray-700 font-medium">
                <a href="#" className="hover:text-[#634AFF]">Home</a>
                <a href="#" className="hover:text-[#634AFF]">AI Customize</a>
                <a href="#" className="hover:text-[#634AFF]">DAO.OTD</a>
            </div>

            {/* Bagian Kanan - Profile Icon */}
           <div
                className="h-10 w-10 rounded-full"
                style={{
                    backgroundImage: `url(${userImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                ></div>

        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-8 md:p-16 pb-64" ref={chatBoxRef}>
            <div className="flex-1 rounded-t-lg p-4 pb-6 md:pb-12">
                {chat.map((message, index) => {
                    const isUser = 'user' in message.role;
                    const img = isUser ? userImg : aiStyloImg;
                    const name = isUser ? 'User' : 'Stylo AI';
                    const text = message.content;

                    return (
                        <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} w-full mb-2`}>
                            {/* Avatar AI (Kiri) */}
                            {!isUser && (
                                <div
                                    className="mr-2 h-10 w-10 rounded-full"
                                    style={{
                                        backgroundImage: `url(${img})`,
                                        backgroundSize: 'cover'
                                    }}
                                ></div>
                            )}

                            {/* Wrapper utama untuk teks dan gambar */}
                            <div className="max-w-[70%] p-3">
                                {/* Bagian Teks AI/User */}
                                {!isUser ? (
                                    <div className="bg-white shadow rounded-lg p-3 text-gray-700">
                                        <div className="mb-1 flex items-center justify-between text-sm text-gray-500">
                                            <div>{name}</div>
                                            <div className="mx-2">{formatDate(new Date())}</div>
                                        </div>
                                        <div>{text}</div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-500 text-white rounded-lg p-3">
                                        <div className="mb-1 flex items-center justify-between text-sm text-white">
                                            <div>{name}</div>
                                            <div className="mx-2">{formatDate(new Date())}</div>
                                        </div>
                                        <div>{text}</div>
                                    </div>
                                )}

                                {/* Spacer antara teks dan gambar */}
                                {message.clothing_ids && <div className="mt-4"></div>}

                                {/* Bagian Gambar AI */}
                                {!isUser && message.clothing_ids && (
                                    <div className="grid grid-cols-1 gap-4 w-full">
                                        {message.clothing_ids.map((id) => {
                                            const clothing = CLOTHING_DATA.find((item) => item.id === id);
                                            return (
                                                <div key={clothing.id} className="bg-white shadow rounded-lg p-3">
                                                    <ImageCard
                                                        imageUrl={clothing.image_url}
                                                        className="aspect-square"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Avatar User (Kanan) */}
                            {isUser && (
                                <div
                                    className="ml-2 h-10 w-10 rounded-full"
                                    style={{
                                        backgroundImage: `url(${img})`,
                                        backgroundSize: 'cover'
                                    }}
                                ></div>
                            )}
                        </div>
                    );
                })}
            </div>
<div className="absolute left-0 right-0 bottom-0 top-[calc(100%-12rem)] bg-white"></div>
            {/* Form Input */}
            <form
    className="absolute right-0 left-0 mx-4 my-4 p-6 md:p-8 bottom-0 rounded-lg border border-gray-300 bg-gray-100 shadow-lg"
    onSubmit={handleSubmit}
>
    {/* Row 1: Input */}
    <div className="w-full">
        <textarea
            type="text"
            className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none"
            placeholder="Create Your Own Favorite Outfit!"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
        />
    </div>

    {/* Spacer antara row 1 & row 2 */}
    <div className="mt-6"></div>

    {/* Row 2: LLM 2.0 Label + Buttons */}
    <div className="w-full flex justify-between items-center">
        {/* LLM 2.0 Label */}
        <div className="px-3 py-1 bg-gray-300 text-gray-500 rounded-full text-sm font-medium">
            LLM 2.0
        </div>

        {/* Button Group */}
        <div className="flex space-x-4">
            {/* Outline Button: Vote to DAO */}
            <button
                type="button"
                className="px-6 py-2 border-2 border-[#634AFF] text-[#634AFF] rounded-lg shadow-md font-medium hover:bg-[#634AFF] hover:text-white transition"
            >
                Vote to DAO
            </button>

            {/* Submit Button: Generate */}
            <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#634AFF] text-white rounded-lg shadow-md flex items-center"
            >
                <span>Generate</span>
                <div
                    className="h-5 w-5 ml-2"
                    style={{
                        backgroundImage: `url(${sparklingIcon})`,
                        backgroundSize: "cover",
                    }}
                ></div>
            </button>
        </div>
    </div>
</form>

        </div>
    </div>
);

};

export default App;

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);