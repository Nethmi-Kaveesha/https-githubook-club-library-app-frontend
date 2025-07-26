import React, { useEffect, useState } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';

const ThemeToggle: React.FC = () => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDark(!isDark);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            title="Toggle Theme"
        >
            {isDark ? (
                <MdLightMode className="text-yellow-400 w-6 h-6" />
            ) : (
                <MdDarkMode className="text-gray-800 w-6 h-6" />
            )}
        </button>
    );
};

export default ThemeToggle;
