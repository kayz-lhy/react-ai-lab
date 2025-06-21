// 引入各种插件和规则集
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

// 默认导出 ESLint 配置
export default tseslint.config(
    // 全局忽略项
    {
        ignores: ['dist'], // 忽略 dist 目录
    },
    {
        // 继承规则集：包括 ESLint 推荐规则与 TypeScript 推荐规则
        extends: [js.configs.recommended, ...tseslint.configs.recommended],

        // 指定匹配文件类型
        files: ['**/*.{ts,tsx}'],

        // 语言选项
        languageOptions: {
            ecmaVersion: 2020,      // 使用 ECMAScript 2020 语法
            globals: globals.browser, // 全局对象取浏览器环境
        },

        // 启用插件
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
        },

        // 自定义规则
        rules: {
            // React Hooks 推荐规则
            ...reactHooks.configs.recommended.rules,
            // 对只导出组件的限制
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true }, // 允许导出常量
            ],
        },
    },
)