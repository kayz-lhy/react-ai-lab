/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 或者 'media'，推荐 'class' 方便手动控制
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 根据项目实际路径调整
    './src/styles/theme.css',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#ffffff",    // bg-surface
          dark: "#1f2937",       // bg-surface-dark
        },
        border: {
          DEFAULT: "#e5e7eb",
          dark: "#374151",
        },
        text: {
          DEFAULT: "#1f2937",
          dark: "#f9fafb",
          subtle: "#6b7280",
          subtleDark: "#9ca3af",
        },
        primary: {
          DEFAULT: "#adc7f8",
          light: "#93c5fd",
          dark: "#1e3a8a",
          contrast: "#ffffff",
        },
      },
      fontFamily: {
        // 你可以自定义主字体和备用字体
        sans: ['"Helvetica Neue"', 'Arial', 'Noto Sans SC', 'PingFang SC', 'Microsoft Yahei', 'sans-serif'],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  plugins: [
    ('tailwind-scrollbar'),
  ],
}