import React from "react";
import { motion } from "framer-motion";

const BottomNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "add", icon: "➕", label: "Add" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2"
    >
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <motion.span
              className="text-xl mb-1"
              animate={activeTab === tab.id ? { scale: 1.1 } : { scale: 1 }}
            >
              {tab.icon}
            </motion.span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNavigation;
