import React from "react";
export const Card = ({ children, ...props }) => {
  return (
    <div
      className="w-full h-full bg-gray-100/80 shadow rounded-3xl p-4"
      {...props}
    >
      {children}
    </div>
  );
};
