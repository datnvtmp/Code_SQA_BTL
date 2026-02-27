/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
    	extend: {
    		fontSize: {
    			xs: [
    				'12px',
    				'16px'
    			],
    			sm: [
    				'14px',
    				'20px'
    			],
    			base: [
    				'16px',
    				'24px'
    			],
    			lg: [
    				'18px',
    				'28px'
    			],
    			xl: [
    				'20px',
    				'28px'
    			],
    			'2xl': [
    				'24px',
    				'32px'
    			],
    			'3xl': [
    				'30px',
    				'36px'
    			],
    			'4xl': [
    				'36px',
    				'40px'
    			],
    			'5xl': [
    				'48px',
    				'1'
    			],
    			'6xl': [
    				'60px',
    				'1'
    			]
    		},
    		fontFamily: {
    			Jakarta: [
    				'Jakarta',
    				'sans-serif'
    			],
    			JakartaBold: [
    				'Jakarta-Bold',
    				'sans-serif'
    			],
    			JakartaExtraBold: [
    				'Jakarta-ExtraBold',
    				'sans-serif'
    			],
    			JakartaExtraLight: [
    				'Jakarta-ExtraLight',
    				'sans-serif'
    			],
    			JakartaLight: [
    				'Jakarta-Light',
    				'sans-serif'
    			],
    			JakartaMedium: [
    				'Jakarta-Medium',
    				'sans-serif'
    			],
    			JakartaSemiBold: [
    				'Jakarta-SemiBold',
    				'sans-serif'
    			]
    		},
    		colors: {
    			backgroundV1: '#F1EEE8',
    			textNeutralV1: '#666666',
    			customPrimary: '#E36137',
    			customSecondary: '#203C74',
    			primary: {
    				'100': '#F5F8FF',
    				'200': '#EBF4FF',
    				'300': '#C3D9FF',
    				'400': '#9BBFFF',
    				'500': '#0286FF',
    				'600': '#6A85E6',
    				'700': '#475A99',
    				'800': '#364573',
    				'900': '#242B4D',
    				DEFAULT: 'hsl(var(--primary))',
    				foreground: 'hsl(var(--primary-foreground))'
    			},
    			secondary: {
    				'100': '#F8F8F8',
    				'200': '#F1F1F1',
    				'300': '#D9D9D9',
    				'400': '#C2C2C2',
    				'500': '#AAAAAA',
    				'600': '#999999',
    				'700': '#666666',
    				'800': '#4D4D4D',
    				'900': '#333333',
    				DEFAULT: 'hsl(var(--secondary))',
    				foreground: 'hsl(var(--secondary-foreground))'
    			},
    			success: {
    				'100': '#F0FFF4',
    				'200': '#C6F6D5',
    				'300': '#9AE6B4',
    				'400': '#68D391',
    				'500': '#38A169',
    				'600': '#2F855A',
    				'700': '#276749',
    				'800': '#22543D',
    				'900': '#1C4532'
    			},
    			danger: {
    				'100': '#FFF5F5',
    				'200': '#FED7D7',
    				'300': '#FEB2B2',
    				'400': '#FC8181',
    				'500': '#F56565',
    				'600': '#E53E3E',
    				'700': '#C53030',
    				'800': '#9B2C2C',
    				'900': '#742A2A'
    			},
    			warning: {
    				'100': '#FFFBEB',
    				'200': '#FEF3C7',
    				'300': '#FDE68A',
    				'400': '#FACC15',
    				'500': '#EAB308',
    				'600': '#CA8A04',
    				'700': '#A16207',
    				'800': '#854D0E',
    				'900': '#713F12'
    			},
    			general: {
    				'100': '#CED1DD',
    				'200': '#858585',
    				'300': '#EEEEEE',
    				'400': '#0CC25F',
    				'500': '#F6F8FA',
    				'600': '#E6F3FF',
    				'700': '#EBEBEB',
    				'800': '#ADADAD'
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
    			chart: {
    				'1': 'hsl(var(--chart-1))',
    				'2': 'hsl(var(--chart-2))',
    				'3': 'hsl(var(--chart-3))',
    				'4': 'hsl(var(--chart-4))',
    				'5': 'hsl(var(--chart-5))'
    			}
    		},
    		borderRadius: {
    			lg: 'var(--radius)',
    			md: 'calc(var(--radius) - 2px)',
    			sm: 'calc(var(--radius) - 4px)'
    		},
    		ringColor: {
    			customPrimary: '#E36137'
    		}
    	}
    },
    plugins: [require("tailwindcss-animate")],
};