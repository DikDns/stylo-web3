import React from "react";
export const Label = ({ children, ...props }) => {
  return (
    <div className="text-gray-600 text-sm font-medium mb-2" {...props}>
      {children}
    </div>
  );
};
