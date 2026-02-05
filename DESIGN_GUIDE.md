# AXIS HRM - Dark Premium Design Guide

## Color Palette - Purple & Cyan Neon Theme

### Primary Colors
- **Primary Purple**: `hsl(270, 100%, 55%)` - Neon vibrant purple used for primary buttons, active states, and highlights
- **Secondary Cyan**: `hsl(180, 100%, 50%)` - Neon vibrant cyan used for accents, alerts, and secondary highlights
- **Background Dark**: `hsl(260, 20%, 8%)` - Deep navy/black premium background
- **Card Background**: `hsl(260, 25%, 12%)` - Slightly lighter card backgrounds with depth

### Text Colors
- **Foreground**: `hsl(250, 10%, 95%)` - Clean white/off-white for primary text
- **Muted Foreground**: `hsl(250, 10%, 75%)` - Secondary text and descriptions
- **Text on Color**: Uses white for contrast on colored backgrounds

## Design Elements

### Sidebar Navigation
- Dark premium background with purple-cyan gradient accents
- Smooth hover animations with neon glow effects
- Active items show glowing border and gradient background
- Custom purple scrollbar with neon glow on hover
- Icons with semantic meaning
- Hierarchical menu structure

### Header Component
- Frosted glass effect with backdrop blur
- Purple/cyan gradient text for "Welcome" and status text
- Neon-glowing profile avatar
- Interactive buttons with smooth hover states
- Notification bell with bouncing animation on hover

### Dashboard Cards
- Gradient backgrounds from primary/accent colors at 10% opacity
- Hover effects with scale transformation (105%)
- Smooth shadow transitions with color-matched glows
- Rounded corners (rounded-xl for premium feel)
- Backdrop blur for glass morphism effect

### Buttons
- Purple/Cyan gradients with 100% saturation for neon effect
- Shadow glow matching button color
- Hover states with scale and shadow intensification
- Border transparency for layered effect
- Semi-bold font weight for better readability

## Animations

### Neon Glow (`animate-neon-glow`)
Text shadow animation creating pulsing neon effect
- Used on logo text and headings
- Alternates between 0.5 and 0.8 opacity on glows

### Neon Border (`animate-neon-border`)
Box shadow animation for glowing borders
- Used on active navigation items and special elements
- Creates continuous pulsing effect

### Cyan Glow (`animate-cyan-glow`)
Cyan-specific version of neon glow
- Used for cyan accent elements
- Distinct from purple glow for color differentiation

### Float (`animate-float`)
Subtle vertical movement
- Used on important UI elements for emphasis
- Creates depth and draws attention

### Slide Down & Up
Expansion/collapse animations for menus
- Smooth 0.3s ease transitions
- Used for dropdown menus and expanding sections

### Fade In
Standard opacity transition
- Used on component mounting
- 0.5s ease-out for smooth appearance

## Typography

- **Headings**: Bold weight (700), gradient text from purple to cyan
- **Body**: Regular weight (400), using muted-foreground color
- **Buttons**: Semi-bold weight (600), uppercase variant for emphasis
- **Labels**: Regular weight with muted-foreground color

## Spacing & Layout

- Sidebar width: 288px (w-72)
- Top header height: 64px (h-16)
- Standard padding: 8px (px-2/py-2) to 32px (px-8/py-8)
- Card border radius: 12px (rounded-xl)
- Button border radius: 8px (rounded-lg)
- Gap between elements: 4px (gap-1) to 24px (gap-6)

## Responsive Design

- Mobile-first approach
- Sidebar hides on mobile (consider collapsible version)
- Cards stack to 1 column on mobile
- 2-column layout on tablets
- 4-column layout on desktop (lg breakpoint)

## Hover States

All interactive elements feature:
- Color intensity increase
- Shadow intensification with matching color glow
- Scale transformation (hover:scale-105)
- Border clarity increase
- Smooth 300ms transitions

## Accessibility

- Purple and Cyan have high contrast with dark backgrounds
- Text sizes follow hierarchy (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl)
- Icons paired with text labels
- Sufficient padding for touch targets (min 44px)
- Focus states maintain neon glow effect

## CSS Variables Used

All colors are defined as CSS variables for easy theming:
- `--primary`: Purple neon
- `--secondary`: Foreground text
- `--accent`: Cyan neon
- `--background`: Dark navy
- `--card`: Slightly lighter navy
- `--muted`: Gray accents
- `--border`: Subtle borders
- `--ring`: Focus ring (primary purple)

Changes can be made in `/app/globals.css` in the `:root` and `.dark` selectors.
