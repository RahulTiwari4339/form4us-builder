import React, { useState } from "react";
import { Home, Hammer, Settings } from "lucide-react";

const Mobile = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        {activeTab === "home" && (
          <div className="text-center text-gray-800">
            <h1 className="text-xl font-semibold mb-2">Home</h1>
            <p className="text-sm text-gray-500">Yeh aapka Home screen content hoga.</p>
          </div>
        )}

        {activeTab === "build" && (
  <>
    {/* Top Header */}
    <div className="w-full h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <h1 className="text-lg font-semibold text-gray-800">Title</h1>

      <button className="px-4 py-1 rounded-full text-sm font-medium bg-green-500 text-white shadow-sm">
        Published
      </button>
    </div>

    {/* Action Buttons Row */}
    <div className="flex gap-3 p-4 border-b bg-white">
      <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm shadow">
        + Add Block
      </button>
      <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm shadow">
        Design
      </button>
      <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm shadow">
        Settings
      </button>
    </div>
  </>
)}


        {activeTab === "settings" && (
          <div className="text-center text-gray-800">
            <h1 className="text-xl font-semibold mb-2">Settings</h1>
            <p className="text-sm text-gray-500">App settings yahan manage kar sakte ho.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="h-16 bg-white border-t border-gray-200 flex items-center justify-around shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        {/* Home */}
        <button
          onClick={() => setActiveTab("home")}
          className="flex flex-col items-center justify-center gap-1 text-xs"
        >
          <Home
            className={`w-5 h-5 ${
              activeTab === "home" ? "text-blue-600" : "text-gray-400"
            }`}
          />
          <span
            className={`${
              activeTab === "home" ? "text-blue-600 font-medium" : "text-gray-400"
            }`}
          >
            Home
          </span>
        </button>

        {/* Build */}
        <button
          onClick={() => setActiveTab("build")}
          className="flex flex-col items-center justify-center gap-1 text-xs"
        >
          <Hammer
            className={`w-5 h-5 ${
              activeTab === "build" ? "text-blue-600" : "text-gray-400"
            }`}
          />
          <span
            className={`${
              activeTab === "build" ? "text-blue-600 font-medium" : "text-gray-400"
            }`}
          >
            Build
          </span>
        </button>

        {/* Settings */}
        <button
          onClick={() => setActiveTab("settings")}
          className="flex flex-col items-center justify-center gap-1 text-xs"
        >
          <Settings
            className={`w-5 h-5 ${
              activeTab === "settings" ? "text-blue-600" : "text-gray-400"
            }`}
          />
          <span
            className={`${
              activeTab === "settings" ? "text-blue-600 font-medium" : "text-gray-400"
            }`}
          >
            Settings
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Mobile;
