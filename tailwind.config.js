/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design system colors
        background: 'hsl(240 10% 3.9%)',
        foreground: 'hsl(0 0% 98%)',
        card: 'hsl(240 10% 3.9%)',
        'card-foreground': 'hsl(0 0% 98%)',
        muted: 'hsl(240 3.7% 15.9%)',
        'muted-foreground': 'hsl(240 5% 64.9%)',
        border: 'hsl(240 3.7% 15.9%)',
        // Accent colors
        profit: {
          DEFAULT: 'hsl(142 76% 36%)',
          foreground: 'hsl(142 76% 96%)'
        },
        loss: {
          DEFAULT: 'hsl(346 77% 49%)',
          foreground: 'hsl(346 77% 96%)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
