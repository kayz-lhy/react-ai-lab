// src/components/Card.tsx
import React, { type ReactNode } from "react";

export interface CardProps {
    /**
     * 卡片头部内容，可以是字符串或者自定义 React 节点。
     * 如果传入字符串，会作为标题显示，优先于 title 属性。
     */
    header?: ReactNode;
    /**
     * 兼容旧属性，作为简单标题使用，
     * 如果 header 存在，则忽略 title。
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
 * 三段式 Card 组件
 *
 * 支持头部、主体和底部三个区域，满足不同布局需求。
 * 适配深色模式与浅色模式，带圆角、阴影和边框。
 *
 * ### 使用示例
 * ```tsx
 * <Card
 *   header={<div className="text-xl font-bold">标题区域</div>}
 *   footer={<div className="text-sm text-gray-500">底部说明</div>}
 * >
 *   <p>主体内容区域</p>
 * </Card>
 *
 * <Card title="简单标题">
 *   <p>只传标题和主体内容</p>
 * </Card>
 * ```
 */
const Card: React.FC<CardProps> = ({
                                       header,
                                       title,
                                       children,
                                       footer,
                                       className = "",
                                   }) => {
    const renderHeader = () => {
        if (header) return <div className="mb-4">{header}</div>;
        if (title) return (
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {title}
            </h3>
        );
        return null;
    };

    const renderFooter = () => {
        if (!footer) return null;
        return (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
                {footer}
            </div>
        );
    };

    return (
        <div
            className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
      rounded-lg shadow p-4 ${className}`}
        >
            {renderHeader()}
            <div className="text-gray-700 dark:text-gray-300">{children}</div>
            {renderFooter()}
        </div>
    );
};

export default Card;