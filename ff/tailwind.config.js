/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  borderRadius: {
  	lg: 'var(--radius)',
  	md: 'calc(var(--radius) - 2px)',
  	sm: 'calc(var(--radius) - 4px)'
  },
  colors: {
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",

    card: "hsl(var(--card))",
    "card-foreground": "hsl(var(--card-foreground))",

    popover: "hsl(var(--popover))",
    "popover-foreground": "hsl(var(--popover-foreground))",

    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
    },

    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
    },

    muted: "hsl(var(--muted))",
    "muted-foreground": "hsl(var(--muted-foreground))",

    accent: "hsl(var(--accent))",
    "accent-foreground": "hsl(var(--accent-foreground))",

    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))",
    },

    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",

    chart: {
      1: "hsl(var(--chart-1))",
      2: "hsl(var(--chart-2))",
      3: "hsl(var(--chart-3))",
      4: "hsl(var(--chart-4))",
      5: "hsl(var(--chart-5))",
    },
  },
  boxShadow: {
  	soft: "0 4px 8px rgba(0,0,0,0.25)",
  	glow: "0 0 20px rgba(59,130,246,0.6)",
  	elevated: "0 12px 30px rgba(0,0,0,0.35)",
  	'inner-light': "inset 0 1px 0 rgba(255,255,255,0.1)",
  	'inner-dark': "inset 0 1px 3px rgba(0,0,0,0.3)",
  },
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'conic-rotate': {
  				from: {
  					transform: 'rotate(0deg)'
  				},
  				to: {
  					transform: 'rotate(360deg)'
  				}
  			},
  			'dock-bounce': {
  				'0%, 100%': {
  					transform: 'translateY(0px) scale(1)'
  				},
  				'50%': {
  					transform: 'translateY(-4px) scale(1.05)'
  				}
  			},
  			'flip-in': {
  				from: {
  					transform: 'rotateY(180deg)',
  					opacity: '0'
  				},
  				to: {
  					transform: 'rotateY(0deg)',
  					opacity: '1'
  				}
  			},
  			'radius-pulse': {
  				'0%, 100%': {
  					borderRadius: '0.5rem'
  				},
  				'50%': {
  					borderRadius: '1rem'
  				}
  			},
  			'text-hover-lift': {
  				from: {
  					transform: 'translateY(0px)'
  				},
  				to: {
  					transform: 'translateY(-2px)'
  				}
  			},
  			'magnetic-pull': {
  				from: {
  					transform: 'translate(0px, 0px)'
  				},
  				to: {
  					transform: 'translate(var(--mouse-x, 0px), var(--mouse-y, 0px))'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'conic-rotate': 'conic-rotate 2s linear infinite',
  			'dock-bounce': 'dock-bounce 0.6s ease-in-out',
  			'flip-in': 'flip-in 0.6s ease-out',
  			'radius-pulse': 'radius-pulse 2s ease-in-out infinite',
  			'text-hover-lift': 'text-hover-lift 0.2s ease-out',
  			'magnetic-pull': 'magnetic-pull 0.3s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};