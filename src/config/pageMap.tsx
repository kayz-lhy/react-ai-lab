// src/config/pageMap.tsx
import React from "react";
import LoginPage from "../pages/LoginPage";
import TrafficDetectPage from "../pages/TrafficDetectPage.tsx";
import RegisterPage from "../pages/RegisterPage.tsx";
import ModelSelectionPage from "../pages/ModelSelectionPage.tsx";
import StatisticsPage from "../pages/StatisticPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import AboutPage from "../pages/AboutPage.tsx";
import TrainingProgressPage from "../pages/TrainingProgressPage.tsx";



const TrafficPage = () => (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            交通识别系统
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
            请先登录以访问交通识别功能。
        </p>
    </div>
);



const UsersPage = () => (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            用户管理
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
            用户管理系统界面
        </p>
    </div>
);

const UsersListPage = () => (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            用户列表
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
            查看和管理所有用户
        </p>
    </div>
);

const UsersProfilePage = () => (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            用户资料
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
            编辑用户个人资料
        </p>
    </div>
);

const ProfilePage = () => (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
            个人设置
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
            个人账户设置和偏好配置
        </p>
    </div>
);

// 页面组件映射表
export const pageMap: Record<string, React.ReactNode> = {
    "/": <HomePage />,
    "/login": <LoginPage />,
    "/about": <AboutPage />,
    "/traffic": <TrafficPage />,
    "/traffic/select": <ModelSelectionPage />,
    "/traffic/detect": <TrafficDetectPage />,
    "/traffic/statistics": <StatisticsPage />,
    "/traffic/progress": <TrainingProgressPage />,
    "/users": <UsersPage />,
    "/users/list": <UsersListPage />,
    "/users/profile": <UsersProfilePage />,
    "/profile": <ProfilePage />,
    // 为注册等特殊页面预留位置
    "/register": <RegisterPage />,
    "/forgot-password": <div>忘记密码页面</div>,

};