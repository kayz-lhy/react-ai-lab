// App.tsx
import { useState, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { menuConfig, type MenuItem } from "./config/menu";
import AdvancedLayout from "./layouts/AdvancedLayout";
import { pageMap } from "./config/pageMap.tsx";

export default function App() {
    const [darkMode] = useState(false);
    const location = useLocation();

    // 获取当前用户登录状态
    const currentUser = useMemo(() => {
        const token = localStorage.getItem("token");
        const username = localStorage.getItem("username");
        return token ? { username, role: "admin" } : null;
    }, [location.pathname]);

    // 定义不需要 Layout 包裹的特殊页面
    const specialPages = ["/login", "/register", "/forgot-password"];

    function findDescription(items: MenuItem[], pathname: string): string | undefined {
        for (const item of items) {
            if (item.path === pathname) return item.description;
            if (item.children) {
                const desc = findDescription(item.children, pathname);
                if (desc) return desc;
            }
        }
        return undefined;
    }

    const currentDescription = findDescription(menuConfig, location.pathname);

    // 检查当前路由是否需要认证
    function requiresAuth(items: MenuItem[], pathname: string): boolean {
        for (const item of items) {
            if (item.path === pathname) return item.requireAuth || false;
            if (item.children) {
                const result = requiresAuth(item.children, pathname);
                if (result) return result;
            }
        }
        return false;
    }

    const currentPageRequiresAuth = requiresAuth(menuConfig, location.pathname);

    // 检查当前路径是否为特殊页面
    const isSpecialPage = specialPages.includes(location.pathname);

    // 收集所有路由路径
    function getAllRoutePaths(items: MenuItem[]): string[] {
        const paths: string[] = [];
        items.forEach(item => {
            paths.push(item.path);
            if (item.children?.length) {
                paths.push(...getAllRoutePaths(item.children));
            }
        });
        return paths;
    }

    const allPaths = getAllRoutePaths(menuConfig);

    // 如果是特殊页面，直接渲染，不使用 Layout
    if (isSpecialPage) {
        return (
            <div className={darkMode ? "dark min-h-screen bg-gray-900" : "min-h-screen bg-white"}>
                <Routes>
                    {specialPages.map(path => {
                        const element = pageMap[path];
                        if (element) {
                            return <Route key={path} path={path} element={element} />;
                        }
                        return null;
                    })}
                </Routes>
            </div>
        );
    }

    // 普通页面使用 Layout 包裹
    return (
        <div className={darkMode ? "dark min-h-screen bg-gray-900" : "min-h-screen bg-white"}>
            <AdvancedLayout
                headerContent={currentDescription}
                footerContent={'@lhy 2025 All rights reserved.'}
                showLoginPrompt={currentPageRequiresAuth && !currentUser}
            >
                <Routes>
                    {allPaths.map(path => {
                        // 跳过特殊页面
                        if (specialPages.includes(path)) {
                            return null;
                        }

                        const element = pageMap[path];
                        if (element) {
                            return <Route key={path} path={path} element={element} />;
                        }
                        return null;
                    })}
                </Routes>
            </AdvancedLayout>
        </div>
    );
}