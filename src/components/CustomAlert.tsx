    // components/CustomAlert.tsx
    import React, { useState, useEffect, useCallback } from 'react';
    import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
    import type {CustomAlertProps} from '../types/alert';

    const CustomAlert: React.FC<CustomAlertProps> = ({ message, options = {}, onClose }) => {
        const [isVisible, setIsVisible] = useState<boolean>(false);
        const [isClosing, setIsClosing] = useState<boolean>(false);

        const {
            type = 'info',
            title,
            confirmText = '确定',
            showClose = true,
            autoClose = false,
            duration = 5000
        } = options;

        useEffect(() => {
            // 组件挂载后显示动画
            const timer = setTimeout(() => setIsVisible(true), 10);
            return () => clearTimeout(timer);
        }, []);

        useEffect(() => {
            if (autoClose && duration > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);
                return () => clearTimeout(timer);
            }
        }, [autoClose, duration]);

        const handleClose = useCallback(() => {
            if (isClosing) return;

            setIsClosing(true);
            setIsVisible(false);

            // 等待动画完成后执行回调
            setTimeout(() => {
                onClose();
            }, 300);
        }, [isClosing, onClose]);

        const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) {
                handleClose();
            }
        }, [handleClose]);

        const handleKeyDown = useCallback((e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
            if (e.key === 'Enter') {
                handleClose();
            }
        }, [handleClose]);

        useEffect(() => {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }, [handleKeyDown]);

        // 类型样式配置
        const typeStyles = {
            info: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-900',
                icon: <Info className="w-6 h-6 text-blue-500" />,
                button: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
            },
            success: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-900',
                icon: <CheckCircle className="w-6 h-6 text-green-500" />,
                button: 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
            },
            warning: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                text: 'text-yellow-900',
                icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
                button: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500'
            },
            error: {
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-900',
                icon: <XCircle className="w-6 h-6 text-red-500" />,
                button: 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
            }
        };

        const currentStyle = typeStyles[type];

        return (
            <div
                className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
                    isVisible ? 'bg-black/50' : 'bg-transparent'
                }`}
                onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="alert-title"
                aria-describedby="alert-message"
            >
                <div
                    className={`${currentStyle.bg} ${currentStyle.border} border rounded-lg shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 ${
                        isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
                >
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            {currentStyle.icon}
                        </div>

                        <div className="flex-1 min-w-0">
                            {title && (
                                <h3
                                    id="alert-title"
                                    className={`text-lg font-semibold ${currentStyle.text} mb-2`}
                                >
                                    {title}
                                </h3>
                            )}
                            <p
                                id="alert-message"
                                className={`${currentStyle.text} whitespace-pre-wrap break-words`}
                            >
                                {message}
                            </p>
                        </div>

                        {showClose && (
                            <button
                                onClick={handleClose}
                                className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="关闭"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleClose}
                            className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentStyle.button}`}
                            autoFocus
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    export default CustomAlert;