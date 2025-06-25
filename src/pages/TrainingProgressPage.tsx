import React, { useState, useEffect } from 'react';

// 内联配置 - 图片到描述的映射
interface ImageConfig {
    filename: string;
    description: string;
}

const IMAGE_FOLDER_PATH = '/train';

const imageConfigs: ImageConfig[] = [
    {
        filename: 'confusion_matrix.png',
        description: '混淆矩阵 - 模型预测结果分析'
    },
    {
        filename: 'F1_curve.png',
        description: 'F1分数曲线 - 精确率与召回率的调和平均'
    },
    {
        filename: 'labels.jpg',
        description: '标签分布图 - 数据集标签统计'
    },
    {
        filename: 'labels_correlogram.jpg',
        description: '标签相关性图 - 标签间关联分析'
    },
    {
        filename: 'P_curve.png',
        description: '精确率曲线 - Precision随阈值变化'
    },
    {
        filename: 'PR_curve.png',
        description: 'PR曲线 - 精确率召回率关系'
    },
    {
        filename: 'R_curve.png',
        description: '召回率曲线 - Recall随阈值变化'
    },
    {
        filename: 'results.png',
        description: '训练结果汇总 - 整体性能指标'
    },
];

interface ImageData extends ImageConfig {
    id: number;
    path: string;
    fullPath: string;
    imageExists: boolean;
}

// 获取所有图片信息
const getAllImages = () => {
    return imageConfigs.map((config, index) => ({
        id: index + 1,
        ...config,
        path: `${IMAGE_FOLDER_PATH}/${config.filename}`,
        fullPath: `${IMAGE_FOLDER_PATH}/${config.filename}`
    }));
};

const TrainingProgressPage = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewMode, setViewMode] = useState('grid');
    const [playbackSpeed, setPlaybackSpeed] = useState(1000);
    const [trainingData, setTrainingData] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 检查图片是否存在
    const checkImageExists = async (imagePath: string): Promise<boolean> => {
        try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    };

    // 加载图片数据
    const loadImages = async () => {
        try {
            setLoading(true);
            setError(null);

            // 获取所有配置的图片
            const allImages = getAllImages();

            // 检查每张图片是否存在
            const imageDataWithStatus = await Promise.all(
                allImages.map(async (image) => {
                    const imageExists = await checkImageExists(image.path);
                    return {
                        ...image,
                        imageExists
                    };
                })
            );

            setTrainingData(imageDataWithStatus);
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载图片失败');
            setLoading(false);
        }
    };

    // 刷新数据
    const refreshData = () => {
        loadImages();
    };

    // 组件加载时读取图片
    useEffect(() => {
        loadImages();
    }, []);

    // 自动播放功能
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && trainingData.length > 0) {
            interval = setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % trainingData.length);
            }, playbackSpeed);
        }
        return () => clearInterval(interval);
    }, [isPlaying, trainingData.length, playbackSpeed]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleStop = () => {
        setIsPlaying(false);
        setCurrentIndex(0);
    };

    const handleDownload = (imageUrl: string, filename: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const currentItem = trainingData[currentIndex];
    const existingImages = trainingData.filter(item => item.imageExists);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">正在加载训练图片...</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                        从文件夹: {IMAGE_FOLDER_PATH}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">加载失败</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
                    <button
                        onClick={refreshData}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200"
                    >
                        重试
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 页面标题 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                训练过程可视化
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                从文件夹 <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm">{IMAGE_FOLDER_PATH}</code> 读取训练图片
                            </p>
                        </div>
                        <button
                            onClick={refreshData}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200"
                        >
                            <span>🔄</span>
                            <span>刷新图片</span>
                        </button>
                    </div>
                </div>

                {/* 数据统计 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-blue-500 text-2xl">📁</span>
                            <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">配置图片数</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white">{imageConfigs.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-500 text-2xl">✅</span>
                            <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">可用图片</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white">{existingImages.length}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-red-500 text-2xl">❌</span>
                            <div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">缺失图片</div>
                                <div className="text-xl font-bold text-slate-900 dark:text-white">
                                    {trainingData.length - existingImages.length}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 控制面板 */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        {/* 播放控制 */}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handlePlayPause}
                                disabled={trainingData.length === 0}
                                className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    isPlaying
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-green-500 hover:bg-green-600 text-white'
                                }`}
                            >
                                <span className="text-xl">{isPlaying ? '⏸️' : '▶️'}</span>
                            </button>
                            <button
                                onClick={handleStop}
                                disabled={trainingData.length === 0}
                                className="flex items-center justify-center w-12 h-12 bg-slate-500 hover:bg-slate-600 text-white rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="text-xl">⏹️</span>
                            </button>

                            <div className="flex items-center space-x-2">
                                <label className="text-sm text-slate-600 dark:text-slate-400">速度:</label>
                                <select
                                    value={playbackSpeed}
                                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                                    className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
                                >
                                    <option value={2000}>0.5x</option>
                                    <option value={1000}>1x</option>
                                    <option value={500}>2x</option>
                                    <option value={250}>4x</option>
                                </select>
                            </div>
                        </div>

                        {/* 视图模式 */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    viewMode === 'grid'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                                title="网格视图"
                            >
                                <span className="text-xl">⚏</span>
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    viewMode === 'list'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                                title="列表视图"
                            >
                                <span className="text-xl">☰</span>
                            </button>
                            <button
                                onClick={() => setViewMode('fullscreen')}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    viewMode === 'fullscreen'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                                }`}
                                title="全屏视图"
                            >
                                <span className="text-xl">⛶</span>
                            </button>
                        </div>
                    </div>

                    {/* 进度条 */}
                    {trainingData.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    进度: {currentIndex + 1} / {trainingData.length}
                                </span>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {currentItem && currentItem.filename}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${((currentIndex + 1) / trainingData.length) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 主要内容区域 */}
                {trainingData.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
                        <div className="text-slate-400 text-6xl mb-4">📁</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            没有配置图片
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            请在配置文件中添加图片到描述的映射
                        </p>
                    </div>
                ) : viewMode === 'fullscreen' ? (
                    /* 全屏模式 */
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                        {currentItem && (
                            <div className="text-center">
                                <div className="relative inline-block bg-slate-100 dark:bg-slate-700 rounded-lg p-4" style={{ minHeight: '500px', minWidth: '600px' }}>
                                    <img
                                        src={currentItem.path}
                                        alt={currentItem.description}
                                        className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg mx-auto block"
                                        style={{
                                            maxWidth: '100%',
                                            height: 'auto'
                                        }}
                                        onLoad={(e) => {
                                            // 图片加载完成后调整容器
                                            const container = e.currentTarget.parentElement;
                                            if (container) {
                                                container.style.minHeight = 'auto';
                                                container.style.minWidth = 'auto';
                                            }
                                        }}
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="%23f1f5f9"/><text x="400" y="280" font-family="Arial" font-size="20" fill="%23475569" text-anchor="middle">图片不存在</text><text x="400" y="320" font-family="Arial" font-size="16" fill="%2364748b" text-anchor="middle">${encodeURIComponent(currentItem.filename)}</text></svg>`;
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 space-x-2">
                                        {!currentItem.imageExists && (
                                            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                                                图片不存在
                                            </span>
                                        )}
                                        <button
                                            onClick={() => handleDownload(currentItem.path, currentItem.filename)}
                                            className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-all duration-200"
                                            disabled={!currentItem.imageExists}
                                            title="下载图片"
                                        >
                                            <span className="text-xl">⬇️</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        {currentItem.description}
                                    </h3>
                                    <div className="text-sm text-slate-600 dark:text-slate-400">
                                        文件名: {currentItem.filename}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : viewMode === 'list' ? (
                    /* 列表模式 */
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                        <div className="divide-y divide-slate-200 dark:divide-slate-700">
                            {trainingData.map((item, index) => (
                                <div
                                    key={item.id}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`p-4 cursor-pointer transition-all duration-200 ${
                                        index === currentIndex
                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="relative flex-shrink-0">
                                            <div className="w-16 h-16 bg-slate-200 dark:bg-slate-600 rounded overflow-hidden">
                                                <img
                                                    src={item.path}
                                                    alt={item.description}
                                                    className="w-full h-full object-cover"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23f1f5f9"/><text x="32" y="36" font-family="Arial" font-size="10" fill="%23475569" text-anchor="middle">No Image</text></svg>`;
                                                    }}
                                                />
                                            </div>
                                            {!item.imageExists && (
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-900 dark:text-white">
                                                {item.description}
                                            </h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {item.filename}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {item.imageExists ? (
                                                <span className="text-green-500 text-sm">✓ 可用</span>
                                            ) : (
                                                <span className="text-red-500 text-sm">✗ 缺失</span>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(item.path, item.filename);
                                                }}
                                                disabled={!item.imageExists}
                                                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="下载图片"
                                            >
                                                <span>⬇️</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* 网格模式 */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* 当前图片显示 */}
                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                        当前显示
                                    </h2>
                                    {currentItem && (
                                        <div className="flex items-center space-x-2">
                                            {!currentItem.imageExists && (
                                                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                                                    图片不存在
                                                </span>
                                            )}
                                            <button
                                                onClick={() => handleDownload(currentItem.path, currentItem.filename)}
                                                disabled={!currentItem.imageExists}
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <span>⬇️</span>
                                                <span>下载</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {currentItem ? (
                                    <div>
                                        <div className="relative w-full bg-slate-100 dark:bg-slate-700 rounded-lg mb-4" style={{ minHeight: '400px' }}>
                                            <img
                                                src={currentItem.path}
                                                alt={currentItem.description}
                                                className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-md mx-auto block"
                                                style={{
                                                    maxWidth: '100%',
                                                    height: 'auto'
                                                }}
                                                onLoad={(e) => {
                                                    // 图片加载完成后移除最小高度限制
                                                    const container = e.currentTarget.parentElement;
                                                    if (container) {
                                                        container.style.minHeight = 'auto';
                                                    }
                                                }}
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    const container = target.parentElement;
                                                    if (container) {
                                                        container.style.minHeight = '400px';
                                                    }
                                                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400"><rect width="800" height="400" fill="%23f1f5f9"/><text x="400" y="180" font-family="Arial" font-size="20" fill="%23475569" text-anchor="middle">图片不存在</text><text x="400" y="220" font-family="Arial" font-size="16" fill="%2364748b" text-anchor="middle">${encodeURIComponent(currentItem.filename)}</text></svg>`;
                                                }}
                                            />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                            {currentItem.description}
                                        </h3>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            文件名: {currentItem.filename}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                                        暂无数据
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 图片列表 */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    图片列表 ({trainingData.length})
                                </h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {trainingData.map((item, index) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                                index === currentIndex
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                                    : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="relative flex-shrink-0">
                                                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-600 rounded overflow-hidden">
                                                        <img
                                                            src={item.path}
                                                            alt={item.description}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23f1f5f9"/><text x="24" y="28" font-family="Arial" font-size="8" fill="%23475569" text-anchor="middle">No Img</text></svg>`;
                                                            }}
                                                        />
                                                    </div>
                                                    {!item.imageExists && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                        {item.filename}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainingProgressPage;