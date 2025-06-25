// src/config/menu.ts
import { FaHome, FaInfoCircle, FaUsers, FaCogs, FaChartBar, FaRobot } from "react-icons/fa";
import { MdCategory, MdLogin, MdLogout } from "react-icons/md";
import { BiTrafficCone } from "react-icons/bi";

export interface MenuItem {
    key: string;
    label: string;
    path: string;
    icon?: React.ReactNode;
    description?: string;
    children?: MenuItem[];
    notDisplay?: boolean; // 新增字段：是否不显示在侧边栏
    requireAuth?: boolean; // 是否需要登录
    roles?: string[]; // 允许访问的角色
}

export const menuConfig: MenuItem[] = [
    {
        key: "/",
        label: "首页",
        path: "/",
        icon: <FaHome className="text-xl" />,
        description: "欢迎来到首页，这里是应用的起点。",
    },
    {
        key: "/login",
        label: "登录",
        path: "/login",
        icon: <MdLogin className="text-xl" />,
        description: "用户登录页面",
        notDisplay: true, // 不在侧边栏显示
    },
    {
        key: "/about",
        label: "关于我们",
        path: "/about",
        icon: <FaInfoCircle className="text-xl" />,
        description: "关于我们",
    },
    {
        key: "/traffic",
        label: "AI模型",
        path: "/traffic",
        icon: <BiTrafficCone className="text-xl" />,
        requireAuth: true,
        children: [
            {
                key: "/traffic/select",
                label: "模型选择",
                path: "/traffic/select",
                icon: <FaRobot className="text-lg" />,
                description: "模型选择",
                requireAuth: true,
                roles: ["admin", "trainer"]
            },
            {
                key: "/traffic/detect",
                label: "图像检测",
                path: "/traffic/detect",
                icon: <MdCategory className="text-lg" />,
                description: "图像智能识别",
                requireAuth: true
            },
            {
                key: "/traffic/statistics",
                label: "数据统计",
                path: "/traffic/statistics",
                icon: <FaChartBar className="text-lg" />,
                description: "检测数据统计分析",
                requireAuth: true
            },
            {
                key: "/traffic/progress",
                label: "训练过程",
                path: "/traffic/progress",
                icon: <FaChartBar className="text-lg" />,
                description: "训练过程可视化",
                requireAuth: true
            },
        ],
    },
    {
        key: "/users",
        label: "用户管理",
        path: "/users",
        icon: <FaUsers className="text-xl" />,
        description: "管理用户信息和权限。",
        requireAuth: true,
        roles: ["admin"],
        children: [
            {
                key: "/users/list",
                label: "用户列表",
                path: "/users/list",
                icon: <FaUsers className="text-lg" />,
                description: "查看和管理所有用户",
                requireAuth: true,
                roles: ["admin"]
            },
            {
                key: "/users/profile",
                label: "用户资料",
                path: "/users/profile",
                icon: <FaUsers className="text-lg" />,
                description: "编辑用户个人资料",
                requireAuth: true,
                roles: ["admin"]
            },
        ],
    },
    {
        key: "/profile",
        label: "个人设置",
        path: "/profile",
        icon: <FaCogs className="text-xl" />,
        description: "个人账户设置和偏好配置。",
        requireAuth: true,
    },
    {
        key: "/logout",
        label: "退出登录",
        path: "/logout",
        icon: <MdLogout className="text-xl" />,
        description: "安全退出系统",
        notDisplay: true, // 不在侧边栏显示，通过其他方式处理
        requireAuth: true,
    }
];