import React from "react";

export const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  icon = null,
  iconPosition = "right",
  ...props
}) => {
  const baseStyles =
    "flex justify-center items-center rounded-md focus:outline-none focus:ring focus:ring-[#634AFF] focus:ring-opacity-50 transition";
  const variantStyles = {
    primary:
      "bg-[#634AFF] text-white hover:opacity-90 disabled:bg-gray-400 disabled:text-gray-50",
  };
  const sizeStyles = {
    md: "px-6 py-2",
  };
  const disabledStyles =
    "disabled:cursor-not-allowed disabled:focus:ring-transparent disabled:focus:ring-opacity-0 disabled:hover:opacity-100";

  const buttonContent = (
    <>
      {icon && iconPosition === "left" && (
        <div
          className="h-5 w-5 mr-2"
          style={
            typeof icon === "string"
              ? { backgroundImage: `url(${icon})`, backgroundSize: "cover" }
              : {}
          }
        >
          {typeof icon !== "string" && icon}
        </div>
      )}
      {children}
      {icon && iconPosition === "right" && (
        <div
          className="h-5 w-5 ml-2"
          style={
            typeof icon === "string"
              ? { backgroundImage: `url(${icon})`, backgroundSize: "cover" }
              : {}
          }
        >
          {typeof icon !== "string" && icon}
        </div>
      )}
    </>
  );

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {buttonContent}
    </button>
  );
};
