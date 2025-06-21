import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { menuConfig, type MenuItem } from "../config/menu.tsx";
import { FaChevronRight, FaChevronLeft, FaChevronDown } from "react-icons/fa";

const SideBar: React.FC = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (collapsed) setOpenKeys(new Set());
    }, [collapsed]);

    const isActive = (path: string) => location.pathname === path;
    const toggleSubMenu = (key: string, e: React.MouseEvent) => {
        e.preventDefault(); // 阻止 Link 跳转
        setOpenKeys((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };
    const useHeightTransition = (isOpen: boolean) => {
        const ref = useRef<HTMLUListElement>(null);
        const [height, setHeight] = useState<string | number>(0);
        useEffect(() => {
            if (ref.current) setHeight(isOpen ? ref.current.scrollHeight : 0);
        }, [isOpen]);
        return { ref, height };
    };
    const renderMenuItems = (items: MenuItem[]) =>
        items.map((item) => {
            const active = isActive(item.path);
            const hasChildren = !!item.children?.length;
            const isOpen = openKeys.has(item.key);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { ref, height } = useHeightTransition(isOpen && !collapsed);
            return (
                <li key={item.key} className="relative group">
                    {/* 一级菜单容器 */}
                    <div
                        className={`flex my-2 items-center px-4 py-2 cursor-pointer rounded transition-colors ${
                            active
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        title={collapsed ? item.label : undefined}
                        onClick={hasChildren ? (e) => toggleSubMenu(item.key, e) : undefined}
                    >
                        {item.icon && <span className="text-xl">{item.icon}</span>}

                        <span className={`ml-3 text-sm truncate ${collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"} transition-all`}>
        {item.label}
    </span>

                        {hasChildren && !collapsed && (
                            <span
                                aria-label={isOpen ? "收起子菜单" : "展开子菜单"}
                                className="ml-auto rounded p-1 text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
            {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </span>
                        )}

                        {/* 没有子菜单时再包 Link 实现跳转 */}
                        {!hasChildren && (
                            <Link to={item.path} className="absolute inset-0" aria-label={item.label} />
                        )}
                    </div>

                    {hasChildren && (
                        <ul
                            ref={ref}
                            style={{ height, overflow: "hidden", transition: "height 0.3s ease" }}
                            className={`ml-6 border-l border-gray-200 dark:border-gray-700 pl-3 ${collapsed ? "hidden" : "block"}`}
                        >
                            {item.children!.map((child) => {
                                const childActive = isActive(child.path);
                                return (
                                    <li key={child.key} className="my-1">
                                        <Link
                                            to={child.path}
                                            className={`block px-3 py-1 rounded ${
                                                childActive
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            <span className="truncate text-sm">{child.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </li>
            );
        });

    return (
        <aside
            className="relative border-r border-gray-200 bg-white shadow-lg duration-500 transition-[width] dark:border-gray-700 dark:bg-gray-900"
            style={{ width: collapsed ? 72 : 256 }}
        >
            {/* LOGO */}
            <div className="flex h-16 items-center justify-center border-b border-gray-200 dark:border-gray-700">
                <img
                    src=""
                    alt="Logo"
                    className={`h-10 w-auto transition-transform duration-300 origin-center ${collapsed ? "scale-0" : "scale-100"}`}
                />
            </div>

            {/* 菜单 */}
            <nav className="flex-1 overflow-y-auto p-4 pb-0">
                <ul className="m-0 list-none">{renderMenuItems(menuConfig)}</ul>
            </nav>

            {/* 悬浮切换按钮 */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-600 p-2 text-white shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
            >
                {collapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
            </button>
        </aside>
    );
};

export default SideBar;