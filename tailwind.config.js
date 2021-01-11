let defaultTailwindTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.tsx'
  ],
  darkMode: false,
  theme: {
    fontFamily: {
      sans: [
        'Inter',
        ...defaultTailwindTheme.fontFamily.sans
      ]
    },
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
}
