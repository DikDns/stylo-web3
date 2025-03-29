import React from "react";
export const Button = ({ children, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-64 h-full bg-[#634AFF] gap-x-2 px-4 py-2 text-white rounded-2xl flex justify-center items-center"
      {...props}
    >
      {children}
    </button>
  );
};
