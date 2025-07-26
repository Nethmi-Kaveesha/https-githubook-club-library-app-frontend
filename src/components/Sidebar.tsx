import React, { useState, type JSX } from "react";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPerson,
  MdAssignment,
  MdWarning,
  MdAccountCircle, // user icon
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  id: string;
  label: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const navigate = useNavigate();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    if (itemId === "dashboard") navigate(`/dashboard`);
    else navigate(`/dashboard/${itemId}`);
  };

  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard className="w-6 h-6" /> },
    { id: "books", label: "Books", icon: <MdLibraryBooks className="w-6 h-6" /> },
    { id: "readers", label: "Readers", icon: <MdPerson className="w-6 h-6" /> },
    { id: "lending", label: "Lending", icon: <MdAssignment className="w-6 h-6" /> },
    { id: "overdue", label: "Overdue", icon: <MdWarning className="w-6 h-6" /> },
    // New User Details button
    { id: "user", label: "User Details", icon: <MdAccountCircle className="w-6 h-6" /> },
  ];

  return (
      <aside
          aria-label="Sidebar Navigation"
          className="bg-teal-900 text-teal-200 w-64 min-h-screen p-6 flex flex-col shadow-lg rounded-r-lg mt-10"
      >
        {/* Logo / Brand */}
        <div className="mb-10 flex items-center select-none cursor-default">
          <div className="bg-teal-400 text-teal-900 rounded-full w-14 h-14 flex items-center justify-center text-3xl font-extrabold shadow-md">
            LN
          </div>
          <h1 className="ml-4 text-white text-3xl font-extrabold tracking-wide">
            Admin Panel
          </h1>
        </div>

        <nav className="flex-1">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeItem === item.id;
              return (
                  <li key={item.id}>
                    <button
                        onClick={() => handleItemClick(item.id)}
                        className={`w-full flex items-center space-x-4 px-6 py-3 rounded-md
                    text-base font-semibold transition-colors duration-300
                    focus:outline-none focus:ring-2 focus:ring-teal-400
                    ${
                            isActive
                                ? "bg-teal-700 text-white border-l-4 border-teal-400 shadow-inner"
                                : "hover:bg-teal-800 hover:text-teal-50"
                        }
                  `}
                        aria-current={isActive ? "page" : undefined}
                    >
                  <span
                      className={`flex-shrink-0 transition-colors duration-300 ${
                          isActive ? "text-white" : "text-teal-300"
                      }`}
                  >
                    {item.icon}
                  </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-teal-700">
          <button
              onClick={() => alert("Logging out...")}
              className="w-full flex items-center space-x-3 px-6 py-3 rounded-md text-red-400 hover:bg-red-600 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <MdWarning className="w-6 h-6" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
