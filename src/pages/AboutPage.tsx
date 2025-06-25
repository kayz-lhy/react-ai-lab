// src/pages/AboutPage.tsx
import React, { useState } from "react";
import Button from "../components/Button";
import {
    FiInfo,
    FiCode,
    FiZap,
    FiShield,
    FiTarget,
    FiCpu,
    FiDatabase,
    FiCloud,
    FiGlobe,
    FiHeart,
    FiUsers,
    FiAward,
    FiTrendingUp,
    FiBook,
    FiMail,
    FiGithub,
    FiLinkedin,
    FiTwitter,
    FiStar,
    FiMonitor
} from "react-icons/fi";
import { BiChip, BiRocket, BiBrain, BiData } from "react-icons/bi";

interface SystemInfo {
    version: string;
    build_date: string;
    environment: string;
    uptime?: string;
}

const AboutPage: React.FC = () => {
    const [systemInfo] = useState<SystemInfo>({
        version: "2.0.0",
        build_date: "2025-06-25",
        environment: "Production"
    });

    const techStack = [
        {
            category: "前端技术",
            icon: <FiCode className="w-6 h-6" />,
            color: "from-blue-500 to-cyan-500",
            technologies: [
                { name: "React 18", description: "现代化的用户界面框架", version: "18.2.0" },
                { name: "TypeScript", description: "类型安全的JavaScript", version: "5.0+" },
                { name: "Tailwind CSS", description: "原子化CSS框架", version: "3.4+" },
                { name: "Vite", description: "快速的构建工具", version: "5.0+" }
            ]
        },
        {
            category: "后端技术",
            icon: <FiDatabase className="w-6 h-6" />,
            color: "from-green-500 to-emerald-500",
            technologies: [
                { name: "Flask", description: "轻量级Python Web框架", version: "2.3+" },
                { name: "MongoDB", description: "NoSQL文档数据库", version: "6.0+" },
                { name: "PostgreSQL", description: "关系型数据库", version: "14+" },
                { name: "Redis", description: "内存数据库", version: "7.0+" }
            ]
        },
        {
            category: "AI技术",
            icon: <BiBrain className="w-6 h-6" />,
            color: "from-purple-500 to-pink-500",
            technologies: [
                { name: "YOLOv5", description: "实时目标检测算法", version: "7.0+" },
                { name: "YOLOv8", description: "最新的YOLO算法", version: "8.0+" },
                { name: "PyTorch", description: "深度学习框架", version: "2.0+" },
                { name: "OpenCV", description: "计算机视觉库", version: "4.8+" }
            ]
        },
        {
            category: "基础设施",
            icon: <FiCloud className="w-6 h-6" />,
            color: "from-orange-500 to-red-500",
            technologies: [
                { name: "Docker", description: "容器化部署", version: "24.0+" },
                { name: "NGINX", description: "高性能Web服务器", version: "1.24+" },
                { name: "GridFS", description: "大文件存储系统", version: "6.0+" },
                { name: "JWT", description: "安全认证机制", version: "2.8+" }
            ]
        }
    ];

    const features = [
        {
            icon: <FiZap className="w-8 h-8" />,
            title: "极速检测",
            description: "采用最新的YOLO算法，毫秒级响应时间，实时处理图像检测任务",
            color: "from-yellow-400 to-orange-500"
        },
        {
            icon: <FiTarget className="w-8 h-8" />,
            title: "高精度识别",
            description: "支持80+种常见对象识别，准确率高达95%，满足各种应用场景",
            color: "from-green-400 to-blue-500"
        },
        {
            icon: <FiShield className="w-8 h-8" />,
            title: "安全可靠",
            description: "企业级安全防护，数据加密传输，完善的权限管理机制",
            color: "from-purple-400 to-pink-500"
        },
        {
            icon: <BiData className="w-8 h-8" />,
            title: "智能分析",
            description: "自动生成检测报告，数据可视化展示，深度分析使用趋势",
            color: "from-blue-400 to-indigo-500"
        },
        {
            icon: <FiCpu className="w-8 h-8" />,
            title: "多模型支持",
            description: "支持YOLOv5和YOLOv8模型切换，自定义权重文件管理",
            color: "from-indigo-400 to-purple-500"
        },
        {
            icon: <FiGlobe className="w-8 h-8" />,
            title: "跨平台兼容",
            description: "支持Web、移动端访问，响应式设计，随时随地使用",
            color: "from-teal-400 to-cyan-500"
        }
    ];

    const teamMembers = [
        {
            name: "张三",
            role: "项目负责人",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
            description: "10年AI算法经验，深度学习专家",
            social: {
                github: "https://github.com",
                linkedin: "https://linkedin.com",
                email: "zhang@example.com"
            }
        },
        {
            name: "李四",
            role: "前端架构师",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            description: "React生态专家，用户体验设计师",
            social: {
                github: "https://github.com",
                twitter: "https://twitter.com",
                email: "li@example.com"
            }
        },
        {
            name: "王五",
            role: "后端工程师",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
            description: "分布式系统专家，性能优化达人",
            social: {
                github: "https://github.com",
                linkedin: "https://linkedin.com",
                email: "wang@example.com"
            }
        }
    ];

    const stats = [
        { label: "累计检测次数", value: "10,000+", icon: <FiTarget className="w-6 h-6" /> },
        { label: "支持对象类别", value: "80+", icon: <BiChip className="w-6 h-6" /> },
        { label: "平均响应时间", value: "<200ms", icon: <FiZap className="w-6 h-6" /> },
        { label: "用户满意度", value: "98%", icon: <FiStar className="w-6 h-6" /> }
    ];

    const TechStackCard: React.FC<{
        category: string;
        icon: React.ReactNode;
        color: string;
        technologies: Array<{ name: string; description: string; version: string }>;
    }> = ({ category, icon, color, technologies }) => (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">{category}</h3>
            </div>

            <div className="space-y-3">
                {technologies.map((tech, index) => (
                    <div key={index} className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-3 border border-slate-200/50 dark:border-slate-600/50">
                        <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{tech.name}</span>
                            <span className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                                {tech.version}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{tech.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const FeatureCard: React.FC<{
        icon: React.ReactNode;
        title: string;
        description: string;
        color: string;
    }> = ({ icon, title, description, color }) => (
        <div className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className={`w-16 h-16 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
        </div>
    );

    const TeamMemberCard: React.FC<{
        member: typeof teamMembers[0];
    }> = ({ member }) => (
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
            <div className="relative mb-4">
                <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto border-4 border-white dark:border-slate-700 shadow-lg group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">{member.name}</h3>
            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">{member.role}</p>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{member.description}</p>

            <div className="flex justify-center space-x-3">
                {member.social.github && (
                    <a href={member.social.github} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        <FiGithub className="w-4 h-4" />
                    </a>
                )}
                {member.social.linkedin && (
                    <a href={member.social.linkedin} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        <FiLinkedin className="w-4 h-4" />
                    </a>
                )}
                {member.social.twitter && (
                    <a href={member.social.twitter} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        <FiTwitter className="w-4 h-4" />
                    </a>
                )}
                {member.social.email && (
                    <a href={`mailto:${member.social.email}`} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                        <FiMail className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex-1 overflow-y-auto space-y-8 p-6">
            {/* 页面标题 */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <FiInfo className="w-6 h-6" />
                                </div>
                                <h1 className="text-3xl font-bold">关于我们</h1>
                            </div>
                            <p className="text-indigo-100 text-lg max-w-2xl leading-relaxed">
                                我们致力于打造最先进的AI目标检测平台，让人工智能技术更好地服务于现实世界的各种应用场景。
                                通过不断创新和优化，为用户提供高效、准确、易用的AI解决方案。
                            </p>
                        </div>

                        <div className="hidden lg:block">
                            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <BiRocket className="w-16 h-16 text-white/80" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 装饰性元素 */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full"></div>
                <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>

            {/* 系统信息 */}
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <FiMonitor className="w-5 h-5" />
                    <span>系统信息</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-4 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">版本号</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{systemInfo.version}</p>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-4 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">构建日期</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{systemInfo.build_date}</p>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-4 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">运行环境</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{systemInfo.environment}</p>
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-700/80 rounded-lg p-4 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">状态</p>
                        <div className="flex items-center justify-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">正常运行</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 数据统计 */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <FiTrendingUp className="w-5 h-5" />
                    <span>系统数据</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200 mt-1">{stat.value}</p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 核心特性 */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <FiAward className="w-5 h-5" />
                    <span>核心特性</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            color={feature.color}
                        />
                    ))}
                </div>
            </div>

            {/* 技术栈 */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <FiCode className="w-5 h-5" />
                    <span>技术栈</span>
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {techStack.map((stack, index) => (
                        <TechStackCard
                            key={index}
                            category={stack.category}
                            icon={stack.icon}
                            color={stack.color}
                            technologies={stack.technologies}
                        />
                    ))}
                </div>
            </div>

            {/* 团队介绍 */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center space-x-2">
                    <FiUsers className="w-5 h-5" />
                    <span>团队成员</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard key={index} member={member} />
                    ))}
                </div>
            </div>

            {/* 联系我们 */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-8 border border-blue-200/50 dark:border-slate-600/50">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <FiHeart className="w-8 h-8" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">联系我们</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                        如果您有任何问题、建议或合作意向，欢迎随时与我们取得联系。我们期待与您一起探索AI技术的无限可能。
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="primary" className="bg-gradient-to-r from-blue-500 to-indigo-600">
                            <FiMail className="w-4 h-4 mr-2" />
                            发送邮件
                        </Button>

                        <Button variant="outline">
                            <FiGithub className="w-4 h-4 mr-2" />
                            GitHub
                        </Button>

                        <Button variant="outline">
                            <FiBook className="w-4 h-4 mr-2" />
                            文档
                        </Button>
                    </div>
                </div>
            </div>

            {/* 页脚信息 */}
            <div className="text-center py-8 border-t border-slate-200/50 dark:border-slate-700/50">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                    © 2025 AI检测系统. 版权所有.
                    <span className="mx-2">|</span>
                    基于先进的深度学习技术构建
                    <span className="mx-2">|</span>
                    <span className="inline-flex items-center">
                        Made with <FiHeart className="w-3 h-3 mx-1 text-red-500" /> by Our Team
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AboutPage;