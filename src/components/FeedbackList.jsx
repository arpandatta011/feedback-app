import React from "react";

function FeedbackList({ feedbacks = [] }) {
  if (feedbacks.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 text-center">
        <div className="text-gray-500">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No feedback yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Be the first one to share your thoughts!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feedbacks.map(({ id, fullName, email, message, created_at }) => {
        const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

        return (
          <section
            key={id}
            role="article"
            className="bg-white shadow-lg rounded-xl p-6 transition duration-200 hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {fullName}
                </h3>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {formattedDate}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
          </section>
        );
      })}
    </div>
  );
}

export default FeedbackList;
