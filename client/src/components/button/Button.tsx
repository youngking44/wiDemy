import React from "react";

interface ButtonProps {
  type: string;
  children: React.ReactNode;
}

const Button = ({ type, children }: ButtonProps) => {
  return (
    <button
      className={`px-10 py-3 rounded-full cursor-pointer uppercase text-white transition-all duration-300
        ${type === "secondary" ? "bg-secondary-400 hover:opacity-80" : ""} 
        ${type === "accent" ? "bg-accent-500 hover:opacity-80" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
