// src/layouts/AdvancedLayout.tsx
import React, { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import Card from "../components/Card";
import { FiLogIn, FiLock } from "react-icons/fi";
import { Outlet } from "react-router-dom";

export interface AdvancedLayoutProps {
    headerContent?: ReactNode;
    footerContent?: ReactNode;
    showLoginPrompt?: boolean;
    children?: ReactNode;
}

const AdvancedLayout: React.FC<AdvancedLayoutProps> = ({
                                                           headerContent,
                                                           footerContent,
                                                           showLoginPrompt = false,
                                                           children
                                                       }) => {
    const [darkMode, setDarkMode] = useState(
        typeof window !== "undefined" ? document.documentElement.classList.contains("dark") : false
    );
    const [language, setLanguage] = useState("中文");
    const [collapsed, setCollapsed] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode((prev) => {
            const next = !prev;
            if (next) document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
            return next;
        });
    };

    const toggleLanguage = () => setLanguage((prev) => (prev === "中文" ? "English" : "中文"));

    // 登录提示组件
    const LoginPrompt = () => (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-lg mx-auto p-8">
                {/* 动画图标 */}
                <div className="relative mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-105 transition-all duration-500">
                        <FiLock className="w-16 h-16 text-white animate-pulse" />
                    </div>
                    {/* 装饰性光环 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl animate-pulse"></div>
                </div>

                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4 tracking-tight">
                    访问受限
                </h2>

                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    这个页面需要您先登录才能访问。登录后即可享受完整的功能体验。
                </p>

                <div className="space-y-4 mb-8">
                    <Link
                        to="/login"
                        className="group inline-flex items-center justify-center space-x-3 w-full px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
                    >
                        <FiLogIn className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                        <span>立即登录</span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-full px-8 py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:ring-offset-2"
                    >
                        返回首页
                    </Link>
                </div>

                {/* 功能预览卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">个性化内容</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <p className="text-sm text-purple-800 dark:text-purple-200 font-medium">高级功能</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <p className="text-sm text-green-800 dark:text-green-200 font-medium">数据分析</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-700 ease-in-out">
            {/* 侧边栏 */}
            <SideBar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* 主内容区域，添加左边距以适配固定的侧边栏 */}
            <div
                className="flex flex-col flex-grow min-w-0 transition-all duration-300 ease-in-out"
                style={{ marginLeft: collapsed ? 80 : 280 }}
            >
                {/* 导航栏 */}
                <NavBar
                    darkMode={darkMode}
                    onToggleDarkMode={toggleDarkMode}
                    language={language}
                    onToggleLanguage={toggleLanguage}
                    collapsed={collapsed}
                />

                {/* 主要内容区域 */}
                <main className="flex-grow overflow-auto relative">
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-indigo-400/5 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-400/3 to-blue-400/3 rounded-full blur-3xl animate-pulse delay-500"></div>
                    </div>

                    {/* 内容容器 */}
                    <div className="relative p-6">
                        <Card
                            className="mx-auto max-w-7xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 hover:shadow-3xl hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60"
                            header={
                                headerContent && (
                                    <div className="relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
                                        <div className="relative px-8 py-6">
                                            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                                                {headerContent}
                                            </h1>
                                        </div>
                                        {/* 装饰性底部边框 */}
                                        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-slate-700"></div>
                                    </div>
                                )
                            }
                            footer={
                                <div className="relative border-t border-slate-200/50 dark:border-slate-700/50">
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-700/30"></div>
                                    <div className="relative px-8 py-4 text-center">
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                            {footerContent ?? "© 2025 你的公司名称 · 版权所有 · 用心打造每一个细节"}
                                        </p>
                                    </div>
                                </div>
                            }
                        >
                            <div className="relative">
                                {/* 内容区域 */}
                                <div className="px-8 py-6 min-h-[400px]">
                                    {showLoginPrompt ? <LoginPrompt /> : (children || <Outlet />)}
                                </div>
                            </div>
                        </Card>
                    </div>
                </main>
            </div>

            {/* 全局样式 */}
            <style>{`
                /* 自定义滚动条 */
                .scrollbar-thin {
                    scrollbar-width: thin;
                }

                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }

                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.3);
                    border-radius: 3px;
                }

                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.5);
                }

                /* 深色模式滚动条 */
                .dark .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: rgba(71, 85, 105, 0.3);
                }

                .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: rgba(71, 85, 105, 0.5);
                }
            `}</style>
        </div>
    );
};

export default AdvancedLayout;