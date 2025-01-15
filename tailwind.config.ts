import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

const config = {
  darkMode: ['class'],
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        gray: {
          500: '#505059',
          700: '#29292E',
          850: '#1A1A1E',
          900: '#121214'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          text: 'hsl(var(--primary-text))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'gradient-move': {
          '0%': { 'background-position': '0% 50%' },
          '100%': { 'background-position': '100% 50%' }
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': {
            transform: 'translateY(-25px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        shadow: {
          '0%, 100%': {
            transform: 'scaleX(1)',
            opacity: '0.3'
          },
          '50%': {
            transform: 'scaleX(0.8)',
            opacity: '0.15'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-moving': 'gradient-move 10s ease infinite',
        'bounce-custom': 'bounce 2s infinite',
        shadow: 'shadow 2s infinite'
      }
    },
    backgroundImage: {
      pattern: 'url(/images/backgrounds/bg.svg)'
    },
    screens: {
      xxsAndDown: { min: '0px', max: '430px' },
      xxs: { min: '0px', max: '430px' },
      xxsAndUp: { min: '0px' },
      xsAndDown: { min: '0px', max: '639px' },
      xs: { min: '431px', max: '639px' },
      xsAndUp: { min: '431px' },
      smAndDown: { min: '0px', max: '767px' },
      sm: { min: '640px', max: '767px' },
      smAndUp: { min: '640px' },
      mdAndDown: { min: '0px', max: '1023px' },
      md: { min: '768px', max: '1023px' },
      mdAndUp: { min: '768px' },
      lgAndDown: { min: '0px', max: '1279px' },
      lg: { min: '1024px', max: '1279px' },
      lgAndUp: { min: '1024px' },
      xlAndDown: { min: '0px', max: '1535px' },
      xl: { min: '1280px', max: '1535px' },
      xlAndUp: { min: '1280px' },
      '2xl': { min: '1536px' }
    }
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-filters')]
} satisfies Config

export default config
