/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        discord: {
          primary: '#5865F2',
          green: '#57F287',
          yellow: '#FEE75C',
          fuchsia: '#EB459E',
          red: '#ED4245',
          background: '#36393f',
          channelsBg: '#2f3136',
          membersBg: '#2f3136',
          serversBg: '#202225',
          textColor: '#dcddde',
          channelText: '#8e9297',
        },
      },
    },
  },
  plugins: [],
};