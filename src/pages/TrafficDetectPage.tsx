// src/pages/TrafficDetectPage.tsx
import React, {useState, useRef, useCallback} from "react";
import Button from "../components/Button";
import {FiDownload, FiCamera, FiBarChart, FiZap, FiAlertCircle} from "react-icons/fi";
import {BiImageAdd} from "react-icons/bi";

interface DetectionResult {
    [className: string]: {
        count: number;
        items: {
            box: number[];
            confidence: number;
            class: string;
        }[];
    };
}

interface DetectionItem {
    box: number[];
    confidence: number;
    class: string;
}

// 后端API响应格式
interface APIResponse {
    code: number;
    msg: string;
    data: {
        image: string;
        detections: DetectionResult;
        processing_time?: number;
        detection_count?: number;
    };
}

const TrafficDetectPage: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
    const [resultImageUrl, setResultImageUrl] = useState<string>("");
    const [detections, setDetections] = useState<DetectionResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 从 localStorage 中取出 token
    const token = localStorage.getItem("token");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!token) {
            alert("请先登录");
            setTimeout(() => {
                window.location.href = "/login"; // 重定向到登录页面
            }, 1000);
            return;
        }
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        // 验证文件类型
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError("请选择有效的图片文件 (JPG, PNG, BMP, TIFF, WebP)");
            return;
        }

        // 验证文件大小 (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("图片文件大小不能超过10MB");
            return;
        }

        setImageFile(file);
        setOriginalImageUrl(URL.createObjectURL(file));
        setResultImageUrl("");
        setDetections(null);
        setShowResults(false);
        setError(null);
        setProcessingTime(null);
    };

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    }, []);

    const handleDetect = async () => {
        if (!imageFile) {
            setError("请先选择一张图片");
            return;
        }

        if (!token) {
            setError("请先登录");
            return;
        }

        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("confidence", "0.25"); // 默认置信度
        formData.append("save_result", "true");

        try {
            const resb = await fetch(
                "http://127.0.0.1:5000/detection/models/best.pt/load",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                }
            )
            const res = await fetch(
                "http://127.0.0.1:5000/detection/detect",
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data: APIResponse = await res.json();

            if (!res.ok) {
                throw new Error(data.msg || `请求失败: ${res.status} ${res.statusText}`);
            }

            // 检查后端返回的状态码
            if (data.code !== 200) {
                throw new Error(data.msg || "检测失败");
            }

            // 设置结果数据
            setResultImageUrl(`data:image/jpeg;base64,${data.data.image}`);
            setDetections(data.data.detections);
            setProcessingTime(data.data.processing_time || null);

            // 延迟显示结果以创建动画效果
            setTimeout(() => {
                setShowResults(true);
            }, 300);

        } catch (error) {
            console.error("检测错误:", error);
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            setError(`识别过程中出错: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setShowResults(false);
        setError(null);
        setTimeout(() => {
            setImageFile(null);
            setOriginalImageUrl("");
            setResultImageUrl("");
            setDetections(null);
            setProcessingTime(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }, 200);
    };

    const handleDownload = () => {
        if (resultImageUrl) {
            const link = document.createElement('a');
            link.href = resultImageUrl;
            link.download = `detection_result_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const openImagePreview = (url: string, title: string) => {
        setPreviewImage({url, title});
    };

    const closeImagePreview = () => {
        setPreviewImage(null);
    };

    const handlePreviewClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeImagePreview();
        }
    };

    const getTotalDetections = () => {
        if (!detections) return 0;
        return Object.values(detections).reduce((total, {count}) => total + count, 0);
    };

    const getConfidenceColor = (confidence: number) => {
        if (confidence >= 0.8) return "text-emerald-600 dark:text-emerald-400";
        if (confidence >= 0.6) return "text-amber-600 dark:text-amber-400";
        return "text-rose-600 dark:text-rose-400";
    };

    const getConfidenceBg = (confidence: number) => {
        if (confidence >= 0.8) return "bg-emerald-100 dark:bg-emerald-900/30";
        if (confidence >= 0.6) return "bg-amber-100 dark:bg-amber-900/30";
        return "bg-rose-100 dark:bg-rose-900/30";
    };

    return (
        <div className="flex-1 overflow-y-auto space-y-4 p-4">
            {/* 错误提示 */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-slideUp">
                    <div className="flex items-center space-x-3">
                        <FiAlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-red-800 dark:text-red-200">
                                操作失败
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                {error}
                            </p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* 上传区域 */}
            <div
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]">
                <div
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
                        dragActive
                            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[1.02] shadow-lg"
                            : "border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50/50 dark:hover:bg-slate-700/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {!originalImageUrl ? (
                        <div className="text-center space-y-3">
                            <div
                                className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center transform hover:rotate-6 transition-transform duration-300 shadow-lg">
                                <BiImageAdd className="w-6 h-6 text-white animate-pulse"/>
                            </div>
                            <div>
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                                    拖拽图片到此处或点击选择
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    支持 JPG、PNG、BMP、TIFF、WebP，最大10MB
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-2 animate-fadeIn">
                            <div
                                className="flex items-center justify-center space-x-2 text-emerald-600 dark:text-emerald-400">
                                <FiCamera className="w-4 h-4 animate-bounce"/>
                                <span className="font-medium text-sm">已选择: {imageFile?.name}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {imageFile ? (imageFile.size / 1024 / 1024).toFixed(2) : 0}MB
                            </p>
                        </div>
                    )}

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/bmp,image/tiff,image/webp"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    <Button
                        variant="default"
                        size="medium"
                        onClick={handleDetect}
                        disabled={!imageFile || isLoading}
                        className="text-white min-w-[100px] bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>识别中</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <FiZap className="w-4 h-4"/>
                                <span>开始识别</span>
                            </div>
                        )}
                    </Button>

                    {originalImageUrl && (
                        <Button
                            variant="danger"
                            size="medium"
                            onClick={handleReset}
                            className="min-w-[80px] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            重置
                        </Button>
                    )}

                    {resultImageUrl && (
                        <Button
                            variant="danger"
                            size="medium"
                            onClick={handleDownload}
                            className="min-w-[80px] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg animate-fadeIn"
                        >
                            下载
                        </Button>
                    )}
                </div>
            </div>

            {/* 图片对比展示 */}
            {(originalImageUrl || resultImageUrl) && (
                <div
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-500 animate-slideUp">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {originalImageUrl && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        原始图片
                                    </h4>
                                </div>
                                <div
                                    className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
                                    onClick={() => openImagePreview(originalImageUrl, "原始图片")}>
                                    <img
                                        src={originalImageUrl}
                                        alt="原始图片"
                                        className="w-full h-48 object-cover bg-slate-50 dark:bg-slate-900 transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div
                                            className="bg-white/90 dark:bg-slate-800/90 rounded-full p-3 shadow-lg backdrop-blur-sm">
                                            <FiCamera className="w-6 h-6 text-slate-700 dark:text-slate-300"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {resultImageUrl && (
                            <div
                                className={`space-y-2 transition-all duration-700 ${showResults ? 'animate-slideInRight' : 'opacity-0 translate-x-4'}`}>
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        检测结果
                                        {processingTime && (
                                            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                                                ({processingTime.toFixed(2)}s)
                                            </span>
                                        )}
                                    </h4>
                                </div>
                                <div
                                    className="relative group overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-600 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
                                    onClick={() => openImagePreview(resultImageUrl, "检测结果")}>
                                    <img
                                        src={resultImageUrl}
                                        alt="检测结果"
                                        className="w-full h-48 object-cover bg-slate-50 dark:bg-slate-900 transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div
                                        className="absolute top-2 right-2 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-bounce">
                                        完成
                                    </div>
                                    <div
                                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div
                                            className="bg-white/90 dark:bg-slate-800/90 rounded-full p-3 shadow-lg backdrop-blur-sm">
                                            <FiBarChart className="w-6 h-6 text-emerald-600 dark:text-emerald-400"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {detections && (
                <div
                    className={`overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50 shadow-xl transition-all duration-700 ${showResults ? 'animate-slideUp' : 'opacity-0 translate-y-4'}`}>
                    <div className="flex items-center space-x-3 mb-3">
                        <div
                            className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                            <FiBarChart className="w-4 h-4 text-white"/>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                检测统计
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                共检测到 <span className="font-bold text-emerald-600">{getTotalDetections()}</span> 个目标
                                {processingTime && (
                                    <span className="ml-2">
                                        • 耗时 <span className="font-bold text-blue-600">{processingTime.toFixed(2)}</span>秒
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* 主滚动区域 - 使用自定义滚动条样式 */}
                    <div className="custom-scrollbar space-y-3 max-h-80 overflow-y-auto pr-2">
                        {Object.entries(detections).map(([cls, {count, items}], index) => (
                            <div
                                key={cls}
                                className="bg-slate-50/80 dark:bg-slate-700/80 rounded-xl p-3 border border-slate-200/50 dark:border-slate-600/50 hover:shadow-md transition-shadow duration-300 animate-fadeIn"
                                style={{animationDelay: `${index * 100}ms`}}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate">
                                        {cls}
                                    </h4>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                            <span
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold">
                                {count}
                            </span>
                                    </div>
                                </div>

                                {/* 内层滚动区域 - 也使用自定义滚动条 */}
                                <div className="custom-scrollbar-small space-y-1 max-h-32 overflow-y-auto pr-1">
                                    {items.map((item: DetectionItem, i: number) => (
                                        <div
                                            key={i}
                                            className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-2 text-xs border border-slate-200/50 dark:border-slate-600/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200"
                                        >
                                            <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-600 dark:text-slate-400 flex-shrink-0">
                                        #{i + 1}
                                    </span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ml-2 ${getConfidenceBg(item.confidence)} ${getConfidenceColor(item.confidence)}`}>
                                        {(item.confidence * 100).toFixed(1)}%
                                    </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 图片预览模态窗口 */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fadeIn p-4"
                    onClick={handlePreviewClick}
                >
                    <div className="relative max-w-7xl max-h-full animate-scaleIn">
                        {/* 关闭按钮 */}
                        <button
                            onClick={closeImagePreview}
                            className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full p-2 text-white transition-all duration-300 hover:scale-110 z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>

                        {/* 标题 */}
                        <div className="absolute -top-12 left-0 text-white font-semibold text-lg">
                            {previewImage.title}
                        </div>

                        {/* 图片容器 */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/10">
                            <img
                                src={previewImage.url}
                                alt={previewImage.title}
                                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* 操作按钮 */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
                            {previewImage.url === resultImageUrl && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDownload();
                                    }}
                                    className="bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg"
                                >
                                    <FiDownload className="w-4 h-4"/>
                                    <span>下载图片</span>
                                </button>
                            )}

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const link = document.createElement('a');
                                    link.href = previewImage.url;
                                    link.target = '_blank';
                                    link.click();
                                }}
                                className="bg-blue-500/90 hover:bg-blue-600 backdrop-blur-sm text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 flex items-center space-x-2 shadow-lg"
                            >
                                <FiCamera className="w-4 h-4"/>
                                <span>新窗口打开</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 加载状态遮罩 */}
            {isLoading && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div
                        className="bg-white/95 dark:bg-slate-800/95 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleIn">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div
                                    className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
                                <div
                                    className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
                                    AI正在分析图片...
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    请稍候片刻
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
                
                @keyframes slideInRight {
                    from { 
                        opacity: 0; 
                        transform: translateX(20px); 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateX(0); 
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
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
                .animate-slideUp { animation: slideUp 0.6s ease-out; }
                .animate-slideInRight { animation: slideInRight 0.6s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
                .animate-shimmer { 
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
                   /* 主滚动条样式 */
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
    
    /* 暗色模式下的滚动条 */
    .dark .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(71, 85, 105, 0.6);
    }
    
    .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(71, 85, 105, 0.9);
    }
    
    /* 小滚动条样式 */
    .custom-scrollbar-small::-webkit-scrollbar {
        width: 4px;
    }
    
    .custom-scrollbar-small::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 2px;
    }
    
    .custom-scrollbar-small::-webkit-scrollbar-thumb {
        background: rgba(148, 163, 184, 0.4);
        border-radius: 2px;
        transition: background 0.2s;
    }
    
    .custom-scrollbar-small::-webkit-scrollbar-thumb:hover {
        background: rgba(148, 163, 184, 0.7);
    }
    
    .dark .custom-scrollbar-small::-webkit-scrollbar-thumb {
        background: rgba(71, 85, 105, 0.5);
    }
    
    .dark .custom-scrollbar-small::-webkit-scrollbar-thumb:hover {
        background: rgba(71, 85, 105, 0.8);
    }
    
    /* Firefox 支持 */
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(148, 163, 184, 0.5) transparent;
    }
    
    .custom-scrollbar-small {
        scrollbar-width: thin;
        scrollbar-color: rgba(148, 163, 184, 0.4) transparent;
    }
            `}</style>
        </div>
    );
};

export default TrafficDetectPage;