import React, { useState, useEffect } from "react";
import FeedbackForm from "./components/FeedbackForm";
import { database, ref, push, onValue } from "./firebase";
import { motion } from "framer-motion";
import { FaBars } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

function App() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [theme, setTheme] = useState("light");
  const [formErrors, setFormErrors] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    setMobileMenuOpen(false);
  };

  const handleSubmit = async (formData) => {
    const errors = {};
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.message) errors.message = "Feedback message is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    try {
      const newFeedback = {
        id: crypto.randomUUID(),
        ...formData,
        created_at: new Date().toISOString(),
      };
      await push(ref(database, "feedbacks"), newFeedback);
      return true;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      return false;
    }
  };

  useEffect(() => {
    const feedbacksRef = ref(database, "feedbacks");
    const unsubscribe = onValue(feedbacksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const feedbackArray = Object.values(data).sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setFeedbacks(feedbackArray);
      } else {
        setFeedbacks([]);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition duration-300 ease-in-out ${
        theme === "light"
          ? "bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800"
          : "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
      }`}
    >
      {/* Mobile Top Bar */}
      <div className="flex justify-between items-center p-4 sm:hidden">
        <h1 className="text-2xl font-bold">Feedback Collector</h1>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-2xl cursor-pointer"
        >
          {mobileMenuOpen ? <IoMdClose /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`sm:hidden shadow-md rounded-md mx-4 my-2 p-4 space-y-4 ${
            theme === "light"
              ? "bg-white text-gray-800"
              : "bg-gray-700 text-white"
          }`}
        >
          <button
            onClick={toggleTheme}
            className="w-full py-2 rounded-md hover:bg-opacity-80 transition cursor-pointer"
            style={{
              backgroundColor: theme === "light" ? "#1f2937" : "#f3f4f6",
              color: theme === "light" ? "#fff" : "#1f2937",
            }}
          >
            {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full p-6 flex-grow relative">
        <h1 className="hidden sm:block text-4xl font-bold text-center mb-2">
          Feedback Collector
        </h1>
        <p className="hidden sm:block text-center mb-8">
          Share your thoughts with us
        </p>
        <button
          onClick={toggleTheme}
          className={`hidden sm:block absolute top-6 right-4 px-4 py-2 rounded-full transition duration-300 ease-in-out cursor-pointer hover:bg-opacity-80 ${
            theme === "light"
              ? "bg-gray-800 text-white"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
        </button>

        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="w-full sm:w-auto mb-8 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {showFeedback ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            )}
          </svg>
          {showFeedback ? "Hide Feedback" : "View Submitted Feedback"}
        </button>

        {showFeedback ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            {feedbacks.length === 0 ? (
              <p className="text-center">No feedback submitted yet.</p>
            ) : (
              feedbacks.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  className={`p-6 rounded-lg shadow-md space-y-4 ${
                    theme === "light"
                      ? "bg-white text-gray-800"
                      : "bg-gray-700 text-white"
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold">{feedback.fullName}</h3>
                  <p>
                    <strong>Feedback: </strong>
                    {feedback.message}
                  </p>
                  <p className="text-sm">
                    <strong>Email:</strong> {feedback.email}
                  </p>
                  <p className="text-sm">
                    <strong>Submitted on:</strong>{" "}
                    {new Date(feedback.created_at).toLocaleString()}
                  </p>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <FeedbackForm onSubmit={handleSubmit} errors={formErrors} />
        )}
      </div>

      {/* Footer */}
      <footer className="text-center mt-10 border-t text-sm p-4">
        <p>
          Created with by <strong>Arpan Datta</strong>
        </p>
        <p className="text-xs mt-1">
          Submitted on {new Date().toLocaleDateString()}
        </p>
        <p className="text-xs italic mt-1">
          © {new Date().getFullYear()} Arpan Datta. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
