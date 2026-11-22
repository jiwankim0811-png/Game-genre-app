---
name: GenreCompass
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353942'
  surface-container-lowest: '#0a0e16'
  surface-container-low: '#181c24'
  surface-container: '#1c2028'
  surface-container-high: '#262a33'
  surface-container-highest: '#31353e'
  on-surface: '#dfe2ee'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2ee'
  inverse-on-surface: '#2c3039'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#1bbd85'
  on-tertiary-container: '#00452e'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0f131c'
  on-background: '#dfe2ee'
  surface-variant: '#31353e'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.75rem
  margin: 1rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a high-precision, tactical gaming cartography environment for genre discovery, analysis, and spatial mapping. It blends the austere precision of aerospace HUD telemetry with the electric vibrancy of modern competitive gaming. The target audience comprises analytical gamers, game developers, curriculum researchers, and gaming curators who seek nuanced classification beyond blunt single-tag systems.

The emotional signature is one of calculated curiosity, digital precision, and spatial clarity. Visually, the system operates at the intersection of **Dark Glassmorphic UI** and **Cybernetic HUD Minimalism**:
- Pure dark spatial depth anchored in slate voids to eliminate eye strain during extensive chart exploration.
- Luminescent neon accents functioning as energy states, dynamic vectors, and interactive coordinate landmarks.
- Semi-translucent frosted glass tiers featuring hair-thin glowing borders, simulating physical glass optic overlays suspended in digital space.
- Diagrammatic nodes, coordinate matrices, and categorical telemetry that treat game genres as dynamic coordinate values rather than static lists.

## Colors

The palette is engineered around high luminous contrast over deep slate darkness, directing visual focus toward 2-axis quadrants, interactive nodes, and multidimensional genre tags.

### Core Palette Roles
- **Surface Black & Void Slate (`neutral_color_hex: #0B0F17`)**: Base viewport, radar grids, and ambient floor canvas. Paired with secondary surface fill `#111827` for elevated layers and interactive coordinate panels.
- **Neon Cyan Vector (`primary_color_hex: #06B6D4`)**: Key directional axis indicators, high-priority interactive targets, active quadrant thresholds, and focused navigation telemetry.
- **Electric Indigo Warp (`secondary_color_hex: #6366F1`)**: Secondary axis gradients, sub-genre coordinate bridges, tertiary matrix highlights, and analytical metric bars.
- **Hyper Mint Pulse (`tertiary_color_hex: #10B981`)**: Positive match metrics, affinity indicators, active cluster highlights, and confirmed genre nodes.

### Functional Tinting & Emissive Accents
- Cyan Glow Border: `rgba(6, 182, 212, 0.35)` to `rgba(6, 182, 212, 0.7)` on hover.
- Indigo Field Accent: `rgba(99, 102, 241, 0.15)` for background gradient washes on diagram backdrops.
- Text Primary: `#F9FAFB` (high-readability pure contrast).
- Text Secondary: `#9CA3AF` (coordinate labels, metric descriptors).
- Border Base: `rgba(255, 255, 255, 0.08)` for dormant cards and glass containers.

## Typography

The typography system merges three distinct typographic voices into a cohesive technical taxonomy:

1. **Space Grotesk (Headlines & Display)**: Provides a sharp, geometric, future-forward attitude. Structural apexes and confident horizontal rhythm emphasize quadrant names, primary coordinate headings, and view modes.
2. **Hanken Grotesk (Body & Narrative)**: Clean, humanistic neutrality that ensures fatigue-free reading for game descriptions, mechanics analyses, and balance overviews.
3. **JetBrains Mono (Telemetry, Coordinates, Badges & Labels)**: Monospaced rigor for X/Y coordinates (e.g., `X: +0.72 | Y: -0.45`), mathematical delta indicators, taxonomy tags, and system stats.

All uppercase telemetry labels utilize expanded letter spacing (`0.06em` to `0.08em`) to preserve legibility at micro sizes against dark background gradients.

## Layout & Spacing

The layout model balances an analytical viewport with flexible responsive content flows:

- **2-Axis Coordinate Stage**: The primary visual workspace is anchored by a persistent, aspect-locked or flexible canvas (1:1 aspect ratio on desktop side-by-side; full width responsive height on smaller devices).
- **12-Column Responsive Grid**: Content below or adjacent to the coordinate plane follows a 12-column dynamic grid. 
  - **Desktop (≥ 1280px)**: Asymmetric split layout (7 columns for interactive coordinate navigator, 5 columns for deep-dive genre cards, game lists, and telemetry filters). Gutter: `1.75rem`.
  - **Tablet (768px - 1279px)**: Stacked hybrid layout (full-width interactive stage with floating quadrant HUD, followed by 2-column card layouts). Gutter: `1.25rem`.
  - **Mobile (< 768px)**: Single-column linear stack. Coordinate stage shifts to a touch-optimized gesture surface with collapsible bottom drawers for selected game and genre details.
- **Rhythmic Densities**: Micro tokens (`space-xs`, `space-sm`) define dense telemetry clusters, badge contents, and coordinate tags. Macro tokens (`space-lg`, `space-xl`) separate analytic modules and layout regions.

## Elevation & Depth

Visual hierarchy does not use traditional heavy muddy drop shadows. Instead, it relies on **Atmospheric Glassmorphism**, **Tonal Luminescence**, and **Bioluminescent Borders**:

- **Layer 0 (Canvas Void)**: `#0B0F17` with a low-opacity SVG vector grid (`rgba(255, 255, 255, 0.03)`) representing the continuous 2-axis plane.
- **Layer 1 (Recessed/Docked Panes)**: `#111827` at 70% opacity with `backdrop-filter: blur(12px)`. Low-contrast border of `1px solid rgba(255, 255, 255, 0.06)`.
- **Layer 2 (Floating Cards & Flyouts)**: `rgba(17, 24, 39, 0.85)` with `backdrop-filter: blur(20px)`. Outer border: `1px solid rgba(255, 255, 255, 0.12)`. Subtle directional edge highlight: `inset 0 1px 0 rgba(255, 255, 255, 0.15)`.
- **Layer 3 (Active Overlays, Selected Nodes & Modals)**: Backed by `rgba(15, 23, 42, 0.92)` glass with an active accent border glow: `0 0 20px rgba(6, 182, 212, 0.25), 0 0 1px rgba(6, 182, 212, 0.8)`.
- **Interactive Coordinate Nodes**: SVG and DOM pins cast calibrated dual glows (`0 0 8px rgba(6, 182, 212, 0.6)`, scaling to `0 0 16px rgba(16, 185, 129, 0.9)` when active or matched).

## Shapes

The design system incorporates geometric balance (`roundedness: 2`, base radius: `0.5rem` / 8px). This creates a tactical, precision instrument feel that avoids toy-like softness while preventing the severe harshness of pure brutalism:

- **Standard Containers & Cards**: `rounded-md` (`0.5rem`) for analytical metric cards, filter pods, and inspector panels.
- **Modals & Coordinate Map Viewports**: `rounded-lg` (`1rem`) for larger windowed interfaces and high-tech map containers.
- **Pill Badges & Filter Chips**: Fully rounded pill shapes (`rounded-full` / `9999px`) reserved specifically for micro tags, genre classification chips, and dynamic state toggles.
- **Data Nodes**: Precise circular geometry with concentric ping rings for 2-axis position indicators. Axis intercept arrows maintain crisp 45-degree chamfers.

## Components

### 1. Buttons
- **Primary Action (Pulse Vector)**: Cyan background (`#06B6D4`) with slate void text (`#0B0F17`, weight 600). Hover triggers an outward teal glow (`box-shadow: 0 0 18px rgba(6, 182, 212, 0.45)`).
- **Secondary Action (Sub-Axis)**: Glass fill (`rgba(99, 102, 241, 0.1)`) with electric indigo border (`rgba(99, 102, 241, 0.4)`) and white text. Hover transitions to solid `#6366F1` text with border illumination.
- **Ghost/HUD Button**: Minimal `rgba(255, 255, 255, 0.05)` surface, monospaced typography, and hair-thin border on hover.

### 2. Interactive Coordinate Badges & Pill Chips
- **Quadrant Pill Chips**: Compact capsules (`padding: 0.25rem 0.75rem`) with `JetBrains Mono` text. Prefixed with quadrant indicators (`[Q1]`, `[Q2]`, etc.). Unselected chips use subdued slate borders; active chips activate full cyan or mint emissive glow.
- **Coordinate Telemetry Badges**: Fixed-width mono display badges showing real-time pointer coordinates (`[X: +0.40 | Y: -0.85]`), framed in high-translucency glass with glowing crosshair icons.

### 3. Diagram Nodes (Genre Compass Points)
- **Node Core**: Concentric circles (Outer diameter 16px, inner core 8px). Inner core features an emissive radial gradient (`#10B981` or `#06B6D4`).
- **Cluster States**: Multi-genre convergence nodes feature orbiting micro rings. Hovering magnifies the node scale by 1.25x and summons a glassmorphic tooltip card.
- **Axis Lines**: Semi-transparent crossbars with laser gradients that intensify at `(0,0)` origin.

### 4. Cards (Genre Inspector & Game Match)
- Layer 1 glass backgrounds featuring gradient top-borders (`1px` height from `#06B6D4` fading to transparent).
- Header houses primary taxonomy in `Space Grotesk`, followed by JetBrains Mono coordinate vectors.
- Card footers feature match percentage bars rendered as segmented glowing ticks.

### 5. Input Fields & Search Bars
- Background: `rgba(17, 24, 39, 0.6)`.
- Border: `1px solid rgba(255, 255, 255, 0.1)`. Focus state illuminates with a crisp cyan edge (`border-color: #06B6D4`) and subtle ambient inner glow.
- Placeholder text in muted cool slate (`#6B7280`), typography in `Hanken Grotesk`.

### 6. Checkboxes & Switches (Tactical Matrix Toggles)
- Custom square checkboxes with rounded corners (`3px`), glowing mint check indicator when checked.
- Toggle switches resemble hardware slider switches with glowing neon cyan status pips.
