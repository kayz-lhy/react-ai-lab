// Input.tsx
import React, { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /**
     * 是否显示错误状态。
     * 当为 true 时，输入框边框和聚焦效果为红色。
     * @default false
     */
    error?: boolean;
    /**
     * 图标元素，比如 <FaSearch />。
     * 当传入该属性时，输入框内部会显示该图标。
     */
    icon?: ReactNode;
    /**
     * 图标的额外类名，比如调整颜色、大小。
     */
    iconClassName?: string;
    /**
     * 包裹输入框外层容器的额外类。
     * 你可以通过它自定义外部容器，比如设置宽度。
     */
    wrapperClassName?: string;
    /**
     * 输入框本身的额外类。
     * 当需要自定义输入框内部的间距、字体大小时使用。
     */
    className?: string;
}

/**
 * Input 输入框组件
 *
 * 这是一个通用输入框组件，封装原生 `<input>`，增加以下功能：
 * - 支持显示前置图标
 * - 错误态红色边框和聚焦态
 * - 适配浅色与深色模式
 * - 继承所有原生输入框属性（如 value、onChange、placeholder 等）
 *
 * ### 使用示例
 * ```tsx
 * import Input from "./Input";
 * import { FaSearch } from "react-icons/fa";
 *
 * export default function SearchBar() {
 *   return (
 *     <Input
 *       placeholder="请输入关键字"
 *       icon={<FaSearch />}
 *       onChange={(e) => console.log(e.target.value)}
 *     />
 *   );
 * }
 * ```
 *
 * @param {InputProps} props - 输入框属性
 * @returns {JSX.Element} 一个可交互、可定制的输入框组件
 */
export const Input: React.FC<InputProps> = ({
                                         error = false,
                                         icon,
                                         iconClassName = "",
                                         wrapperClassName = "",
                                         className = "",
                                         ...props
                                     }) => {
    return (
        <div className={`relative w-full ${wrapperClassName}`}>
            {icon && (
                <span
                    className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500 ${iconClassName}`}
                >
          {icon}
        </span>
            )}

            <input
                className={[
                    "w-full border rounded",
                    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition",
                    "bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500",
                    error
                        ? "border-red-500 focus:ring-red-400 focus:border-red-500"
                        : "border-gray-300",
                    icon ? "pl-9" : "pl-3",
                    "pr-3 py-2",
                    className,
                ].join(" ")}
                {...props}
            />
        </div>
    );
};

export default Input;