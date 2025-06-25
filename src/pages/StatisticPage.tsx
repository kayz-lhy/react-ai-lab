// src/pages/StatisticsPage.tsx
import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import {
    FiBarChart,
    FiClock,
    FiDatabase,
    FiTrendingUp,
    FiEye,
    FiRefreshCw,
    FiTarget,
    FiZap,
    FiHardDrive,
    FiActivity,
    FiChevronRight,
    FiSearch,
    FiImage,
    FiAlertCircle,
    FiInfo
} from "react-icons/fi";
import { BiChip } from "react-icons/bi";

interface DetectionStatistics {
    total_detections: number;
    total_objects_detected: number;
    model_usage: {
        [key: string]: {
            count: number;
            avg_processing_time: number;
        };
    };
    recent_detections: number;
}

interface WeightStatistics {
    total_weights: number;
    total_size: number;
    model_type_counts: {
        [key: string]: number;
    };
    recent_uploads: number;
}

interface HistoryRecord {
    record_id: string;
    timestamp: string;
    detections: any[];
    detection_count: number;
    model_name: string;
    model_type: string;
    processing_time: number;
    confidence_threshold: number;
    original_image_path: string;
    result_image_path?: string;
    metadata: {
        filename: string;
        file_size: number;
        created_at: string;
    };
}

interface StatisticsResponse {
    code: number;
    msg: string;
    data: {
        detection_statistics: DetectionStatistics;
        weight_statistics: WeightStatistics;
    };
}

interface HistoryResponse {
    code: number;
    msg: string;
    data: {
        records: HistoryRecord[];
        page: number;
        per_page: number;
        has_more: boolean;
    };
}

const StatisticsPage: React.FC = () => {
    const [detectionStats, setDetectionStats] = useState<DetectionStatistics | null>(null);
    const [weightStats, setWeightStats] = useState<WeightStatistics | null>(null);
    const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [perPage] = useState<number>(10);
    const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("请先登录");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
            return;
        }
        fetchStatistics();
        if (activeTab === 'history') {
            fetchHistory(1);
        }
    }, [token, activeTab]);

    const fetchStatistics = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:5000/detection/statistics", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data: StatisticsResponse = await response.json();

            if (!response.ok || data.code !== 200) {
                throw new Error(data.msg || "获取统计信息失败");
            }

            setDetectionStats(data.data.detection_statistics);
            setWeightStats(data.data.weight_statistics);

        } catch (error) {
            console.error("获取统计信息失败:", error);
            const errorMessage = error instanceof Error ? error.message : "未知错误";
            setError(`获取统计信息失败: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = async (page: number) => {
        setIsLoadingHistory(true);
        setError(null);

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/detection/history?page=${page}&per_page=${perPage}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data: HistoryResponse = await response.json();

            if (!response.ok || data.code !== 200) {
                throw new Error(data.msg || "获取历史记录失败");
            }

            if (page === 1) {
                setHistoryRecords(data.data.records);
            } else {
                setHistoryRecords(prev => [...prev, ...data.data.records]);
            }

            setCurrentPage(data.data.page);
            setHasMore(data.data.has_more);

        } catch (error) {
            console.error("获取历史记录失败:", error);
            const errorMessage = error instanceof Error ? error.message : "未知错误";
            setError(`获取历史记录失败: ${errorMessage}`);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleLoadMore = () => {
        if (hasMore && !isLoadingHistory) {
            fetchHistory(currentPage + 1);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getModelTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'yolov5':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'yolov8':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const openDetailModal = (record: HistoryRecord) => {
        setSelectedRecord(record);
        setShowDetailModal(true);
    };

    const StatisticsOverview = () => (
        <div className="space-y-6">
            {/* 检测统计卡片 */}
            {detectionStats && (
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                        <FiBarChart className="w-5 h-5" />
                        <span>检测统计</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium">总检测次数</p>
                                    <p className="text-2xl font-bold">{detectionStats.total_detections}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FiEye className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium">检测对象总数</p>
                                    <p className="text-2xl font-bold">{detectionStats.total_objects_detected}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FiTarget className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium">最近检测</p>
                                    <p className="text-2xl font-bold">{detectionStats.recent_detections}</p>
                                    <p className="text-purple-200 text-xs">过去24小时</p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FiActivity className="w-6 h-6" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-orange-100 text-sm font-medium">平均处理时间</p>
                                    <p className="text-2xl font-bold">
                                        {Object.values(detectionStats.model_usage).length > 0
                                            ? (Object.values(detectionStats.model_usage)
                                                    .reduce((sum, model) => sum + model.avg_processing_time, 0) /
                                                Object.values(detectionStats.model_usage).length).toFixed(3)
                                            : '0.000'}s
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                    <FiZap className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 模型使用情况 */}
                    {Object.keys(detectionStats.model_usage).length > 0 && (
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                                <BiChip className="w-5 h-5" />
                                <span>模型使用情况</span>
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries(detectionStats.model_usage).map(([modelName, usage]) => (
                                    <div
                                        key={modelName}
                                        className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-600/50"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">
                                                {modelName.split(' (')[0]}
                                            </h4>
                                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                                getModelTypeColor(modelName.includes('yolov8') ? 'yolov8' : 'yolov5')
                                            }`}>
                                                {modelName.includes('yolov8') ? 'V8' : 'V5'}
                                            </span>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-600 dark:text-slate-400">使用次数:</span>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                                    {usage.count}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-600 dark:text-slate-400">平均用时:</span>
                                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                                    {usage.avg_processing_time.toFixed(3)}s
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 权重统计 */}
            {weightStats && (
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                        <FiDatabase className="w-5 h-5" />
                        <span>权重文件统计</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <FiDatabase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">总权重数</p>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                        {weightStats.total_weights}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <FiHardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">总大小</p>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                        {formatFileSize(weightStats.total_size)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <BiChip className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">YOLOv5模型</p>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                        {weightStats.model_type_counts.yolov5 || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                    <FiTrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">YOLOv8模型</p>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                        {weightStats.model_type_counts.yolov8 || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const HistoryList = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                    <FiClock className="w-5 h-5" />
                    <span>检测历史记录</span>
                </h2>
                <Button
                    variant="default"
                    size="small"
                    onClick={() => fetchHistory(1)}
                    disabled={isLoadingHistory}
                    className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                >
                    <div className="flex items-center space-x-2">
                        <FiRefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
                        <span>刷新</span>
                    </div>
                </Button>
            </div>

            {isLoadingHistory && historyRecords.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
                            正在加载历史记录...
                        </p>
                    </div>
                </div>
            ) : historyRecords.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <FiClock className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                        暂无检测历史记录
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                        开始使用检测功能后，记录将显示在这里
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {historyRecords.map((record, index) => (
                        <div
                            key={record.record_id}
                            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 animate-fadeIn"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <FiImage className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                            {record.metadata.filename}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            {formatDate(record.timestamp)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getModelTypeColor(record.model_type)}`}>
                                        {record.model_type?.toUpperCase() || 'Unknown'}
                                    </span>
                                    <Button
                                        variant="primary"
                                        size="small"
                                        onClick={() => openDetailModal(record)}
                                        className="text-xs"
                                    >
                                        查看详情
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-3">
                                    <p className="text-slate-600 dark:text-slate-400 text-xs">检测对象</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {record.detection_count} 个
                                    </p>
                                </div>

                                <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-3">
                                    <p className="text-slate-600 dark:text-slate-400 text-xs">处理时间</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {record.processing_time.toFixed(3)}s
                                    </p>
                                </div>

                                <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-3">
                                    <p className="text-slate-600 dark:text-slate-400 text-xs">置信度阈值</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {(record.confidence_threshold * 100).toFixed(1)}%
                                    </p>
                                </div>

                                <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-3">
                                    <p className="text-slate-600 dark:text-slate-400 text-xs">模型</p>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {record.model_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* 加载更多按钮 */}
                    {hasMore && (
                        <div className="text-center pt-6">
                            <Button
                                variant="primary"
                                onClick={handleLoadMore}
                                disabled={isLoadingHistory}
                                className="bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                {isLoadingHistory ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                                        <span>加载中...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <FiChevronRight className="w-4 h-4" />
                                        <span>加载更多</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto space-y-6 p-6">
            {/* 页面标题 */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FiBarChart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                统计与历史
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                查看检测统计信息和历史记录
                            </p>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            variant={activeTab === 'overview' ? 'default' : 'primary'}
                            size="small"
                            onClick={() => setActiveTab('overview')}
                            className={activeTab === 'overview'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-white/80 dark:bg-slate-700/80'
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <FiBarChart className="w-4 h-4" />
                                <span>统计概览</span>
                            </div>
                        </Button>

                        <Button
                            variant={'default' }
                            size="small"
                            onClick={() => setActiveTab('history')}
                            className={activeTab === 'history'
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-white/80 dark:bg-slate-700/80'
                            }
                        >
                            <div className="flex items-center space-x-2">
                                <FiClock className="w-4 h-4" />
                                <span>历史记录</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-slideUp">
                    <div className="flex items-center space-x-3">
                        <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                                错误
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* 主要内容 */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
                            正在加载统计信息...
                        </p>
                    </div>
                </div>
            ) : (
                <>
                    {activeTab === 'overview' && <StatisticsOverview />}
                    {activeTab === 'history' && <HistoryList />}
                </>
            )}

            {/* 详情模态框 */}
            {showDetailModal && selectedRecord && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleIn w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <FiInfo className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                        检测详情
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {selectedRecord.metadata.filename}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* 基本信息 */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                                        <FiInfo className="w-4 h-4" />
                                        <span>基本信息</span>
                                    </h4>

                                    <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">文件名:</span>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {selectedRecord.metadata.filename}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">检测时间:</span>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {formatDate(selectedRecord.timestamp)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">文件大小:</span>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {formatFileSize(selectedRecord.metadata.file_size)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">使用模型:</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                    {selectedRecord.model_name}
                                                </span>
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getModelTypeColor(selectedRecord.model_type)}`}>
                                                    {selectedRecord.model_type?.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">处理时间:</span>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {selectedRecord.processing_time.toFixed(3)}s
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">置信度阈值:</span>
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                                {(selectedRecord.confidence_threshold * 100).toFixed(1)}%
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">检测对象数:</span>
                                            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                {selectedRecord.detection_count} 个
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* 检测结果 */}
                                <div className="space-y-4">
                                    <h4 className="text-md font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                                        <FiTarget className="w-4 h-4" />
                                        <span>检测结果</span>
                                    </h4>

                                    {selectedRecord.detections && selectedRecord.detections.length > 0 ? (
                                        <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-4 max-h-80 overflow-y-auto custom-scrollbar">
                                            <div className="space-y-3">
                                                {selectedRecord.detections.map((detection, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-white/80 dark:bg-slate-600/80 rounded-lg p-3 border border-slate-200/50 dark:border-slate-500/50"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                                                                {detection.class_name || detection.name || '未知'}
                                                            </span>
                                                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                                                                {((detection.confidence || 0) * 100).toFixed(1)}%
                                                            </span>
                                                        </div>

                                                        {detection.bbox && (
                                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                                位置: [{detection.bbox.join(', ')}]
                                                            </div>
                                                        )}

                                                        {detection.class_id !== undefined && (
                                                            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                                                类别ID: {detection.class_id}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-8 text-center">
                                            <FiSearch className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                未检测到任何对象
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 dark:border-slate-700">
                            <Button
                                variant="primary"
                                onClick={() => setShowDetailModal(false)}
                                className="bg-white/80 dark:bg-slate-700/80"
                            >
                                关闭
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0); 
                    }
                }
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.8); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                }
                
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
                .animate-slideUp { animation: slideUp 0.6s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.4s ease-out; }

                /* 滚动条样式 */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(148, 163, 184, 0.5);
                    border-radius: 3px;
                    transition: background 0.2s;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.8);
                }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(71, 85, 105, 0.6);
                }
                
                .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(71, 85, 105, 0.9);
                }
            `}</style>
        </div>
    );
};

export default StatisticsPage;