/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: '#FDF7F8',
          100: '#F9ECF0',
          200: '#F2D3DC',
          300: '#E6AAB9',
          400: '#D57991',
          500: '#B84566',
          600: '#842D49', // secondary
          700: '#641B32', // primary luxury maroon
          800: '#521427',
          900: '#42101F',
          950: '#270811',
        },
        gold: {
          50: '#FCF9F1',
          100: '#F8F1DD',
          200: '#EFE1B9',
          300: '#E4CD90',
          400: '#D6B36A', // Champagne gold
          500: '#C79D4C',
          600: '#A97E36',
          700: '#855E2B',
          800: '#6E4C27',
          900: '#5C3F24',
        },
        surface: {
          lightBg: '#FFFFFF',
          darkBg: '#100D10',
          darkCard: '#1C171C',
          darkBorder: '#2C222A',
          darkHover: '#251E24',
          darkSubtle: '#332731',
          lightText: '#09090B',
          lightMuted: '#52525B',
          lightCard: '#FFFFFF',
          lightBorder: '#E4E4E7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(100, 27, 50, 0.25)',
        'luxury-lg': '0 20px 40px -15px rgba(100, 27, 50, 0.35)',
        'gold-glow': '0 0 25px -5px rgba(214, 179, 106, 0.35)',
        'maroon-glow': '0 0 30px -5px rgba(100, 27, 50, 0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'maroon-gradient': 'linear-gradient(135deg, #641B32 0%, #842D49 50%, #42101F 100%)',
        'gold-gradient': 'linear-gradient(135deg, #F8F1DD 0%, #D6B36A 50%, #A97E36 100%)',
        'dark-gradient': 'linear-gradient(180deg, #100D10 0%, #171217 100%)',
      }
    },
  },
  plugins: [],
}

