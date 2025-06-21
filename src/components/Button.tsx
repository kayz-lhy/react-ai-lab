// src/components/Button.tsx
import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /**
     * 按钮显示的内容，可以是文字、图标或其它 React 节点。
     */
    children: ReactNode;

    /**
     * 按钮外观样式：
     * - "primary": 主要按钮，蓝色背景
     * - "default": 默认按钮，浅色背景和边框
     * - "danger": 危险按钮，红色背景
     * - "text": 文字按钮，无边框透明背景
     */
    variant?: "primary" | "default" | "danger" | "text";

    /**
     * 按钮尺寸：
     * - "small": 较小按钮
     * - "medium": 中等大小按钮（默认）
     * - "large": 较大按钮
     */
    size?: "small" | "medium" | "large";
}

const sizeStyles = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
};

const variants = {
    primary:
        "bg-blue-600 text-white border border-transparent hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-400",
    default:
        "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-400",
    danger:
        "bg-red-600 text-white border border-transparent hover:bg-red-700 focus:ring-2 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400",
    text:
        "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 dark:text-blue-400 dark:hover:bg-blue-900 dark:focus:ring-blue-400",
};

const disabledStyles = "opacity-50 cursor-not-allowed";

/**
 * 通用按钮组件，支持四种不同外观以及三种尺寸。
 * 自动适配亮色与暗色模式，支持传入原生按钮属性。
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="large" onClick={() => alert('clicked')}>
 *   确认
 * </Button>
 * ```
 *
 * @param {ReactNode} children - 按钮内部显示的内容，可以是文字、图标或其他节点。
 * @param {"primary"|"default"|"danger"|"text"} [variant="default"] - 按钮外观：
 *   - "primary": 主要按钮（蓝色背景，白色文字）。
 *   - "default": 默认按钮（浅色背景，边框灰色）。
 *   - "danger": 危险按钮（红色背景，白色文字）。
 *   - "text": 文字按钮（无边框透明背景，蓝色文字）。
 * @param {"small"|"medium"|"large"} [size="medium"] - 按钮尺寸：
 *   - "small": 较小按钮，适合紧凑场景。
 *   - "medium": 中等按钮，适合通用场景。
 *   - "large": 大按钮，文字和内边距更大。
 * @param {boolean} [disabled=false] - 是否禁用按钮，禁用时按钮半透明且不可点击。
 * @param {ButtonHTMLAttributes<HTMLButtonElement>} [props] - 其他原生按钮属性，如 onClick、type 等。
 */
const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = "default",
                                           size = "medium",
                                           disabled,
                                           ...props
                                       }) => {
    return (
        <button
            disabled={disabled}
            className={clsx(
                "m-1 rounded transition duration-200 ease-in-out focus:outline-none focus:ring-offset-0",
                sizeStyles[size],
                variants[variant],
                disabled && disabledStyles
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;