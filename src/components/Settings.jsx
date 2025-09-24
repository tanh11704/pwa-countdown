import React from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import { saveEventsToDB } from "../utils/db";

const Settings = ({ theme, onThemeChange, events, setEvents }) => {
  const clearAllData = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all events? This action cannot be undone."
      )
    ) {
      await saveEventsToDB([]);
      setEvents([]);
    }
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: "☀️" },
    { value: "dark", label: "Dark", icon: "🌙" },
    { value: "system", label: "System", icon: "💻" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Theme
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onThemeChange(option.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                theme === option.value
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {option.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {events.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Events
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {
                events.filter((event) => new Date(event.date) > new Date())
                  .length
              }
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Upcoming Events
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Data Management
        </h3>
        <Button variant="danger" onClick={clearAllData} className="w-full">
          Clear All Events
        </Button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          This will permanently delete all your events
        </p>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Notifications
        </h3>
        <button
          onClick={async () => {
            if (Notification.permission !== "granted") {
              const p = await Notification.requestPermission();
              if (p !== "granted") return;
            }
            const reg = await navigator.serviceWorker?.ready;
            await reg?.showNotification?.("Test notification", {
              body: "It works!",
            });
          }}
          className="w-full px-4 py-3 rounded-xl border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          Send Test Notification
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Nếu không thấy thông báo, kiểm tra quyền/HTTPS/PWA đã cài.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
          About
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          PWA Countdown Timer v1.0
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Built with React, Tailwind CSS, and Framer Motion
        </p>
      </div>
    </motion.div>
  );
};

export default Settings;
