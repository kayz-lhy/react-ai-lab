// src/layouts/BasicLayout.tsx
import React, { type ReactNode } from "react";
import Card from "../components/Card";

interface BasicLayoutProps {
    headerContent?: ReactNode;
    footerContent?: ReactNode;
    children: ReactNode;
}

/**
 * 基础页面布局
 *
 * 使用 Card 组件作为内容容器，
 * 布局包含页面头部、内容区和页脚。
 *
 * 适配暗色模式，平滑过渡背景和文字颜色。
 */
const BasicLayout: React.FC<BasicLayoutProps> = ({
                                                     headerContent,
                                                     footerContent,
                                                     children,
                                                 }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* 页头 */}
            <header className="bg-white dark:bg-gray-800 shadow p-4 transition-colors duration-300">
                {headerContent ?? (
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 select-none">
                        页面标题
                    </h1>
                )}
            </header>

            {/* 主体内容区，使用 Card 包裹 */}
            <main className="flex-grow container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Card
                    className="mx-auto"
                    header={
                        <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 select-none">
                            卡片头部
                        </div>
                    }
                    footer={
                        <div className="text-sm text-gray-500 dark:text-gray-400 select-none">
                            卡片底部信息
                        </div>
                    }
                >
                    {children}
                </Card>
            </main>

            {/* 页脚 */}
            <footer className="bg-white dark:bg-gray-800 shadow p-4 text-center text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300 select-none">
                {footerContent ?? "© 2025 你的公司名称"}
            </footer>
        </div>
    );
};

export default BasicLayout;