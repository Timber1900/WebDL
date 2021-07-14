module.exports = {
  mode: 'jit',
  purge: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateRows: {
       'pancake': 'auto 1fr auto',
       'search': 'auto 1fr',
      },
      transitionProperty: {
        'width': 'width'
      },
      minWidth: {
        '4': '1rem'
      },
      keyframes: {
        dv: {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
          '50.01%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        download: 'dv 2s cubic-bezier(0.65, 0.05, 0.36, 1) infinite',
       },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
