// src/config/menu.ts
import { FaHome, FaInfoCircle, FaBoxOpen, FaUsers, FaCogs } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

export interface MenuItem {
    key: string;
    label: string;
    path: string;
    icon?: React.ReactNode;
    description?: string;
    children?: MenuItem[];
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
        key: "/about",
        label: "关于我们",
        path: "/about",
        icon: <FaInfoCircle className="text-xl" />,
        description: "了解更多关于我们的信息和团队。",
    },
    {
        key: "/products",
        label: "产品",
        path: "/products",
        icon: <MdCategory className="text-xl" />,
        description: "浏览我们的产品目录，了解更多产品信息。",
        children: [
            { key: "/products/a", label: "产品 A", path: "/products/a", icon: <FaBoxOpen className="text-lg" /> },
            { key: "/products/b", label: "产品 B", path: "/products/b", icon: <FaBoxOpen className="text-lg" /> },
            { key: "/products/c", label: "产品 C", path: "/products/c", icon: <FaBoxOpen className="text-lg" /> },
        ],
    },
    {
        key: "/users",
        label: "用户管理",
        path: "/users",
        icon: <FaUsers className="text-xl" />,
        description: "管理用户信息和权限。",
        children: [
            { key: "/users/list", label: "用户列表", path: "/users/list", icon: <FaUsers className="text-lg" /> },
            { key: "/users/profile", label: "用户资料", path: "/users/profile", icon: <FaUsers className="text-lg" /> },
        ],
    },
    {
        key: "/settings",
        label: "系统设置",
        path: "/settings",
        icon: <FaCogs className="text-xl" />,
        description: "配置系统参数和偏好设置。",
        children: [
            { key: "/settings/account", label: "账户设置", path: "/settings/account", icon: <FaCogs className="text-lg" /> },
            { key: "/settings/preferences", label: "偏好设置", path: "/settings/preferences", icon: <FaCogs className="text-lg" /> },
        ],
    },
];