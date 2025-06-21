// src/config/pageMap.ts
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";
// 其他页面导入...

export const pageMap: Record<string, React.ReactNode> = {
    "/": <HomePage />,
    "/about": <AboutPage />,
};