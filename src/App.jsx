import { motion } from "framer-motion";
import { useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { useEffect } from "react";
import { CATEGORIES } from "./constants/constans";
import { requestNotificationPermission } from "./utils/helper";
import Button from "./components/Button";
import EventCard from "./components/EventCard";
import Settings from "./components/Settings";
import BottomNavigation from "./components/BottomNavigation";
import Modal from "./components/Modal";
import EventForm from "./components/EventForm";
import CountdownDisplay from "./components/CountdownDisplay";
import { getEventsFromDB, saveEventsToDB } from "./utils/db";

function App() {
  const [events, setEvents] = useState([]);
  const [theme, setTheme] = useTheme();
  const [activeTab, setActiveTab] = useState("home");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    async function loadEvents() {
      const storedEvents = await getEventsFromDB();
      setEvents(storedEvents);
    }
    loadEvents();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Request notification permission on first load
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleSaveEvent = async (eventData) => {
    let updatedEvents;
    if (editingEvent) {
      updatedEvents = events.map((event) =>
        event.id === editingEvent.id ? eventData : event
      );
    } else {
      updatedEvents = [...events, eventData];
    }

    setEvents(updatedEvents);
    await saveEventsToDB(updatedEvents);

    setIsModalOpen(false);
    setEditingEvent(null);
    setActiveTab("home");
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((event) => event.id !== eventId);

      setEvents(updatedEvents);
      await saveEventsToDB(updatedEvents);

      setSelectedEvent(null);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleTabChange = (tab) => {
    if (tab === "add") {
      setEditingEvent(null);
      setIsModalOpen(true);
    } else {
      setActiveTab(tab);
      setSelectedEvent(null);
    }
  };

  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const pastEvents = events
    .filter((event) => new Date(event.date) <= new Date())
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Offline Banner */}
      {!isOnline && (
        <motion.div
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-red-500 text-white text-center py-2 text-sm font-medium"
        >
          📡 You're offline - Data is cached locally
        </motion.div>
      )}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⏰</span>
            <h1 className="text-xl font-bold">Countdowns</h1>
          </div>
          <button
            onClick={() => setActiveTab("settings")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        {activeTab === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            {selectedEvent ? (
              // Event Detail View
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                  >
                    <span>←</span>
                    <span>Back to Events</span>
                  </button>
                  <button
                    onClick={() => handleEditEvent(selectedEvent)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    ✏️
                  </button>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {CATEGORIES.find(
                        (cat) => cat.id === selectedEvent.category
                      )?.icon || "📅"}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {selectedEvent.name}
                    </h2>
                    <p className="text-blue-100 mb-6">
                      {new Date(selectedEvent.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>

                    <CountdownDisplay targetDate={selectedEvent.date} />
                  </div>
                </div>

                {selectedEvent.notes && (
                  <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-3">
                      Notes
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {selectedEvent.notes}
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleEditEvent(selectedEvent)}
                    variant="secondary"
                    className="flex-1"
                  >
                    Edit Event
                  </Button>
                  <Button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    variant="danger"
                    className="flex-1"
                  >
                    Delete Event
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Events List View
              <div className="space-y-6">
                {upcomingEvents.length === 0 && pastEvents.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="text-6xl mb-4">⏰</div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                      No events yet!
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Create your first countdown to get started
                    </p>
                    <Button onClick={() => setIsModalOpen(true)}>
                      Create Your First Event
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    {upcomingEvents.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                          Upcoming Events ({upcomingEvents.length})
                        </h2>
                        <div className="space-y-4">
                          {upcomingEvents.map((event) => (
                            <EventCard
                              key={event.id}
                              event={event}
                              onEdit={handleEditEvent}
                              onDelete={handleDeleteEvent}
                              onClick={setSelectedEvent}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {pastEvents.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4">
                          Past Events ({pastEvents.length})
                        </h2>
                        <div className="space-y-4">
                          {pastEvents.map((event) => (
                            <EventCard
                              key={event.id}
                              event={event}
                              onEdit={handleEditEvent}
                              onDelete={handleDeleteEvent}
                              onClick={setSelectedEvent}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "settings" && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Settings
              theme={theme}
              onThemeChange={setTheme}
              events={events}
              setEvents={setEvents}
            />
          </motion.div>
        )}
      </main>

      {/* Floating Action Button */}
      {activeTab === "home" && !selectedEvent && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-2xl transition-all duration-300"
        >
          ➕
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Modal for Add/Edit Event */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        title={editingEvent ? "Edit Event" : "Add New Event"}
      >
        <EventForm
          event={editingEvent}
          onSave={handleSaveEvent}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default App;
