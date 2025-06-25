// src/pages/ModelSelectionPage.tsx
import React, { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import {
    FiCpu,
    FiDownload,
    FiCheck,
    FiRefreshCw,
    FiInfo,
    FiZap,
    FiAlertCircle,
    FiSettings,
    FiDatabase,
    FiHardDrive,
    FiUpload,
    FiTrash2,
    FiEdit3,
    FiX,
    FiTag,
    FiCalendar,
    FiBarChart,
    FiTrendingUp
} from "react-icons/fi";
import { BiChip } from "react-icons/bi";

interface ModelInfo {
    loaded: boolean;
    weight_id?: string;
    model_name?: string;
    model_type?: 'yolov5' | 'yolov8';
    description?: string;
    device?: string;
    classes?: { [key: string]: string };
    class_count?: number;
}

interface WeightInfo {
    weight_id: string;
    model_name: string;
    model_type: 'yolov5' | 'yolov8';
    description: string;
    file_size: number;
    upload_time: string;
    class_count: number;
    is_active: boolean;
    is_current: boolean;
}

interface WeightStatistics {
    total_weights: number;
    total_size: number;
    model_type_counts: { [key: string]: number };
    recent_uploads: number;
}

interface ModelListResponse {
    code: number;
    msg: string;
    data: {
        available_weights: WeightInfo[];
        current_model: ModelInfo;
        statistics: WeightStatistics;
    };
}

interface LoadModelResponse {
    code: number;
    msg: string;
    data?: {
        model_info: ModelInfo;
    };
}

interface UploadResponse {
    code: number;
    msg: string;
    data?: {
        weight_id: string;
        model_type: string;
        file_size: number;
    };
}

interface ModelType {
    value: 'yolov5' | 'yolov8';
    label: string;
    description: string;
}

const ModelSelectionPage: React.FC = () => {
    const [availableWeights, setAvailableWeights] = useState<WeightInfo[]>([]);
    const [currentModel, setCurrentModel] = useState<ModelInfo | null>(null);
    const [statistics, setStatistics] = useState<WeightStatistics | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [showModelDetails, setShowModelDetails] = useState<boolean>(false);
    const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
    const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
    const [editingWeight, setEditingWeight] = useState<WeightInfo | null>(null);
    const [supportedTypes, setSupportedTypes] = useState<ModelType[]>([]);

    // 上传表单状态
    const [uploadForm, setUploadForm] = useState({
        file: null as File | null,
        model_name: '',
        description: '',
        model_type: '' as 'yolov5' | 'yolov8' | ''
    });

    // 编辑表单状态
    const [editForm, setEditForm] = useState({
        model_name: '',
        description: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            setError("请先登录");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
            return;
        }
        fetchModels();
        fetchSupportedTypes();
    }, [token]);

    // 获取支持的模型类型
    const fetchSupportedTypes = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/detection/model-types", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (data.code === 200) {
                setSupportedTypes(data.data.supported_types);
            }
        } catch (error) {
            console.error("获取模型类型失败:", error);
        }
    };

    const fetchModels = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("http://127.0.0.1:5000/detection/models", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data: ModelListResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `请求失败: ${response.status}`);
            }

            if (data.code !== 200) {
                throw new Error(data.msg || "获取模型列表失败");
            }

            setAvailableWeights(data.data.available_weights);
            setCurrentModel(data.data.current_model);
            setStatistics(data.data.statistics);

        } catch (error) {
            console.error("获取模型列表失败:", error);
            const errorMessage = error instanceof Error ? error.message : "未知错误";
            setError(`获取模型列表失败: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadModel = async (weightId: string) => {
        if (!token) {
            setError("请先登录");
            return;
        }

        setIsLoadingModel(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/detection/models/${weightId}/load`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data: LoadModelResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `请求失败: ${response.status}`);
            }

            if (data.code !== 200) {
                throw new Error(data.msg || "加载模型失败");
            }

            setSuccess(data.msg || "模型加载成功");
            await fetchModels();

        } catch (error) {
            console.error("加载模型失败:", error);
            const errorMessage = error instanceof Error ? error.message : "未知错误";
            setError(`加载模型失败: ${errorMessage}`);
        } finally {
            setIsLoadingModel(false);
        }
    };

    const handleUploadWeights = async () => {
        if (!uploadForm.file || !uploadForm.model_name.trim()) {
            setError("请选择文件并填写模型名称");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('weights_file', uploadForm.file);
            formData.append('model_name', uploadForm.model_name.trim());
            formData.append('description', uploadForm.description.trim());
            if (uploadForm.model_type) {
                formData.append('model_type', uploadForm.model_type);
            }

            const response = await fetch("http://127.0.0.1:5000/detection/weights/upload", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data: UploadResponse = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || `请求失败: ${response.status}`);
            }

            if (data.code !== 200) {
                throw new Error(data.msg || "上传失败");
            }

            setSuccess(data.msg || "权重文件上传成功");
            setShowUploadDialog(false);
            resetUploadForm();
            await fetchModels();

        } catch (error) {
            console.error("上传权重失败:", error);
            const errorMessage = error instanceof Error ? error.message : "未知错误";
            setError(`上传权重失败: ${errorMessage}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteWeight = async (weightId: string) => {
        if (!confirm("确定要删除这个权重文件吗？此操作不可恢复。")) {
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/detection/weights/${weightId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok || data.code !== 200) {
                throw new Error(data.msg || "删除失败");
            }

            setSuccess(data.msg || "权重文件删除成功");
            await fetchModels();

        } catch (error) {
            console.error("删除权重失败:", error);
            const errorMessage = error instanceof Error ? error.message : "未知错误";
            setError(`删除权重失败: ${errorMessage}`);
        }
    };

    const handleEditWeight = async () => {
        if (!editingWeight || !editForm.model_name.trim()) {
            setError("请填写模型名称");
            return;
        }

        try {
            const response = await fetch(
                `http://127.0.0.1:5000/detection/weights/${editingWeight.weight_id}/update`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model_name: editForm.model_name.trim(),
                        description: editForm.description.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || data.code !== 200) {
                throw new Error(data.msg || "更新失败");
            }

            setSuccess(data.msg || "权重信息更新成功");
            setShowEditDialog(false);
            setEditingWeight(null);
            await fetchModels();

        } catch (error) {
            console.error("更新权重信息失败:", error);
            const errorMessage = error instanceof Error ? error.message : "未知错误";
            setError(`更新权重信息失败: ${errorMessage}`);
        }
    };

    const resetUploadForm = () => {
        setUploadForm({
            file: null,
            model_name: '',
            description: '',
            model_type: ''
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const openEditDialog = (weight: WeightInfo) => {
        setEditingWeight(weight);
        setEditForm({
            model_name: weight.model_name,
            description: weight.description
        });
        setShowEditDialog(true);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getModelTypeColor = (type: string) => {
        switch (type) {
            case 'yolov5':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
            case 'yolov8':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="flex-1 overflow-y-auto space-y-6 p-6">
            {/* 页面标题 */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BiChip className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                模型管理
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                管理AI检测模型和权重文件
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="default"
                        onClick={() => setShowUploadDialog(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                        <div className="flex items-center space-x-2">
                            <FiUpload className="w-4 h-4" />
                            <span>上传权重</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* 错误和成功提示 */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-slideUp">
                    <div className="flex items-center space-x-3">
                        <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                                操作失败
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={clearMessages}
                            className="text-red-500 hover:text-red-700 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 animate-slideUp">
                    <div className="flex items-center space-x-3">
                        <FiCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                                操作成功
                            </h4>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                                {success}
                            </p>
                        </div>
                        <button
                            onClick={clearMessages}
                            className="text-emerald-500 hover:text-emerald-700 transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* 统计信息 */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <FiDatabase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">总权重数</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                    {statistics.total_weights}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <FiHardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">总大小</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                    {formatFileSize(statistics.total_size)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <FiBarChart className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">YOLOv5</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                    {statistics.model_type_counts.yolov5 || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                <FiTrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">YOLOv8</p>
                                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                    {statistics.model_type_counts.yolov8 || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 当前模型状态 */}
            {currentModel && currentModel.loaded && (
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl animate-fadeIn">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                                <FiCpu className="w-4 h-4 text-white" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                当前模型状态
                            </h2>
                        </div>
                        <button
                            onClick={() => setShowModelDetails(!showModelDetails)}
                            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                        >
                            <FiInfo className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                            <div className="flex items-center space-x-2 mb-2">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">状态</span>
                            </div>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                已加载
                            </p>
                        </div>

                        <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                            <div className="flex items-center space-x-2 mb-2">
                                <FiTag className="w-3 h-3 text-slate-500" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">模型名称</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200 truncate">
                                {currentModel.model_name || '无'}
                            </p>
                        </div>

                        <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                            <div className="flex items-center space-x-2 mb-2">
                                <BiChip className="w-3 h-3 text-slate-500" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">模型类型</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getModelTypeColor(currentModel.model_type || '')}`}>
                                    {currentModel.model_type?.toUpperCase() || '未知'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                            <div className="flex items-center space-x-2 mb-2">
                                <FiZap className="w-3 h-3 text-slate-500" />
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">设备</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                {currentModel.device || '未知'}
                            </p>
                        </div>
                    </div>

                    {/* 详细信息 */}
                    {showModelDetails && currentModel.classes && (
                        <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-4 border border-blue-200/50 dark:border-slate-600/50 animate-slideUp">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center space-x-2">
                                <FiDatabase className="w-4 h-4" />
                                <span>支持的类别 ({currentModel.class_count})</span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                                {Object.entries(currentModel.classes).map(([id, name]) => (
                                    <div
                                        key={id}
                                        className="bg-white/80 dark:bg-slate-600/80 rounded-lg px-3 py-2 text-xs border border-slate-200/50 dark:border-slate-500/50"
                                    >
                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                            {name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 可用模型列表 */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                            <FiSettings className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                            权重文件管理
                        </h2>
                    </div>
                    <Button
                        variant="default"
                        size="small"
                        onClick={fetchModels}
                        disabled={isLoading}
                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300"
                    >
                        <div className="flex items-center space-x-2">
                            <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            <span>刷新</span>
                        </div>
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
                                正在获取权重列表...
                            </p>
                        </div>
                    </div>
                ) : availableWeights.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <FiDatabase className="w-8 h-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                            没有找到权重文件
                        </p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
                            点击右上角"上传权重"按钮添加模型权重文件
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableWeights.map((weight, index) => {
                            const isCurrentModel = weight.is_current;

                            return (
                                <div
                                    key={weight.weight_id}
                                    className={`relative group bg-slate-50/80 dark:bg-slate-700/80 rounded-xl p-4 border transition-all duration-300 hover:shadow-lg animate-fadeIn ${
                                        isCurrentModel
                                            ? 'border-emerald-300 dark:border-emerald-600 bg-emerald-50/80 dark:bg-emerald-900/30'
                                            : 'border-slate-200/50 dark:border-slate-600/50 hover:border-blue-300 dark:hover:border-blue-600'
                                    }`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* 当前模型标识 */}
                                    {isCurrentModel && (
                                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg">
                                            <FiCheck className="w-3 h-3" />
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {/* 模型名称和类型 */}
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate flex-1 mr-2">
                                                    {weight.model_name}
                                                </h3>
                                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getModelTypeColor(weight.model_type)}`}>
                                                    {weight.model_type.toUpperCase()}
                                                </span>
                                            </div>
                                            {weight.description && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">
                                                    {weight.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* 详细信息 */}
                                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center space-x-1">
                                                <FiHardDrive className="w-3 h-3" />
                                                <span>{formatFileSize(weight.file_size)}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FiDatabase className="w-3 h-3" />
                                                <span>{weight.class_count} 类别</span>
                                            </div>
                                            <div className="flex items-center space-x-1 col-span-2">
                                                <FiCalendar className="w-3 h-3" />
                                                <span>{formatDate(weight.upload_time)}</span>
                                            </div>
                                        </div>

                                        {/* 操作按钮 */}
                                        <div className="flex space-x-2 pt-2">
                                            {isCurrentModel ? (
                                                <div className="flex items-center justify-center space-x-2 py-2 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg flex-1">
                                                    <FiCheck className="w-4 h-4" />
                                                    <span className="text-sm font-medium">当前使用</span>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="default"
                                                    size="small"
                                                    onClick={() => handleLoadModel(weight.weight_id)}
                                                    disabled={isLoadingModel}
                                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transform hover:scale-105 transition-all duration-300"
                                                >
                                                    {isLoadingModel ? (
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                            <span>加载中...</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center space-x-2">
                                                            <FiDownload className="w-4 h-4" />
                                                            <span>加载</span>
                                                        </div>
                                                    )}
                                                </Button>
                                            )}

                                            {/* 编辑和删除按钮 */}
                                            <button
                                                onClick={() => openEditDialog(weight)}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="编辑"
                                            >
                                                <FiEdit3 className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteWeight(weight.weight_id)}
                                                disabled={isCurrentModel}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    isCurrentModel
                                                        ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                                                        : 'text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                                                }`}
                                                title={isCurrentModel ? "当前使用的模型无法删除" : "删除"}
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 上传权重对话框 */}
            {showUploadDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleIn w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                上传权重文件
                            </h3>
                            <button
                                onClick={() => {
                                    setShowUploadDialog(false);
                                    resetUploadForm();
                                }}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* 文件选择 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    权重文件 *
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pt,.pth"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setUploadForm(prev => ({ ...prev, file }));
                                    }}
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    支持 .pt 和 .pth 格式
                                </p>
                            </div>

                            {/* 模型名称 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    模型名称 *
                                </label>
                                <input
                                    type="text"
                                    value={uploadForm.model_name}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, model_name: e.target.value }))}
                                    placeholder="输入模型名称"
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* 模型类型 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    模型类型（可选）
                                </label>
                                <select
                                    value={uploadForm.model_type}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, model_type: e.target.value as 'yolov5' | 'yolov8' | '' }))}
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">自动检测</option>
                                    {supportedTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label} - {type.description}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    留空将自动检测模型类型
                                </p>
                            </div>

                            {/* 描述 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    描述（可选）
                                </label>
                                <textarea
                                    value={uploadForm.description}
                                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="输入模型描述信息"
                                    rows={3}
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* 按钮 */}
                            <div className="flex space-x-3 pt-4">
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        setShowUploadDialog(false);
                                        resetUploadForm();
                                    }}
                                    className="flex-1"
                                    disabled={isUploading}
                                >
                                    取消
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleUploadWeights}
                                    disabled={isUploading || !uploadForm.file || !uploadForm.model_name.trim()}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                                >
                                    {isUploading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>上传中...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <FiUpload className="w-4 h-4" />
                                            <span>上传</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 编辑权重对话框 */}
            {showEditDialog && editingWeight && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleIn w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                编辑权重信息
                            </h3>
                            <button
                                onClick={() => {
                                    setShowEditDialog(false);
                                    setEditingWeight(null);
                                }}
                                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* 模型名称 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    模型名称 *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.model_name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, model_name: e.target.value }))}
                                    placeholder="输入模型名称"
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* 描述 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    描述
                                </label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="输入模型描述信息"
                                    rows={3}
                                    className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                />
                            </div>

                            {/* 按钮 */}
                            <div className="flex space-x-3 pt-4">
                                <Button
                                    variant="default"
                                    onClick={() => {
                                        setShowEditDialog(false);
                                        setEditingWeight(null);
                                    }}
                                    className="flex-1"
                                >
                                    取消
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={handleEditWeight}
                                    disabled={!editForm.model_name.trim()}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                                >
                                    <div className="flex items-center space-x-2">
                                        <FiCheck className="w-4 h-4" />
                                        <span>保存</span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 加载模型时的全屏遮罩 */}
            {isLoadingModel && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleIn">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
                                    正在加载模型...
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    请稍候片刻，模型加载需要一些时间
                                </p>
                            </div>
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

export default ModelSelectionPage;