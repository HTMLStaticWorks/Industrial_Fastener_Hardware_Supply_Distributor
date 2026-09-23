# IndustrialPro Fasteners – Industrial Fastener & Hardware Supply Platform

A production-grade, responsive B2B web platform designed for **IndustrialPro Fasteners**, a master distributor of heavy structural fasteners, hex bolts, socket screws, concrete anchors, and custom engineered fastening solutions.

Built with advanced **HTML5**, modern **CSS3** (utilizing strict tokens, CSS variables, logical RTL properties, and heading font weights capped at 580), and vanilla **JavaScript (ES6+)**.

---

## 🏗️ Architecture & File Structure

```
Industrial Fastener & Hardware Supply Distributor/
├── index.html              # Main Home: Hero, Products Range, Industries, Quality Lab, Testimonials, CTA, Footer
├── home2.html              # Home 2: Interactive Fastener Spec & Live Torque Calculator, Metallurgy Matrix
├── catalog.html            # Fastener Catalog organized by type with quick CAD / Spec modal
├── bulk-ordering.html      # High-Volume RFQ & Purchase Orders Line-Item Builder + BOM drop simulator
├── pricing.html            # Account-Specific Pricing Tiers (Tier 1 Contractor, Tier 2 Enterprise, Tier 3 OEM Direct)
├── services.html           # Industrial Services: VMI Smart Bins, CNC Machining, Mil-Spec QA Testing, Kitting
├── about.html              # Company Heritage (since 1988), ISO 9001:2015 Accreditation, Leadership, Milestones
├── blog.html               # Technical Fastener Engineering Whitepapers & Standards
├── blog-single.html        # Detailed technical article on Hydrogen Embrittlement Mitigation & Baking Protocols
├── contact.html            # Multi-facility distribution center inquiry form with client-side validation
├── login.html              # Centered B2B client portal login (Zero scroll, Google & Apple auth, no theme toggle)
├── register.html           # Commercial account application (Zero scroll, Google & Apple auth, no theme toggle)
├── dashboard.html          # Enterprise B2B client dashboard: KPIs, live bulk reorder math, shipment tracker, invoices
├── 404.html                # Industrial blueprint 404 error page
├── coming-soon.html        # Southwest automated mega-hub launch countdown & early reservation
├── assets/
│   ├── css/
│   │   ├── style.css       # Core design tokens, typography, components, dark mode, responsive media queries
│   │   └── rtl.css         # RTL logical layout overrides and left-slide drawer rules
│   └── js/
│       ├── main.js         # Navigation, drawer, theme toggle, RTL switcher, form validation, live calculator
│       └── dashboard.js    # B2B client dashboard tab switching, dynamic reorder pricing, shipment tracker
└── README.md               # Technical documentation
```

---

## 🎨 Master Design System & Tokens

### 1. Colors (Maximum 3 Core Tokens)
- **Primary Color**: `#0F172A` (Deep Slate Gunmetal)
- **Secondary Color**: `#334155` (Forged Carbon Steel Slate)
- **Accent Color**: `#F59E0B` (Precision Safety Amber / Cadmium Gold)

### 2. Typography System
- **Headings Font**: `'Space Grotesk', sans-serif`
- **Body Font**: `'Lexend', sans-serif`
- **Strict Heading Weight Limit**: Headings **NEVER** exceed weight **580** (no `font-weight: 600`, `700`, `800`, or `900`).
  - `H1`: weight `580`, size `4.5rem` (`3.25rem` on mobile)
  - `H2`: weight `540`, size `3.25rem`
  - `H3`: weight `520`, size `2.25rem`
  - `H4/H5/H6`: weight `500`, size `1.65rem`
  - `Body`: weight `420`, size `1rem`
  - `Lead`: weight `460`, size `1.25rem`
  - `Buttons`: weight `510`, size `1rem`
  - `Labels/Nav`: weight `470`, size `0.95rem`
  - `Captions`: weight `400`, size `0.85rem`

### 3. Global Geometry & Elevation
- **Uniform Border Radius**: `6px` globally across cards, buttons, inputs, and modals.
- **Uniform Shadow Style**: `0 4px 20px -2px rgba(15, 23, 42, 0.08)` (and dark equivalent `0 4px 24px -2px rgba(0, 0, 0, 0.55)`).

### 4. Global Alignment Standards
- All section headings and lead subtexts are centered.
- All cards have equal height and flex column alignment with items starting on consistent horizontal baselines.

---

## ⚡ Key Technical Features

1. **Strict Responsive Navbar & Breakpoints**:
   - `> 1024px`: Full horizontal navigation.
   - `≤ 1024px`: Hamburger trigger slides in mobile drawer (min 44px touch targets).
   - `360px`: Full-width drawer, optimized button widths, zero horizontal overflow.
2. **Right-to-Left (RTL) Engine**:
   - Toggled via `dir="rtl"` on `<html>` or `.rtl` class on `<body>`.
   - Uses logical properties (`margin-inline-start`, `border-inline-end`).
   - Triggered by `⇆` double-arrow icon in header (desktop) and drawer (mobile).
   - Drawer smoothly slides from the LEFT in RTL mode.
3. **Dark / Light Mode**:
   - System preference detection (`prefers-color-scheme`) with `localStorage` persistence.
   - Shown in header on desktop (> 1024px) and inside drawer on tablet/mobile (≤ 1024px).
   - Hidden completely on Auth pages (`login.html`, `register.html`).
4. **Client-Side Form Validation**:
   - Real-time field feedback with red border & message on error, green checkmark on success.
   - Email regex verification, minimum 8 characters for passwords, matching confirmation check, required terms acceptance.
   - Zero page reload on submit with inline notification banners.
5. **Interactive Tools**:
   - **Fastener Spec & Tightening Torque Calculator** (`home2.html`): Computes proof load, tensile yield, and recommended torque in ft-lbs based on bolt grade, diameter, and lubrication state.
   - **Dynamic Bulk Reorder Builder** (`dashboard.html`): Live line-item additions, quantity counters, subtotal math, and automatic 18% Enterprise Tier contract discount application.
   - **Interactive Shipment Tracker** (`dashboard.html`): Visual timeline with milestone tracking (Picked, QA Lot Verified, Loaded, In-Transit, Delivered).
   - **Fastener Spec Modal** (`catalog.html`): Quick view of metallurgical properties and dimensional tolerances.

---

## 🧪 Browser Testing & Verification

1. Serve locally with any HTTP server (e.g. `python -m http.server 8000` or open files directly).
2. Open `index.html` and verify hero animation, product grid, and responsive drawer.
3. Switch themes using the moon/sun button and reload to verify state persistence.
4. Toggle RTL layout using the `⇆` button to inspect mirrored layout and left-sliding drawer.
5. Visit `home2.html` to test the live torque calculator.
6. Visit `dashboard.html` to test bulk reorder pricing calculations and shipment tracking.
7. Test form validation on `contact.html`, `login.html`, and `register.html`.
