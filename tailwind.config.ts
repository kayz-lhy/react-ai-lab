/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 或者 'media'，推荐 'class' 方便手动控制
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 这里根据你的项目结构
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
