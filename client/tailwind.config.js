/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif']
      },
      colors: {
        ink: '#172126',
        mist: '#f5f7f8',
        pine: '#1f5f54',
        coral: '#d45d4c',
        gold: '#c9952f'
      },
      boxShadow: {
        panel: '0 16px 48px rgba(23, 33, 38, 0.10)'
      }
    }
  },
  plugins: []
};
