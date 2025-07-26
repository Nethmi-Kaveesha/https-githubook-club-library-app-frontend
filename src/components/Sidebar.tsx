import React, { useState, type JSX } from "react";
import {
  MdDashboard,
  MdLibraryBooks,
  MdPerson,
  MdAssignment,
  MdWarning,
  MdAccountCircle,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  id: string;
  label: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    setSidebarOpen(false); // Close sidebar on mobile after clicking
    navigate(itemId === "dashboard" ? "/dashboard" : `/dashboard/${itemId}`);
  };

  const sidebarItems: SidebarItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <MdDashboard className="w-6 h-6" /> },
    { id: "books", label: "Books", icon: <MdLibraryBooks className="w-6 h-6" /> },
    { id: "readers", label: "Readers", icon: <MdPerson className="w-6 h-6" /> },
    { id: "lending", label: "Lending", icon: <MdAssignment className="w-6 h-6" /> },
    { id: "overdue", label: "Overdue", icon: <MdWarning className="w-6 h-6" /> },
    { id: "user", label: "User Details", icon: <MdAccountCircle className="w-6 h-6" /> },
  ];

  return (
      <>
        {/* Mobile Toggle Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50 mt-44">
          <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-teal-800 text-white p-2 rounded-md shadow-md"
              aria-label="Toggle Sidebar"
          >
            {sidebarOpen ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Backdrop Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
            <div
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                aria-hidden="true"
            />
        )}

        {/* Sidebar Panel */}
        <aside
            aria-label="Sidebar Navigation"
            className={`mt-10 fixed top-0 left-0 z-40 w-64 h-full bg-teal-900 text-teal-200 shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:mt-10 lg:rounded-r-lg`}
        >
          {/* Sidebar Content Container */}
          <div className="h-full flex flex-col p-6 overflow-y-auto max-h-screen">
            {/* Navigation Items - centered and reduced spacing */}
            <nav className="flex-1 flex flex-col justify-center items-center">
              <ul className="w-full space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = activeItem === item.id;
                  return (
                      <li key={item.id}>
                        <button
                            onClick={() => handleItemClick(item.id)}
                            className={`w-full flex items-center space-x-4 px-6 py-2 rounded-md text-base font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400
                      ${
                                isActive
                                    ? "bg-teal-700 text-white border-l-4 border-teal-400 shadow-inner"
                                    : "hover:bg-teal-800 hover:text-teal-50"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                        >
                      <span className={`transition ${isActive ? "text-white" : "text-teal-300"}`}>
                        {item.icon}
                      </span>
                          <span>{item.label}</span>
                        </button>
                      </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>
      </>
  );
};

export default Sidebar;
