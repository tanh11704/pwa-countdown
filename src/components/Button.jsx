import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}) => {
  const baseClasses =
    "px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white shadow-lg shadow-blue-500/20",
    secondary:
      "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20",
    danger:
      "bg-gradient-to-r from-red-500 to-red-400 hover:from-red-600 hover:to-red-500 text-white shadow-lg shadow-red-500/20",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;
