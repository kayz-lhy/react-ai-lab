// types/alert.d.ts

export interface AlertOptions {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    confirmText?: string;
    showClose?: boolean;
    autoClose?: boolean;
    duration?: number;
}

export interface CustomAlertProps {
    message: string;
    options?: AlertOptions;
    onClose: () => void;
}

export interface AlertState {
    id: string;
    message: string;
    options?: AlertOptions;
    resolve: () => void;
}

// 扩展全局 Window 接口
declare global {
    interface Window {
        alert: ((message: string, options?: AlertOptions) => Promise<void>) & {
            restore: () => void;
        };
    }
}