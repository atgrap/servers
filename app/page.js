"use client"

import { useEffect, useState } from "react";


export default function Home() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    socket.on("connect", () => {
      console.log("WebSocket connected");
    });

    socket.on("message", (data) => {
      const { username, message } = data;
      setChatLog((prevLog) => [...prevLog, `${username}: ${message}`]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (message.trim() !== "") {
      socket.emit("message", message);
      setMessage("");
    }
  };

  const handleJoin = () => {
    if (username.trim() !== "") {
      socket.emit("join", username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full bg-white p-4 shadow-md rounded-md">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleJoin}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Join
        </button>
        <div className="mt-4 p-3 border border-gray-300 rounded-md h-60 overflow-y-auto">
          {chatLog.map((log, index) => (
            <p key={index} className="mb-2">
              {log}
            </p>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
