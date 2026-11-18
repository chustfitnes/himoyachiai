/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Calm, warm editorial palette
        canvas: {
          light: '#FAF8F5', // Warm off-white
          dark: '#16181A',  // Soft charcoal (not pure black)
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E2124',
        },
        surfaceSubtle: {
          light: '#F2EFEB',
          dark: '#262A2E',
        },
        ink: {
          primary: {
            light: '#1B1C1D',
            dark: '#F0EFEA',
          },
          secondary: {
            light: '#5E6368',
            dark: '#A0A6AD',
          },
          muted: {
            light: '#858B93',
            dark: '#717780',
          },
        },
        borderSubtle: {
          light: '#E6E2DC',
          dark: '#2E3238',
        },
        // Restrained accent: Deep sage / muted teal
        brand: {
          50: '#EBF4F2',
          100: '#D5E6E3',
          200: '#ADD0C9',
          500: '#2C6E63', // Deep muted teal
          600: '#235950',
          700: '#1C453E',
          800: '#15332E',
        },
        // Risk colors (ONLY for assessment results, soft and accessible WCAG AA)
        risk: {
          green: {
            bg: '#EAF5EE',
            border: '#B6E3C4',
            text: '#1C693B',
            darkBg: '#13281C',
            darkBorder: '#204E33',
            darkText: '#7BE1A1',
          },
          yellow: {
            bg: '#FEF8E7',
            border: '#F8E09B',
            text: '#8F5E05',
            darkBg: '#2D230D',
            darkBorder: '#5E4919',
            darkText: '#F7CB62',
          },
          red: {
            bg: '#FDF0ED',
            border: '#F5C1B5',
            text: '#A62612',
            darkBg: '#2E1513',
            darkBorder: '#632520',
            darkText: '#FCA295',
          },
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      maxWidth: {
        'reading': '640px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.04), 0 1px 3px -1px rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 8px 24px -4px rgba(0, 0, 0, 0.06), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
