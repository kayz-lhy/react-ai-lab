// src/components/NavBar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const topNavItems = [
    { key: "home", path: "/", label: "首页" },
    { key: "profile", path: "/profile", label: "我的账户" },
    { key: "settings", path: "/settings", label: "设置" },
];

const NavBar: React.FC = () => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="flex space-x-4">
            {topNavItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <Link
                        key={item.key}
                        to={item.path}
                        className={`px-3 py-2 rounded ${
                            active
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                    >
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
};

export default NavBar;