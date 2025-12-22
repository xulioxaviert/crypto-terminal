/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds - Dark theme based on design
        'crypto-dark': '#0a0e1a',
        'crypto-dark-secondary': '#151b2e',
        'crypto-card': '#1a2332',
        'crypto-sidebar': '#0f1419',
        'crypto-bg-hover': '#222b3d',

        // Text colors
        'crypto-text': {
          primary: '#ffffff',
          secondary: '#8b93a7',
          muted: '#525866',
        },

        // Brand colors - Green for positive, Red for negative
        'crypto-green': {
          DEFAULT: '#00ff88',
          dark: '#00cc6a',
          light: '#66ffaa',
        },
        'crypto-red': {
          DEFAULT: '#ff0055',
          dark: '#cc0044',
          light: '#ff3377',
        },

        // Accent neon colors
        'crypto-neon': {
          cyan: '#00f0ff',
          magenta: '#ff00ff',
          purple: '#b800ff',
          yellow: '#ffff00',
        },

        // UI elements
        'crypto-border': '#2a3344',
        'crypto-hover': '#222b3d',
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.3)',
        'neon-green-strong': '0 0 15px rgba(0, 255, 136, 0.7), 0 0 30px rgba(0, 255, 136, 0.5)',
        'neon-red': '0 0 10px rgba(255, 0, 85, 0.5), 0 0 20px rgba(255, 0, 85, 0.3)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 12px -2px rgba(0, 255, 136, 0.1), 0 4px 8px -2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'chart-draw': 'chart-draw 1s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor',
          },
          '50%': {
            opacity: '.8',
            boxShadow: '0 0 20px currentColor, 0 0 40px currentColor',
          },
        },
        'glow': {
          '0%, 100%': {
            filter: 'brightness(1)',
          },
          '50%': {
            filter: 'brightness(1.2)',
          },
        },
        'chart-draw': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      borderRadius: {
        'card': '0.75rem',
      },
      spacing: {
        'safe-top': 'max(1rem, env(safe-area-inset-top))',
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
        'safe-left': 'max(1rem, env(safe-area-inset-left))',
        'safe-right': 'max(1rem, env(safe-area-inset-right))',
      },
    },
  },
  plugins: [],
}
