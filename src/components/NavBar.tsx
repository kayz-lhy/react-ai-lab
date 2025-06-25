// src/components/NavBar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaSearch, FaBell, FaUser, FaCog, FaHome, FaChevronDown } from "react-icons/fa";
import { HiGlobeAlt } from "react-icons/hi";
import Input from "./Input";

interface NavBarProps {
    darkMode: boolean;
    onToggleDarkMode: () => void;
    language: string;
    onToggleLanguage: () => void;
    collapsed?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({
                                           darkMode,
                                           onToggleDarkMode,
                                           language,
                                           onToggleLanguage,
                                           collapsed = false
                                       }) => {
    const [searchFocused, setSearchFocused] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: "/", label: "首页", icon: FaHome },
        { path: "/profile", label: "账户", icon: FaUser },
        { path: "/settings", label: "设置", icon: FaCog },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="flex h-16 items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between w-full px-6">

                {/* 左侧：搜索区域 */}
                <div className="flex items-center flex-1 max-w-md">
                    <div className="relative w-full group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className={`w-4 h-4 transition-colors duration-200 ${
                                searchFocused ? 'text-blue-500' : 'text-slate-400'
                            }`} />
                        </div>
                        <input
                            type="search"
                            placeholder="搜索内容..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="w-full h-10 pl-10 pr-12 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 rounded border">
                                ⌘K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* 中央：导航菜单 */}
                <div className="flex items-center mx-8">
                    <nav className="flex items-center bg-slate-100/80 dark:bg-slate-800/80 rounded-xl p-1 border border-slate-200/60 dark:border-slate-700/60">
                        {navItems.map((item) => {
                            const active = isActive(item.path);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-700/60'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* 右侧：操作按钮 */}
                <div className="flex items-center space-x-2 flex-1 justify-end">

                    {/* 语言切换 */}
                    <button
                        onClick={onToggleLanguage}
                        className="flex items-center space-x-2 h-10 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        title="切换语言"
                    >
                        <HiGlobeAlt className="w-4 h-4" />
                        <span>{language}</span>
                    </button>

                    {/* 深色模式切换 */}
                    <button
                        onClick={onToggleDarkMode}
                        className="flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        title={darkMode ? "切换到浅色模式" : "切换到深色模式"}
                    >
                        {darkMode ? (
                            <MdOutlineLightMode className="w-5 h-5 text-amber-500" />
                        ) : (
                            <MdOutlineDarkMode className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        )}
                    </button>

                    {/* 通知按钮 */}
                    <button className="relative flex items-center justify-center w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
                        <FaBell className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        {/* 通知红点 */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </button>

                    {/* 分割线 */}
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

                    {/* 用户菜单 */}
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center space-x-3 h-10 pl-2 pr-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <div className="relative">
                                <img
                                    src="https://i.pravatar.cc/32"
                                    alt="用户头像"
                                    className="w-6 h-6 rounded-lg object-cover"
                                />
                                {/* 在线状态 */}
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border border-white dark:border-slate-900 rounded-full"></div>
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:block">
                                用户名
                            </span>
                            <FaChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                                userMenuOpen ? 'rotate-180' : ''
                            }`} />
                        </button>

                        {/* 用户下拉菜单 */}
                        {userMenuOpen && (
                            <>
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50">
                                    {/* 用户信息 */}
                                    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center space-x-3">
                                            <img
                                                src="https://i.pravatar.cc/40"
                                                alt="用户头像"
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">用户名</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">user@example.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 菜单项 */}
                                    <div className="p-2">
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <FaUser className="w-4 h-4" />
                                            <span>个人资料</span>
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center space-x-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <FaCog className="w-4 h-4" />
                                            <span>设置</span>
                                        </Link>

                                        <hr className="my-2 border-slate-200 dark:border-slate-700" />

                                        <button className="flex items-center space-x-3 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>退出登录</span>
                                        </button>
                                    </div>
                                </div>
                                {/* 遮罩层 */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setUserMenuOpen(false)}
                                ></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default NavBar;