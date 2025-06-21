// src/layouts/AdvancedLayout.tsx
import React, { useState, type ReactNode } from "react";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Card from "../components/Card";
import {MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";
import {Outlet} from "react-router-dom";
import {Input} from "../components/Input";
import {FaSearch} from "react-icons/fa";

export interface AdvancedLayoutProps {
    /**
     * 顶部工具栏中自定义内容，比如搜索框。
     */
    headerContent?: ReactNode;
    /**
     * 页面底部自定义内容，比如版权信息。
     */
    footerContent?: ReactNode;
    /**
     * 页面主体内容。
     */
}

/**
 * AdvancedLayout 高级页面布局
 *
 * 包含侧边栏、顶部工具栏、水平导航、主内容区、页脚。
 * 支持暗色模式切换、语言切换。
 */
const AdvancedLayout: React.FC<AdvancedLayoutProps> = ({
                                                           headerContent,
                                                           footerContent,
                                                       }) => {
    const [darkMode, setDarkMode] = useState(() =>
        typeof window !== "undefined"
            ? document.documentElement.classList.contains("dark")
            : false
    );

    const [language, setLanguage] = useState("中文");

    /**
     * 切换暗色模式
     */
    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const next = !prev;
            if (next) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return next;
        });
    };

    /**
     * 切换语言
     */
    const toggleLanguage = () => {
        setLanguage((prev) => (prev === "中文" ? "English" : "中文"));
    };

    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
            {/* 左侧侧边栏 */}
                <SideBar />
            {/* 右侧主内容区 */}
            <div className="flex flex-grow flex-col">
                {/* 顶部工具栏 */}
                <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 transition-colors duration-300 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center space-x-4">
                        <Input
                            type="search"
                            placeholder="搜索..."
                            icon={<FaSearch />}
                            className="transition"
                        />
                    </div>

                    {/* 中间水平导航 */}
                    <NavBar />

                    {/* 顶部右侧工具栏 */}
                    <div className="flex items-center space-x-4">
                        {/* 切换语言 */}
                        <button
                            onClick={toggleLanguage}
                            className="rounded px-2 py-1 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700"
                            title="切换语言"
                        >
                            {language}
                        </button>

                        {/* 切换暗色模式 */}
                        <button
                            onClick={toggleDarkMode}
                            className="rounded px-2 py-1 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:hover:bg-gray-700"
                            title="切换暗色模式"
                            aria-pressed={darkMode}
                        >
                            {darkMode ? <MdOutlineDarkMode /> : <MdOutlineLightMode />}
                        </button>

                        {/* 用户头像 */}
                        <img
                            src="https://i.pravatar.cc/32"
                            alt="用户头像"
                            className="h-8 w-8 rounded-full"
                            title="用户"
                        />
                    </div>
                </header>

                {/* 主体内容 */}
                <main className="container mx-auto max-w-6xl flex-grow overflow-auto px-4 py-6 sm:px-6 lg:px-8">
                    <Card
                        className="mx-auto"
                        header={<div className="select-none text-xl font-semibold">{headerContent}</div>}
                        footer={<div className="select-none text-sm text-gray-500 dark:text-gray-400">卡片底部信息</div>}
                    >
                        <Outlet />
                    </Card>
                </main>

                {/* 页脚 */}
                <footer className="select-none bg-white p-4 text-center text-sm text-gray-600 shadow transition-colors duration-300 dark:bg-gray-800 dark:text-gray-400">
                    {footerContent ?? "© 2025 你的公司名称"}
                </footer>
            </div>
        </div>
    );
};

export default AdvancedLayout;