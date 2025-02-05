// tailwind.config.js
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'valentine-pink': '#ff4d6d',
        'valentine-light-pink': '#ff8fa3',
        'valentine-red': '#ff1a40',
        'valentine-white': '#fff0f3',
      },
      fontFamily: {
        dancing: ['Dancing Script', 'cursive'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        heartbeat: 'heartbeat 1.5s infinite',
      },
    },
  },
  plugins: [],
};