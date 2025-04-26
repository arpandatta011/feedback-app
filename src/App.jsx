import React, { useState, useEffect } from "react";
import FeedbackForm from "./components/FeedbackForm";
import { database, ref, push, onValue } from "./firebase";
import { motion } from "framer-motion";

function App() {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [theme, setTheme] = useState("light");
  const [formErrors, setFormErrors] = useState({});

  // Toggle theme (dark/light)
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // POST: Submit Feedback to Firebase
  const handleSubmit = async (formData) => {
    // Simple validation before submission
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

  // GET: Fetch Feedbacks from Firebase
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

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-gray-50 to-gray-100 transition duration-300 ease-in-out">
      <div className="max-w-4xl mx-auto w-full p-6 flex-grow">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Feedback Collector
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Share your thoughts with us
        </p>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out cursor-pointer hover:bg-gray-700 active:bg-gray-600"
        >
          {theme === "light" ? "🌙 Dark Mode" : "🌞 Light Mode"}
        </button>

        {/* View/Hide Feedback Button */}
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

        {/* Feedback List with Animations */}
        {showFeedback ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            {feedbacks.length === 0 ? (
              <p className="text-center text-gray-600">
                No feedback submitted yet.
              </p>
            ) : (
              feedbacks.map((feedback) => (
                <motion.div
                  key={feedback.id}
                  className="bg-white p-6 rounded-lg shadow-md space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-gray-800">
                    {feedback.fullName}
                  </h3>
                  <p className="text-gray-600">
                    <strong>Feedback: </strong>
                    {feedback.message}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Email:</strong> {feedback.email}
                  </p>
                  <p className="text-sm text-gray-500">
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

      <footer className="text-center mt-10 border-t text-gray-600 text-sm">
        <p>
          Created with by <strong>Arpan Datta</strong>
        </p>
        <p className="text-xs mt-1">
          Submitted on {new Date().toLocaleDateString()}
        </p>
        <p className="text-xs italic mt-1 text-gray-400">
          © {new Date().getFullYear()} Arpan Datta. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
