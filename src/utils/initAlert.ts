// utils/initAlert.ts
import AlertManager from './AlertManager';

/**
 * 初始化自定义Alert系统
 * 应该在应用启动时调用一次
 */
export const initCustomAlert = (): void => {
    try {
        AlertManager.init();
    } catch (error) {
        console.error('初始化自定义Alert系统失败:', error);
    }
};

/**
 * 恢复原始Alert系统
 */
export const restoreOriginalAlert = (): void => {
    try {
        AlertManager.restore();
    } catch (error) {
        console.error('恢复原始Alert系统失败:', error);
    }
};

/**
 * 检查Alert系统是否已初始化
 */
export const isAlertInitialized = (): boolean => {
    return AlertManager.isInit();
};

// 便捷的Alert方法
export const alertUtils = {
    info: AlertManager.info.bind(AlertManager),
    success: AlertManager.success.bind(AlertManager),
    warning: AlertManager.warning.bind(AlertManager),
    error: AlertManager.error.bind(AlertManager)
};

// 默认导出
export default {
    init: initCustomAlert,
    restore: restoreOriginalAlert,
    isInitialized: isAlertInitialized,
    utils: alertUtils
};