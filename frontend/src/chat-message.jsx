import React from "react";

export const ChatMessage = ({
  isUser,
  name,
  text,
  img,
  timestamp,
  isLoading,
  isLastMessage,
  children,
}) => {
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} w-full mb-2`}
    >
      {/* Avatar (Left for AI, Right for User) */}
      {!isUser && (
        <div
          className="mr-2 h-10 w-10 rounded-full"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
          }}
        />
      )}

      {/* Message Content */}
      <div className="max-w-[70%] p-3">
        {/* Text Message */}
        <div
          className={`${
            isUser ? "bg-[#634AFF] text-white" : "bg-white shadow text-gray-700"
          } rounded-lg p-3`}
        >
          <div
            className={`mb-1 flex items-center justify-between text-sm ${
              isUser ? "text-white" : "text-gray-500"
            }`}
          >
            <div>{name}</div>
            <div className="mx-2">{timestamp}</div>
          </div>
          <div
            className={`${
              isLoading && isLastMessage ? "animate-pulse flex" : ""
            }`}
          >
            <span>{text}</span>
            {isLoading && isLastMessage && (
              <div className="flex items-center py-2 ml-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s] mx-1" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>
        </div>

        {/* Additional Content (e.g., Image Grid) */}
        {children}
      </div>

      {/* Avatar (Right for User) */}
      {isUser && (
        <div
          className="ml-2 h-10 w-10 rounded-full"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
          }}
        />
      )}
    </div>
  );
};
