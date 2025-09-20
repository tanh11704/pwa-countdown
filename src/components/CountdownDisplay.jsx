import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { formatCountdown } from "../utils/helper";
import { useEffect } from "react";

const CountdownDisplay = ({ targetDate }) => {
  const [countdown, setCountdown] = useState(formatCountdown(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (countdown.isExpired) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <div className="text-4xl mb-2">🎉</div>
        <div className="text-xl font-bold">Event Completed!</div>
      </motion.div>
    );
  }

  const timeUnits = [
    { label: "Days", value: countdown.days },
    { label: "Hours", value: countdown.hours },
    { label: "Minutes", value: countdown.minutes },
    { label: "Seconds", value: countdown.seconds },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center"
        >
          <motion.div
            key={unit.value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-bold mb-1"
          >
            {unit.value.toString().padStart(2, "0")}
          </motion.div>
          <div className="text-sm text-blue-100">{unit.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownDisplay;
