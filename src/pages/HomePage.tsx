import React, { useEffect, useState } from "react";

interface TestRecord {
    id: number;
    inputName: string;
    resultSummary: string;
    timestamp: string;
}

const HomePage: React.FC = () => {
    const [testRecords, setTestRecords] = useState<TestRecord[]>([]);

    // 假设从 localStorage 读取历史记录
    useEffect(() => {
        const saved = localStorage.getItem("testRecords");
        if (saved) {
            setTestRecords(JSON.parse(saved));
        }
    }, []);

    // 统计示例
    const totalTests = testRecords.length;
    const recentTests = testRecords.slice(-5).reverse();

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                计算机视觉模型测试平台
            </h1>

            {/* 统计信息 */}
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="rounded bg-white p-4 text-center shadow dark:bg-gray-800">
                    <div className="text-4xl font-semibold">{totalTests}</div>
                    <div className="text-gray-600 dark:text-gray-400">测试总次数</div>
                </div>
                <div className="rounded bg-white p-4 text-center shadow dark:bg-gray-800">
                    {/* 这里可根据具体数据计算成功率 */}
                    <div className="text-4xl font-semibold">--%</div>
                    <div className="text-gray-600 dark:text-gray-400">成功率</div>
                </div>
                <div className="rounded bg-white p-4 text-center shadow dark:bg-gray-800">
                    <div className="text-4xl font-semibold">--</div>
                    <div className="text-gray-600 dark:text-gray-400">模型类别数</div>
                </div>
            </section>

            {/* 最近测试记录 */}
            <section>
                <h2 className="mb-4 text-xl font-semibold">最近测试记录</h2>
                <div className="max-h-64 overflow-auto rounded bg-white p-4 shadow dark:bg-gray-800">
                    {recentTests.length === 0 && (
                        <div className="text-gray-500 dark:text-gray-400">暂无测试记录</div>
                    )}
                    <ul>
                        {recentTests.map(({ id, inputName, resultSummary, timestamp }) => (
                            <li
                                key={id}
                                className="border-b border-gray-200 py-2 last:border-none dark:border-gray-700"
                            >
                                <div className="flex justify-between">
                                    <div>{inputName}</div>
                                    <div className="text-sm text-gray-400">{timestamp}</div>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {resultSummary}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* 快捷入口示例 */}
            <section>
                <h2 className="mb-4 text-xl font-semibold">操作入口</h2>
                <div className="space-x-4">
                    <a
                        href="/test-input"
                        className="inline-block rounded bg-blue-600 px-6 py-2 text-white shadow hover:bg-blue-700"
                    >
                        新建测试
                    </a>
                    <a
                        href="/history"
                        className="inline-block rounded bg-gray-300 px-6 py-2 text-gray-900 shadow hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                    >
                        查看历史
                    </a>
                </div>
            </section>
        </div>
    );
};

export default HomePage;