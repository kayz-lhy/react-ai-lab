import React, { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import { profileSectionsData } from "../config/profileSectionsData.tsx";

const ProfilePage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string>("profile");

    const currentSection = profileSectionsData.find(
        (section) => section.key === activeSection
    );

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-800/0 text-neutral-900 dark:text-neutral-100">
            {/* 左侧导航 */}
            <aside className="w-64 border-r border-neutral-200 dark:border-gray-700 p-6">
                <h2 className="text-sm font-medium text-neutral-500 uppercase mb-2">Settings</h2>
                <nav className="space-y-1 text-sm">
                    {profileSectionsData.map((section) => (
                        <a
                            href={`#${section.key}`}
                            key={section.key}
                            className={`block px-3 py-2 rounded-md border-l-4 ${
                                activeSection === section.key
                                    ? "bg-neutral-100 dark:bg-gray-600 border-blue-500 font-medium"
                                    : "hover:bg-neutral-100 dark:hover:bg-gray-600 border-transparent"
                            }`}
                            onClick={() => setActiveSection(section.key)}
                        >
                            {section.label}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* 右侧内容 */}
            <main className="flex-1 p-8 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-6 border-b border-neutral-200 dark:border-gray-700 pb-4">
                    {currentSection?.title}
                </h1>

                <Card title={currentSection?.title || ""} className="max-w-2xl mb-8">
                    {currentSection?.fields ? (
                        <div className="flex flex-col space-y-6">
                            {currentSection.fields.map((field) => (
                                <div key={field.name} className="flex flex-col">
                                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                                    {field.type === "textarea" ? (
                                        <textarea
                                            placeholder={field.placeholder}
                                            className="w-full p-2 border border-neutral-300 dark:border-neutral-700 dark:bg-gray-800 dark:text-white rounded"
                                        />
                                    ) : (
                                        <Input placeholder={field.placeholder} className="w-full" type={field.type || "text"} />
                                    )}
                                </div>
                            ))}

                            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                                <Button variant="primary" size="medium">Save</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-neutral-600 dark:text-neutral-400">{currentSection?.description}</p>
                    )}
                </Card>
            </main>
        </div>
    );
};

export default ProfilePage;
