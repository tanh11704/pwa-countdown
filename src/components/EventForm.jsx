import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { requestNotificationPermission } from "../utils/helper";
import { CATEGORIES, NOTIFICATION_TIMES } from "../constants/constans";
import Button from "./Button";

const EventForm = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: event?.name || "",
    date: event?.date || "",
    category: event?.category || "other",
    notes: event?.notes || "",
    notifications: event?.notifications || false,
    notificationTime: event?.notificationTime || "1_day_before",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Event name is required";
    if (!formData.date) newErrors.date = "Date is required";
    else if (new Date(formData.date) < new Date())
      newErrors.date = "Date must be in the future";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Request notification permission if enabled
    if (formData.notifications) {
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        alert(
          "Notification permission is required to enable notifications for this event."
        );
        return;
      }
    }

    const eventData = {
      ...formData,
      id: event?.id || Date.now().toString(),
      createdAt: event?.createdAt || new Date().toISOString(),
      sentNotifications: event?.sentNotifications || [],
    };

    onSave(eventData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Set minimum datetime to current time
  const now = new Date();
  const minDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Event Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 ${
            errors.name
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          placeholder="Enter event name..."
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.name}
          </motion.p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={formData.date}
          min={minDateTime}
          onChange={(e) => handleInputChange("date", e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 ${
            errors.date
              ? "border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        />
        {errors.date && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm mt-1"
          >
            {errors.date}
          </motion.p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleInputChange("category", category.id)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                formData.category === category.id
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <div className="text-xl mb-1">{category.icon}</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {category.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-gray-50 resize-none"
          placeholder="Add any additional notes..."
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-50">
              Enable Notifications
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Nhận thông báo cho sự kiện này
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              handleInputChange("notifications", !formData.notifications)
            }
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              formData.notifications
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-gray-600"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.notifications ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* [MỚI] Dropdown chọn thời gian chỉ hiển thị khi thông báo được bật */}
        {formData.notifications && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pl-4 pr-4"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reminder Time
            </label>
            <select
              value={formData.notificationTime}
              onChange={(e) =>
                handleInputChange("notificationTime", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:bg-gray-700 dark:text-gray-50"
            >
              {NOTIFICATION_TIMES.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </motion.div>
        )}
      </div>

      <div className="flex space-x-3 pt-4">
        <Button type="submit" className="flex-1">
          {event ? "Update Event" : "Create Event"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
