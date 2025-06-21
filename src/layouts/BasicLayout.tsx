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
        <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100">
            {/* 页头 */}
            <header className="bg-white p-4 shadow transition-colors duration-300 dark:bg-gray-800">
                {headerContent ?? (
                    <h1 className="select-none text-2xl font-bold text-gray-900 dark:text-gray-100">
                        页面标题
                    </h1>
                )}
            </header>

            {/* 主体内容区，使用 Card 包裹 */}
            <main className="container mx-auto max-w-5xl flex-grow px-4 py-6 sm:px-6 lg:px-8">
                <Card
                    className="mx-auto"
                    header={
                        <div className="select-none text-xl font-semibold text-gray-900 dark:text-gray-100">
                            卡片头部
                        </div>
                    }
                    footer={
                        <div className="select-none text-sm text-gray-500 dark:text-gray-400">
                            卡片底部信息
                        </div>
                    }
                >
                    {children}
                </Card>
            </main>

            {/* 页脚 */}
            <footer className="select-none bg-white p-4 text-center text-sm text-gray-600 shadow transition-colors duration-300 dark:bg-gray-800 dark:text-gray-400">
                {footerContent ?? "© 2025 你的公司名称"}
            </footer>
        </div>
    );
};

export default BasicLayout;