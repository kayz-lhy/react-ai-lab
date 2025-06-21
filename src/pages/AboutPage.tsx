import React from "react";

const AboutPage: React.FC = () => {
    return (
        <div className="p-6 space-y-4">
            <h1 className="mb-2 text-2xl font-semibold">关于我们</h1>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                欢迎来到我们的网站！这里是关于我们的简要介绍页面。
            </p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                我们专注于为客户提供优质服务和创新解决方案。通过持续努力与合作，我们致力于创造更美好的未来。
            </p>
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                如果您对我们的服务感兴趣，欢迎随时与我们联系，期待与您的合作！
            </p>
        </div>
    );
};

export default AboutPage;