/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#071a34',
        navy: '#0b2c59',
        canvas: '#f4f7fb',
        line: '#d8e0eb',
      },
      boxShadow: {
        panel: '0 16px 40px -28px rgba(7, 26, 52, 0.28)',
        lift: '0 18px 42px -28px rgba(7, 26, 52, 0.38)',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        display: ['"Noto Serif SC"', '"Songti SC"', 'STSong', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-up': 'fade-up 500ms ease-out both',
        'soft-pulse': 'soft-pulse 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
