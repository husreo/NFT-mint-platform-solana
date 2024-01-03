/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        bgColor: '#0E263C',
        borderYellow: '#FFAB24',
        darkYellow: '#99732D'
      },
      fontFamily: {
        ShPinscher: ['SHPinscher', 'sans-serif'],
      },
      fontSize: {
        content: '20px',
        title: '24px'
      }
    },
  },
  plugins: [],
}

