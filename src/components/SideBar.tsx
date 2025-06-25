// src/components/SideBar.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { menuConfig, type MenuItem } from "../config/menu";
import { FaChevronRight, FaChevronLeft, FaChevronDown } from "react-icons/fa";
import { MdLogout, MdLogin } from "react-icons/md";
import { FiUser, FiUserPlus as FiUserPlusOutline } from "react-icons/fi";

interface SideBarProps {
    collapsed: boolean;
    setCollapsed: (c: boolean) => void;
    className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed, setCollapsed, className }) => {
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

    // 获取当前用户信息
    const currentUser = useMemo(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        return token ? { username, role: "admin" } : null;
    }, [location.pathname]);

    // 过滤菜单项
    const filteredMenuConfig = useMemo(() => {
        const filterMenuItems = (items: MenuItem[]): MenuItem[] => {
            return items
                .filter(item => {
                    if (item.notDisplay) return false;
                    if (item.requireAuth && !currentUser) return false;
                    if (item.roles && currentUser && !item.roles.includes(currentUser.role)) {
                        return false;
                    }
                    return true;
                })
                .map(item => ({
                    ...item,
                    children: item.children ? filterMenuItems(item.children) : undefined
                }))
                .filter(item => {
                    if (item.children !== undefined) {
                        return item.children.length > 0;
                    }
                    return true;
                });
        };

        return filterMenuItems(menuConfig);
    }, [currentUser]);

    useEffect(() => {
        if (collapsed) setOpenKeys(new Set());
    }, [collapsed]);

    useEffect(() => {
        const currentPath = location.pathname;
        const newOpenKeys = new Set<string>();

        const findParentKeys = (items: MenuItem[], path: string): string[] => {
            for (const item of items) {
                if (item.children) {
                    for (const child of item.children) {
                        if (child.path === path) {
                            return [item.key];
                        }
                    }
                    const childKeys = findParentKeys(item.children, path);
                    if (childKeys.length > 0) {
                        return [item.key, ...childKeys];
                    }
                }
            }
            return [];
        };

        const parentKeys = findParentKeys(filteredMenuConfig, currentPath);
        parentKeys.forEach(key => newOpenKeys.add(key));
        setOpenKeys(newOpenKeys);
    }, [location.pathname, filteredMenuConfig]);

    const isActive = (path: string) => location.pathname === path;

    const toggleSubMenu = (key: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenKeys((prev) => {
            const newSet = new Set(prev);
            newSet.has(key) ? newSet.delete(key) : newSet.add(key);
            return newSet;
        });
    };

    const useHeightTransition = (isOpen: boolean) => {
        const ref = useRef<HTMLUListElement>(null);
        const [height, setHeight] = useState<string | number>(0);

        useEffect(() => {
            if (ref.current) {
                setHeight(isOpen ? ref.current.scrollHeight : 0);
            }
        }, [isOpen]);

        return { ref, height };
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        window.location.href = "/login";
    };

    const renderMenuItems = (items: MenuItem[]) =>
        items.map((item) => {
            const active = isActive(item.path);
            const hasChildren = !!item.children?.length;
            const isOpen = openKeys.has(item.key);
            const { ref, height } = useHeightTransition(isOpen && !collapsed);

            return (
                <li key={item.key} className="relative group">
                    <div
                        className={`flex items-center px-3 py-2.5 mx-2 mb-2 cursor-pointer rounded-xl transition-all duration-300 group-hover:shadow-md ${
                            active
                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]"
                                : "text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:shadow-sm"
                        }`}
                        title={collapsed ? item.label : undefined}
                        onClick={hasChildren ? (e) => toggleSubMenu(item.key, e) : undefined}
                    >
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300 ${
                            active
                                ? "bg-white/20 text-white"
                                : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}>
                            {item.icon}
                        </div>

                        <div className={`ml-3 transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                            <span className="text-sm font-medium whitespace-nowrap block">
                                {item.label}
                            </span>
                            {item.description && !collapsed && (
                                <span className="text-xs opacity-70 whitespace-nowrap block mt-0.5">
                                    {item.description}
                                </span>
                            )}
                        </div>

                        {hasChildren && !collapsed && (
                            <div className={`ml-auto transition-all duration-300 ${
                                active ? "text-white" : "text-slate-400"
                            }`}>
                                <div className="p-1 rounded-md hover:bg-black/10 transition-colors">
                                    {isOpen ? <FaChevronDown className="w-3 h-3" /> : <FaChevronRight className="w-3 h-3" />}
                                </div>
                            </div>
                        )}

                        {!hasChildren && (
                            <Link
                                to={item.path}
                                className="absolute inset-0 rounded-xl"
                                aria-label={item.label}
                            />
                        )}
                    </div>

                    {hasChildren && (
                        <ul
                            ref={ref}
                            style={{
                                height,
                                overflow: "hidden",
                                transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                            }}
                            className={`ml-8 ${collapsed ? "hidden" : "block"}`}
                        >
                            {item.children!.map((child) => {
                                const childActive = isActive(child.path);
                                return (
                                    <li key={child.key} className="relative group">
                                        <Link
                                            to={child.path}
                                            className={`flex items-center px-3 py-2 mx-2 mb-1 rounded-lg transition-all duration-300 group-hover:shadow-sm ${
                                                childActive
                                                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md transform scale-[1.02]"
                                                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100"
                                            }`}
                                        >
                                            <div className={`flex items-center justify-center w-6 h-6 rounded-md transition-all duration-300 ${
                                                childActive
                                                    ? "bg-white/20 text-white"
                                                    : "text-slate-400 group-hover:text-emerald-600"
                                            }`}>
                                                {child.icon}
                                            </div>
                                            <div className="ml-2">
                                                <span className="text-sm font-medium block">
                                                    {child.label}
                                                </span>
                                                {child.description && (
                                                    <span className="text-xs opacity-70 block mt-0.5">
                                                        {child.description}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </li>
            );
        });

    // 未登录时的登录注册组件
    const LoginRegisterSection = () => (
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 space-y-3">
            <div className="text-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiUser className="w-6 h-6 text-white" />
                </div>
                {!collapsed && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        登录以获得完整体验
                    </p>
                )}
            </div>

            {/* 登录按钮 */}
            <Link
                to="/login"
                className={`w-full flex items-center px-3 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 hover:shadow-md group transform hover:scale-[1.02] ${
                    collapsed ? "justify-center" : ""
                }`}
                title={collapsed ? "登录" : undefined}
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                    <MdLogin className="text-xl" />
                </div>
                <span className={`ml-3 text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                    立即登录
                </span>
            </Link>

            {/* 注册按钮 */}
            <Link
                to="/register"
                className={`w-full flex items-center px-3 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl transition-all duration-300 hover:shadow-md group ${
                    collapsed ? "justify-center" : ""
                }`}
                title={collapsed ? "注册" : undefined}
            >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg">
                    <FiUserPlusOutline className="text-lg" />
                </div>
                <span className={`ml-3 text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                    免费注册
                </span>
            </Link>
        </div>
    );

    return (
        <aside
            className={`fixed left-0 top-0 h-full z-50 flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 shadow-2xl transition-all duration-300 ease-in-out ${className}`}
            style={{ width: collapsed ? 80 : 280 }}
        >
            {/* Logo 区域 */}
            <div className="h-16 flex items-center border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                {collapsed ? (
                    <div className="w-full flex justify-center h-28">
                        <div className="overflow-hidden">
                            <img
                                src="/public/light.png"
                                alt="Logo"
                                className="w-28 block dark:hidden"
                            />
                            <img
                                src="/public/dark.png"
                                alt="Logo"
                                className=" w-28 hidden dark:block"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="px-6 flex items-center space-x-3">
                        <div className="overflow-hidden">
                            <img
                                src="/public/light.png"
                                alt="Logo"
                                className="h-8 w-auto block dark:hidden"
                            />
                            <img
                                src="/public/dark.png"
                                alt="Logo"
                                className="h-8 w-auto hidden dark:block"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                                CVLab
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                计算机视觉体验系统
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 用户信息区域 */}
            {currentUser && !collapsed && (
                <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 flex-shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                            {currentUser.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                                {currentUser.username}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                在线
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 导航菜单 */}
            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <ul className="list-none p-0 m-0">
                    {renderMenuItems(filteredMenuConfig)}
                </ul>
            </nav>

            {/* 底部操作区域 */}
            <div className="flex-shrink-0">
                {currentUser ? (
                    /* 退出登录按钮 */
                    <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
                        <button
                            onClick={handleLogout}
                            className={`w-full flex items-center px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 hover:shadow-md group ${
                                collapsed ? "justify-center" : ""
                            }`}
                            title={collapsed ? "退出登录" : undefined}
                        >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-all duration-300">
                                <MdLogout className="text-xl" />
                            </div>
                            <span className={`ml-3 text-sm font-medium transition-all duration-300 ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}`}>
                                退出登录
                            </span>
                        </button>
                    </div>
                ) : (
                    /* 登录注册区域 */
                    <LoginRegisterSection />
                )}
            </div>

            {/* 折叠/展开按钮 */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute top-1/2 -right-4 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10 border-2 border-white dark:border-slate-800"
                title={collapsed ? "展开侧边栏" : "收起侧边栏"}
            >
                {collapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
            </button>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.3);
                    border-radius: 2px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.5);
                }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(71, 85, 105, 0.3);
                }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(71, 85, 105, 0.5);
                }
            `}</style>
        </aside>
    );
};

export default SideBar;