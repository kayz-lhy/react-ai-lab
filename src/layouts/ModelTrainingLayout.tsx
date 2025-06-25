// src/pages/ModelTrainingLayout.tsx
import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const sections = [
    { key: "data", label: "Data Configuration" },
    { key: "training", label: "Training Parameters" },
    { key: "model", label: "Model Architecture" },
    { key: "augmentation", label: "Data Augmentation" },
];

const ModelTrainingLayout: React.FC = () => {
    const [activeSection, setActiveSection] = useState("data");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            {/* 左侧侧边栏 */}
            <aside
                className={`relative border-r border-neutral-200 dark:border-neutral-800 p-4 transition-all duration-300 ${
                    sidebarCollapsed ? "w-16" : "w-64"
                }`}
            >
                {/* 折叠按钮 */}
                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="absolute top-4 -right-4 p-2 bg-blue-600 text-white rounded-full shadow hover:scale-110 transition"
                    title={sidebarCollapsed ? "展开侧边栏" : "折叠侧边栏"}
                >
                    {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>

                <h2
                    className={`text-lg font-semibold mb-4 transition-opacity ${
                        sidebarCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
                    }`}
                >
                    Training Config
                </h2>

                <nav className="space-y-2">
                    {sections.map((s) => (
                        <button
                            key={s.key}
                            onClick={() => setActiveSection(s.key)}
                            className={`w-full text-left px-3 py-2 rounded transition ${
                                activeSection === s.key
                                    ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                                    : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            } ${
                                sidebarCollapsed ? "text-center" : ""
                            }`}
                            title={s.label}
                        >
                            {!sidebarCollapsed ? s.label : s.label.charAt(0)}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* 右侧内容区 */}
            <main className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-4">
                    {sections.find((s) => s.key === activeSection)?.label}
                </h1>
                <div className="text-neutral-500 dark:text-neutral-400">
                    当前正在编辑 “{activeSection}” 配置项
                </div>
            </main>
        </div>
    );
};

export default ModelTrainingLayout;
