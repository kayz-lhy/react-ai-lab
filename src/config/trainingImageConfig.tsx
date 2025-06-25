// src/config/trainingImageConfig.tsx

export interface ImageConfig {
    filename: string;
    description: string;
}

// 图片文件夹路径
export const IMAGE_FOLDER_PATH = '/train';

// 图片到描述的映射配置
export const imageConfigs: ImageConfig[] = [
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

// 辅助函数：根据文件名获取描述
export const getImageDescription = (filename: string): string => {
    const config = imageConfigs.find(config => config.filename === filename);
    return config?.description || filename; // 如果没有配置，返回文件名
};

// 辅助函数：获取所有配置的图片路径
export const getAllImagePaths = (): string[] => {
    return imageConfigs.map(config => `${IMAGE_FOLDER_PATH}/${config.filename}`);
};

// 辅助函数：获取完整的图片信息
export const getImageWithPath = (filename: string) => {
    const config = imageConfigs.find(config => config.filename === filename);
    if (!config) return null;

    return {
        ...config,
        path: `${IMAGE_FOLDER_PATH}/${filename}`,
        fullPath: `${IMAGE_FOLDER_PATH}/${filename}`
    };
};

// 辅助函数：批量获取所有图片信息
export const getAllImages = () => {
    return imageConfigs.map((config, index) => ({
        id: index + 1,
        ...config,
        path: `${IMAGE_FOLDER_PATH}/${config.filename}`,
        fullPath: `${IMAGE_FOLDER_PATH}/${config.filename}`
    }));
};

