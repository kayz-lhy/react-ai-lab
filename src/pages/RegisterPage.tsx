// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import { FiUser, FiLock, FiEye, FiEyeOff, FiUserPlus, FiMail } from "react-icons/fi";

interface RegisterForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage: React.FC = () => {
    const [formData, setFormData] = useState<RegisterForm>({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<RegisterForm>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // 清除对应字段的错误
        if (errors[name as keyof RegisterForm]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterForm> = {};

        if (!formData.username.trim()) {
            newErrors.username = "请输入用户名";
        } else if (formData.username.length < 3) {
            newErrors.username = "用户名至少需要3个字符";
        }

        if (!formData.email.trim()) {
            newErrors.email = "请输入邮箱地址";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "请输入有效的邮箱地址";
        }

        if (!formData.password) {
            newErrors.password = "请输入密码";
        } else if (formData.password.length < 6) {
            newErrors.password = "密码至少需要6个字符";
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "请确认密码";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "两次输入的密码不一致";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:5000/auth/register", {
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            if (response.data.code === 201) {
                alert("注册成功！请前往登录页面登录。");
                // 跳转到登录页面
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            } else {
                alert(response.data.message || "注册失败");
            }
        } catch (error) {
            console.error("注册错误:", error);

            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.message || "网络请求失败";
                alert(`注册失败: ${message}`);
            } else {
                alert("注册过程中发生未知错误");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* 背景装饰 */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl transition-all duration-500 hover:shadow-3xl">
                    {/* 头部 */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
                            <FiUserPlus className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                            创建账户
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            填写信息以创建您的新账户
                        </p>
                    </div>

                    {/* 注册表单 */}
                    <form onSubmit={handleRegister} className="space-y-6">
                        {/* 用户名输入 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                用户名
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiUser className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent ${
                                        errors.username
                                            ? "border-red-300 dark:border-red-600"
                                            : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                                    }`}
                                    placeholder="请输入用户名"
                                />
                            </div>
                            {errors.username && (
                                <p className="text-xs text-red-500 animate-fadeIn">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* 邮箱输入 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                邮箱地址
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiMail className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-700/50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent ${
                                        errors.email
                                            ? "border-red-300 dark:border-red-600"
                                            : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                                    }`}
                                    placeholder="请输入邮箱地址"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 animate-fadeIn">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* 密码输入 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                密码
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-slate-50/50 dark:bg-slate-700/50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent ${
                                        errors.password
                                            ? "border-red-300 dark:border-red-600"
                                            : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                                    }`}
                                    placeholder="请输入密码（至少6位）"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="w-5 h-5" />
                                    ) : (
                                        <FiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 animate-fadeIn">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* 确认密码输入 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                确认密码
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLock className="w-5 h-5 text-slate-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-slate-50/50 dark:bg-slate-700/50 border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent ${
                                        errors.confirmPassword
                                            ? "border-red-300 dark:border-red-600"
                                            : "border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500"
                                    }`}
                                    placeholder="请再次输入密码"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200"
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff className="w-5 h-5" />
                                    ) : (
                                        <FiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500 animate-fadeIn">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* 注册按钮 */}
                        <Button
                            type="submit"
                            variant="default"
                            size="large"
                            disabled={isLoading}
                            className="w-full text-white bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>注册中...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center space-x-2">
                                    <FiUserPlus className="w-5 h-5" />
                                    <span>立即注册</span>
                                </div>
                            )}
                        </Button>
                    </form>

                    {/* 底部链接 */}
                    <div className="mt-6 text-center space-y-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            已有账户？
                            <Link
                                to="/login"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium ml-1 transition-colors duration-200"
                            >
                                立即登录
                            </Link>
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            注册即表示您同意我们的
                            <button className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium ml-1 transition-colors duration-200">
                                服务条款
                            </button>
                            和
                            <button className="text-slate-600 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-medium ml-1 transition-colors duration-200">
                                隐私政策
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* 加载状态遮罩 */}
            {isLoading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
                    <div className="bg-white/95 dark:bg-slate-800/95 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-scaleIn">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-800 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
                            </div>
                            <div className="text-center">
                                <p className="text-base font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
                                    正在注册...
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    请稍候片刻
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes scaleIn {
                    from { 
                        opacity: 0; 
                        transform: scale(0.8); 
                    }
                    to { 
                        opacity: 1; 
                        transform: scale(1); 
                    }
                }
                
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                .animate-scaleIn { animation: scaleIn 0.4s ease-out; }
            `}</style>
        </div>
    );
};

export default RegisterPage;