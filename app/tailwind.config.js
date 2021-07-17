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
      transitionTimingFunction: {
        back: "cubic-bezier(0.18, 0.89, 0.32, 1.28)"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
