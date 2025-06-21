// App.tsx
import { JSX, useState } from "react";
import {Route, Routes, useLocation} from "react-router-dom";
import { menuConfig } from "./config/menu";
import AdvancedLayout from "./layouts/AdvancedLayout";
import {pageMap} from "./config/pageMap.tsx";

export default function App() {
    const [darkMode, setDarkMode] = useState(false);
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
    const location = useLocation();
    const currentDescription = findDescription(menuConfig, location.pathname);

    function generateRoutes(items: typeof menuConfig): JSX.Element[] {
        return items.flatMap((item) => {
            const routes = [];
            const element = pageMap[item.path]; // 从 pageMap 取对应组件
            if (element) {
                routes.push(
                    <Route key={item.key} path={item.path} element={element} />
                );
            }
            if (item.children?.length) {
                routes.push(...generateRoutes(item.children));
            }
            return routes;
        });
    }

    return (
        <div className={darkMode ? "dark min-h-screen bg-gray-900" : "min-h-screen bg-white"}>
            <Routes>
                <Route element={<AdvancedLayout headerContent={currentDescription} footerContent={'@lhy 2025 All rights reserved.'} />}>{generateRoutes(menuConfig)}</Route>
            </Routes>
        </div>
    );
}