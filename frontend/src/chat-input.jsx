import React from "react";
import sparklingIcon from "/sparkling-icon.svg";
import { Button } from "./button";

export const ChatInput = ({
  inputValue,
  setInputValue,
  isLoading,
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    onSubmit(e);
  };

  return (
    <form
      className="absolute right-0 left-0 mx-4 md:mx-8 my-4 p-6 md:p-8 bottom-0 rounded-lg border border-gray-300 bg-gray-100 shadow-lg"
      onSubmit={handleSubmit}
    >
      {/* Input Field */}
      <div className="w-full">
        <textarea
          className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none min-h-16"
          placeholder="Create Your Own Favorite Outfit!"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
      </div>

      {/* Model Info and Buttons */}
      <div className="w-full mt-4 flex flex-col justify-start items-start sm:flex-row sm:justify-between sm:items-center gap-y-2">
        {/* Model Label */}
        <span className="px-3 py-1 bg-gray-300 text-gray-500 rounded-full text-sm font-medium">
          Llama3.1:8B
        </span>

        {/* Button Group */}
        <div className="flex space-x-4 w-full sm:w-fit">
          {/* Vote to DAO Button */}
          <Button disabled type="button" className="basis-1/2">
            Vote to DAO
          </Button>

          {/* Generate Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="basis-1/2"
            icon={sparklingIcon}
          >
            Generate
          </Button>
        </div>
      </div>
    </form>
  );
};
