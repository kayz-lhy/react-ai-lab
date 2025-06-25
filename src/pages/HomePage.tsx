// src/pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import {
    FiEye,
    FiCpu,
    FiZap,
    FiTarget,
    FiBarChart,
    FiClock,
    FiDatabase,
    FiActivity,
    FiUpload,
    FiSettings,
    FiImage,
    FiArrowRight,
    FiRefreshCw,
    FiAlertCircle,
    FiPlay,
    FiAward,
    FiShield
} from "react-icons/fi";
import { BiChip, BiRocket } from "react-icons/bi";

interface QuickStats {
    total_detections: number;
    total_objects_detected: number;
    recent_detections: number;
    model_usage: {
        [key: string]: {
            count: number;
            avg_processing_time: number;
        };
    };
}

interface ModelInfo {
    loaded: boolean;
    model_name?: string;
    model_type?: 'yolov5' | 'yolov8';
    device?: string;
    class_count?: number;
}

interface RecentRecord {
    record_id: string;
    timestamp: string;
    detection_count: number;
    model_name: string;
    model_type: string;
    processing_time: number;
    metadata: {
        filename: string;
    };
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [quickStats, setQuickStats] = useState<QuickStats | null>(null);
    const [currentModel, setCurrentModel] = useState<ModelInfo | null>(null);
    const [recentRecords, setRecentRecords] = useState<RecentRecord[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchDashboardData();
    }, [token, navigate]);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 并行获取数据
            const [statsResponse, modelsResponse, historyResponse] = await Promise.all([
                fetch("http://127.0.0.1:5000/detection/statistics", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://127.0.0.1:5000/detection/models", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://127.0.0.1:5000/detection/history?page=1&per_page=5", {
                    headers: { Authorization: `Bearer ${token}` },
                })
            ]);

            // 处理统计数据
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                if (statsData.code === 200) {
                    setQuickStats(statsData.data.detection_statistics);
                }
            }

            // 处理模型信息
            if (modelsResponse.ok) {
                const modelsData = await modelsResponse.json();
                if (modelsData.code === 200) {
                    setCurrentModel(modelsData.data.current_model);
                }
            }

            // 处理历史记录
            if (historyResponse.ok) {
                const historyData = await historyResponse.json();
                if (historyData.code === 200) {
                    setRecentRecords(historyData.data.records);
                }
            }

        } catch (error) {
            console.error("获取仪表板数据失败:", error);
            setError("获取数据失败，请稍后重试");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN', {
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

    const QuickActionCard: React.FC<{
        title: string;
        description: string;
        icon: React.ReactNode;
        onClick: () => void;
        gradient: string;
        disabled?: boolean;
    }> = ({ title, description, icon, onClick, gradient, disabled = false }) => (
        <div
            onClick={disabled ? undefined : onClick}
            className={`${gradient} rounded-xl p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    {icon}
                </div>
                <FiArrowRight className="w-5 h-5 opacity-60 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
        </div>
    );

    const StatsCard: React.FC<{
        title: string;
        value: string | number;
        icon: React.ReactNode;
        color: string;
        subtitle?: string;
    }> = ({ title, value, icon, color, subtitle }) => (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto space-y-6 p-6">
            {/* 欢迎横幅 */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">欢迎使用 AI 检测系统</h1>
                            <p className="text-blue-100 text-lg">
                                强大的 YOLOv5/v8 目标检测平台，让 AI 为您识别世界
                            </p>
                            <div className="flex items-center space-x-6 mt-6">
                                <div className="flex items-center space-x-2">
                                    <FiShield className="w-5 h-5" />
                                    <span className="text-sm">高精度检测</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiZap className="w-5 h-5" />
                                    <span className="text-sm">毫秒级响应</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <BiRocket className="w-5 h-5" />
                                    <span className="text-sm">智能分析</span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BiChip className="w-16 h-16 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 装饰性几何图形 */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <FiAlertCircle className="w-5 h-5 text-red-500" />
                        <p className="text-red-700 dark:text-red-300">{error}</p>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={fetchDashboardData}
                            className="ml-auto"
                        >
                            重试
                        </Button>
                    </div>
                </div>
            )}

            {/* 快速操作 */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <FiPlay className="w-5 h-5" />
                    <span>快速操作</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickActionCard
                        title="开始检测"
                        description="上传图片进行AI目标检测"
                        icon={<FiEye className="w-6 h-6" />}
                        onClick={() => navigate('/traffic/detect')}
                        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                    />

                    <QuickActionCard
                        title="模型管理"
                        description="管理和切换YOLO模型"
                        icon={<FiCpu className="w-6 h-6" />}
                        onClick={() => navigate('/traffic/select')}
                        gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                    />

                    <QuickActionCard
                        title="上传权重"
                        description="添加新的模型权重文件"
                        icon={<FiUpload className="w-6 h-6" />}
                        onClick={() => navigate('/traffic/select')}
                        gradient="bg-gradient-to-br from-green-500 to-green-600"
                    />

                    <QuickActionCard
                        title="查看统计"
                        description="分析检测数据和使用情况"
                        icon={<FiBarChart className="w-6 h-6" />}
                        onClick={() => navigate('/traffic/statistics')}
                        gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                    />
                </div>
            </div>

            {/* 统计概览 */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white/90 dark:bg-slate-800/90 rounded-xl p-6 animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
                                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                                </div>
                                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : quickStats ? (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                            <FiBarChart className="w-5 h-5" />
                            <span>使用统计</span>
                        </h2>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={fetchDashboardData}
                            className="bg-white/80 dark:bg-slate-700/80"
                        >
                            <FiRefreshCw className="w-4 h-4 mr-2" />
                            刷新
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatsCard
                            title="总检测次数"
                            value={quickStats.total_detections}
                            icon={<FiEye className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                            color="bg-blue-100 dark:bg-blue-900/30"
                        />

                        <StatsCard
                            title="检测对象总数"
                            value={quickStats.total_objects_detected}
                            icon={<FiTarget className="w-6 h-6 text-green-600 dark:text-green-400" />}
                            color="bg-green-100 dark:bg-green-900/30"
                        />

                        <StatsCard
                            title="最近检测"
                            value={quickStats.recent_detections}
                            icon={<FiActivity className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
                            color="bg-purple-100 dark:bg-purple-900/30"
                            subtitle="过去24小时"
                        />

                        <StatsCard
                            title="活跃模型"
                            value={Object.keys(quickStats.model_usage).length}
                            icon={<FiCpu className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
                            color="bg-orange-100 dark:bg-orange-900/30"
                            subtitle="已使用的模型"
                        />
                    </div>
                </div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 当前模型状态 */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                        <FiCpu className="w-5 h-5" />
                        <span>当前模型</span>
                    </h3>

                    {currentModel && currentModel.loaded ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-800 dark:text-slate-200">
                                        {currentModel.model_name || '未知模型'}
                                    </p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            getModelTypeColor(currentModel.model_type || '')
                                        }`}>
                                            {currentModel.model_type?.toUpperCase() || 'UNKNOWN'}
                                        </span>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            设备: {currentModel.device || 'CPU'}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>

                            {currentModel.class_count && (
                                <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-3">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        支持 <span className="font-semibold text-slate-800 dark:text-slate-200">
                                            {currentModel.class_count}
                                        </span> 种对象类别
                                    </p>
                                </div>
                            )}

                            <Button
                                variant="outline"
                                size="small"
                                onClick={() => navigate('/models')}
                                className="w-full"
                            >
                                <FiSettings className="w-4 h-4 mr-2" />
                                管理模型
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FiCpu className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                当前没有加载的模型
                            </p>
                            <Button
                                variant="default"
                                size="small"
                                onClick={() => navigate('/models')}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            >
                                <FiUpload className="w-4 h-4 mr-2" />
                                加载模型
                            </Button>
                        </div>
                    )}
                </div>

                {/* 最近检测记录 */}
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center space-x-2">
                            <FiClock className="w-5 h-5" />
                            <span>最近检测</span>
                        </h3>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={() => navigate('/statistics')}
                        >
                            查看全部
                        </Button>
                    </div>

                    {recentRecords.length > 0 ? (
                        <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                            {recentRecords.map((record) => (
                                <div
                                    key={record.record_id}
                                    className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-3 border border-slate-200/50 dark:border-slate-600/50 hover:bg-slate-100/80 dark:hover:bg-slate-600/80 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <FiImage className="w-4 h-4 text-slate-500" />
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                                                {record.metadata.filename}
                                            </span>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            getModelTypeColor(record.model_type)
                                        }`}>
                                            {record.model_type?.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                        <span>{formatDate(record.timestamp)}</span>
                                        <span>{record.detection_count} 个对象</span>
                                        <span>{record.processing_time.toFixed(3)}s</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <FiClock className="w-8 h-8 text-slate-400" />
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                暂无检测记录
                            </p>
                            <Button
                                variant="default"
                                size="small"
                                onClick={() => navigate('/detection')}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            >
                                <FiEye className="w-4 h-4 mr-2" />
                                开始检测
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* 功能介绍 */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center space-x-2">
                    <FiAward className="w-5 h-5" />
                    <span>系统特性</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FiZap className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">极速检测</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            采用最新的YOLO算法，毫秒级响应，实时处理各种场景的目标检测任务
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FiTarget className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">高精度识别</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            支持80+种常见对象识别，准确率高达95%，满足各种商业和研究需求
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FiDatabase className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">智能管理</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            自动保存检测历史，智能统计分析，支持多模型切换和权重管理
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
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

export default HomePage;