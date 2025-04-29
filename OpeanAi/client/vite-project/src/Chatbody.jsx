import React from "react";

const ChatBody = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-900 to-purple-900">
      {/* Title */}
      <div className="w-full py-6 bg-gray-800 bg-opacity-50 shadow-lg">
        <h1 className="text-white text-4xl font-bold text-center">CHATGPT 2.0</h1>
      </div>

      {/* Chat Container */}
      <div className="flex-1 w-full p-6 overflow-y-auto">
        {/* User Message */}
        <div className="flex justify-end mb-4">
          <div className="bg-purple-600 text-white rounded-lg px-6 py-4 max-w-[70%] shadow-lg">
            <p className="text-md">Hy Chat GPT, Can you help me?</p>
          </div>
        </div>

        {/* AI Message */}
        <div className="flex justify-start mb-4">
          <div className="bg-gray-700 text-white rounded-lg px-6 py-4 max-w-[70%] shadow-lg">
            <p className="text-md">Yeah, I can help you with anything!</p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="w-full p-6 bg-gray-800 bg-opacity-50 shadow-lg">
        <input
          type="text"
          placeholder="Type your message..."
          className="w-full px-6 py-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg"
        />
      </div>
    </div>
  );
};

export default ChatBody;