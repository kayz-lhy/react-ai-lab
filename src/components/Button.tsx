import React, { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "default" | "danger" | "text" | "outline";
    size?: "small" | "medium" | "large";
}

const sizeStyles = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
};

const variantColors = {
    primary: {
        base: "bg-blue-600 text-white border border-transparent",
        hover: "hover:bg-blue-700",
        focus: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        disabled: "disabled:bg-blue-400 disabled:cursor-not-allowed",
    },
    default: {
        base: "bg-white text-gray-800 border border-gray-300 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600",
        hover: "hover:bg-gray-100 dark:hover:bg-slate-600",
        focus: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800",
        disabled: "disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-500",
    },
    outline: {
        base: "bg-transparent text-gray-700 border border-gray-300 dark:text-slate-300 dark:border-slate-600",
        hover: "hover:bg-gray-50 hover:border-gray-400 dark:hover:bg-slate-700 dark:hover:border-slate-500",
        focus: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800",
        disabled: "disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed dark:disabled:text-slate-500 dark:disabled:border-slate-700",
    },
    danger: {
        base: "bg-red-600 text-white border border-transparent",
        hover: "hover:bg-red-700",
        focus: "focus:ring-2 focus:ring-red-500 focus:ring-offset-1",
        disabled: "disabled:bg-red-400 disabled:cursor-not-allowed",
    },
    text: {
        base: "bg-transparent text-blue-600 border border-transparent dark:text-blue-400",
        hover: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
        focus: "focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-slate-800",
        disabled: "disabled:text-blue-400 disabled:cursor-not-allowed dark:disabled:text-blue-600",
    },
};

const Button: React.FC<ButtonProps> = ({
                                           children,
                                           variant = "default",
                                           size = "medium",
                                           className = "",
                                           disabled = false,
                                           ...props
                                       }) => {
    const colors = variantColors[variant];

    return (
        <button
            type="button"
            disabled={disabled}
            className={clsx(
                // 基础样式
                "rounded-lg font-medium shadow-sm transition-all duration-200 focus:outline-none",
                "inline-flex items-center justify-center",
                "transform active:scale-95",
                // 尺寸样式
                sizeStyles[size],
                // 颜色和状态样式
                colors.base,
                !disabled && colors.hover,
                !disabled && colors.focus,
                colors.disabled,
                // 自定义类名
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;