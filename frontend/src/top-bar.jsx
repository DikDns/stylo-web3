import React from "react";
import userImg from "/user.svg";
export const TopBar = () => {
  return (
    <div className="w-full bg-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-xl font-bold text-gray-900">Stylo</div>

      {/* Navigation Menu */}
      <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
        <a href="#" className="hover:text-[#634AFF]">
          Home
        </a>
        <a href="#" className="hover:text-[#634AFF]">
          AI Customize
        </a>
        <a href="#" className="hover:text-[#634AFF]">
          DAO.OTD
        </a>
      </div>

      {/* Profile Icon */}
      <div
        className="h-10 w-10 rounded-full"
        style={{
          backgroundImage: `url(${userImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
