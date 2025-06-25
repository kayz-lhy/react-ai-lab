// src/components/Card.tsx
import React, { type ReactNode } from "react";

export interface CardProps {
    /**
     * 卡片头部内容，可以是字符串或者自定义 React 节点。
     * 优先显示 header。
     */
    header?: ReactNode;
    /**
     * 卡片标题（当 header 没有传时显示）。
     */
    title?: string;
    /**
     * 卡片主体内容。
     */
    children: ReactNode;
    /**
     * 卡片底部内容，可以放置操作按钮、描述等。
     */
    footer?: ReactNode;
    /**
     * 自定义类名，用于添加额外样式。
     */
    className?: string;
}

/**
 * 卡片组件
 *
 * 三段式布局：头部、主体、底部。
 * 使用 surface 和 text 颜色，自动适配暗色与亮色模式。
 *
 * @example
 * <Card title="我的卡片">
 *   <p>这是卡片内容</p>
 * </Card>
 */
const Card: React.FC<CardProps> = ({
                                       header,
                                       title,
                                       children,
                                       footer,
                                       className = "",
                                   }) => {
    return (
        <div
            className={`
        bg-surface dark:bg-surface-dark
        rounded-lg
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md transition-shadow
        overflow-hidden
        ${className}    
      `}
        >
            {(header || title) && (
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    {header ? (
                        <div className="text-lg font-semibold text-text dark:text-text-dark">
                            {header}
                        </div>
                    ) : (
                        <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                            {title}
                        </h3>
                    )}
                </div>
            )}

            <div className="px-4 py-4 text-text dark:text-text-dark">
                {children}
            </div>

            {footer && (
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 text-sm text-subtle dark:text-subtleDark">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;
