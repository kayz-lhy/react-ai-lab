// utils/AlertManager.tsx
// import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import type { AlertOptions } from '../types/alert';
import CustomAlert from '../components/CustomAlert';

// 自定义Alert函数类型
type CustomAlertFunction = ((message: string, options?: AlertOptions) => Promise<void>) & {
    restore: () => void;
};

class AlertManager {
    private static instance: AlertManager;
    private originalAlert: ((message?: never) => void) | null = null;
    private isInitialized = false;

    private constructor() {}

    public static getInstance(): AlertManager {
        if (!AlertManager.instance) {
            AlertManager.instance = new AlertManager();
        }
        return AlertManager.instance;
    }

    /**
     * 初始化自定义Alert系统
     */
    public init(): void {
        if (this.isInitialized) {
            console.warn('AlertManager已经初始化过了');
            return;
        }

        // 保存原始的alert函数
        this.originalAlert = window.alert;

        // 创建自定义alert函数
        const customAlertFn = this.customAlert.bind(this) as CustomAlertFunction;
        customAlertFn.restore = this.restore.bind(this);

        // 覆盖全局alert函数
        window.alert = customAlertFn;

        this.isInitialized = true;
        console.log('自定义Alert系统已初始化');
    }

    /**
     * 自定义alert函数
     */
    private customAlert(message: string, options?: AlertOptions): Promise<void> {
        return new Promise<void>((resolve) => {
            this.showAlert(message, options, resolve);
        });
    }

    /**
     * 显示Alert
     */
    private showAlert(
        message: string,
        options: AlertOptions = {},
        resolve: () => void
    ): void {
        // 创建容器元素
        const container = document.createElement('div');
        container.setAttribute('data-alert-container', 'true');
        document.body.appendChild(container);

        // 创建React根节点
        const root: Root = createRoot(container);

        const handleClose = (): void => {
            try {
                // 卸载React组件
                root.unmount();

                // 移除DOM元素
                if (container.parentNode) {
                    container.parentNode.removeChild(container);
                }

                // 解析Promise
                resolve();
            } catch (error) {
                console.error('关闭Alert时发生错误:', error);
                resolve(); // 即使出错也要解析Promise
            }
        };

        // 渲染自定义Alert组件
        root.render(
            <CustomAlert
                message={message}
                options={options}
                onClose={handleClose}
            />
        );
    }

    /**
     * 恢复原始alert函数
     */
    public restore(): void {
        if (!this.isInitialized) {
            console.warn('AlertManager尚未初始化');
            return;
        }

        if (this.originalAlert) {
            window.alert = this.originalAlert;
            this.originalAlert = null;
        }

        // 清理所有现有的Alert容器
        const containers = document.querySelectorAll('[data-alert-container="true"]');
        containers.forEach(container => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        });

        this.isInitialized = false;
        console.log('已恢复原始Alert系统');
    }

    /**
     * 检查是否已初始化
     */
    public isInit(): boolean {
        return this.isInitialized;
    }

    /**
     * 便捷方法：显示不同类型的Alert
     */
    public info(message: string, options?: Omit<AlertOptions, 'type'>): Promise<void> {
        return this.customAlert(message, { ...options, type: 'info' });
    }

    public success(message: string, options?: Omit<AlertOptions, 'type'>): Promise<void> {
        return this.customAlert(message, { ...options, type: 'success' });
    }

    public warning(message: string, options?: Omit<AlertOptions, 'type'>): Promise<void> {
        return this.customAlert(message, { ...options, type: 'warning' });
    }

    public error(message: string, options?: Omit<AlertOptions, 'type'>): Promise<void> {
        return this.customAlert(message, { ...options, type: 'error' });
    }
}

// 导出单例实例
export default AlertManager.getInstance();