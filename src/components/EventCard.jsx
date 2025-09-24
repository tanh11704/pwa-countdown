import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useEffect } from "react";
import { formatCountdown } from "../utils/helper";
import { CATEGORIES } from "../constants/constans";

const EventCard = ({ event, onEdit, onDelete, onClick }) => {
  const [countdown, setCountdown] = useState(formatCountdown(event.date));
  const category =
    CATEGORIES.find((cat) => cat.id === event.category) ||
    CATEGORIES[CATEGORIES.length - 1];

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(event.date));
    }, 1000);

    return () => clearInterval(interval);
  }, [event]);

  const getCountdownText = () => {
    if (countdown.isExpired) return "Event has passed!";

    if (countdown.days > 0) {
      return `${countdown.days}d ${countdown.hours}h`;
    } else if (countdown.hours > 0) {
      return `${countdown.hours}h ${countdown.minutes}m`;
    } else if (countdown.minutes > 0) {
      return `${countdown.minutes}m ${countdown.seconds}s`;
    } else {
      return `${countdown.seconds}s`;
    }
  };

  const isUrgent =
    countdown.days === 0 &&
    countdown.hours === 0 &&
    countdown.minutes < 60 &&
    !countdown.isExpired;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300"
      onClick={() => onClick(event)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl" style={{ color: category.color }}>
            {category.icon}
          </span>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-50">
              {event.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(event.id);
            }}
            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="text-center">
        <motion.div
          animate={isUrgent ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1, repeat: isUrgent ? Infinity : 0 }}
          className={`text-2xl font-bold ${
            countdown.isExpired
              ? "text-gray-500"
              : isUrgent
              ? "text-red-500"
              : "text-green-500 dark:text-green-400"
          }`}
        >
          {getCountdownText()}
        </motion.div>

        {event.notifications && !countdown.isExpired && (
          <div className="flex justify-center mt-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              🔔 Notifications On
            </span>
          </div>
        )}
      </div>

      {event.notes && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {event.notes}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default EventCard;
