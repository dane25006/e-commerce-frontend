# Scentique — Typography & Font System Guide

Comprehensive guide to font families, size hierarchy, weight scales, multi-language (Khmer/English) typography rules, and common font issues & resolutions across the Scentique e-commerce platform.

---

## 📖 Table of Contents

- [🔤 Font Families & Locale Mapping](#-font-families--locale-mapping)
- [📏 Typography Scale & Size Hierarchy](#-typography-scale--size-hierarchy)
- [⚖️ Font Weights Scale](#️-font-weights-scale)
- [🇰🇭 Multi-Language (Khmer / English) Rules](#-multi-language-khmer--english-rules)
- [🎯 Component Typography Patterns](#-component-typography-patterns)
- [🔠 Common Font Style & Font Size Issues & Solutions](#-common-font-style--font-size-issues--solutions)
  - [1. Font Family Differences (Hardcoded Fonts vs CSS Tokens)](#1-font-family-differences-hardcoded-fonts-vs-css-design-tokens)
  - [2. Font Size Unit Inconsistencies (`px` vs `rem` vs `clamp()`)](#2-font-size-unit-inconsistencies-px-vs-rem-vs-clamp)
  - [3. Visual Size & Optical X-Height Disparities (EN vs KM)](#3-visual-size--optical-x-height-disparities-english-vs-khmer)
  - [4. Khmer Text Vertical Clipping (Subscripts & Diacritics)](#4-khmer-text-vertical-clipping-subscripts--diacritics-cut-off)
  - [5. Font Weight Inconsistencies (700 vs 800 vs 900)](#5-font-weight-inconsistencies-font-bold-vs-800-vs-font-black-900)
  - [6. Letter-Spacing Conflicts on Serif vs Khmer](#6-letter-spacing-conflicts-on-serif-vs-khmer-text)
  - [7. Flash of Unstyled Text (FOUT) / Faux Bold](#7-flash-of-unstyled-text-fout--faux-bold-rendering)
  - [8. Long Text Overflow & Card Grid Misalignment](#8-long-text-overflow--card-grid-misalignment)
- [🛠 Developer Best Practices & Checklist](#-developer-best-practices--checklist)

---

## 🔤 Font Families & Locale Mapping

Fonts are imported from Google Fonts in `frontend/index.html` and configured as CSS custom variables in `src/assets/main.css`.

| CSS Variable | English (`lang="en"`) | Khmer (`lang="km"`) | Purpose & Fallback |
| :--- | :--- | :--- | :--- |
| `--font-heading` | `'Playfair Display', Georgia, serif` | `'Battambang', 'Playfair Display', serif` | Hero banners, section headers, product titles, brand lettering |
| `--font-body` | `'Poppins', system-ui, sans-serif` | `'Battambang', system-ui, sans-serif` | Body copy, buttons, form inputs, badges, metadata |
| **Icons** | `@tabler/icons-webfont` | `@tabler/icons-webfont` | Vector iconography (`<i class="ti ti-*">`) |

### CSS Tokens Configuration (`src/assets/main.css`)

```css
:root,
[lang="en"] {
  --font-body: 'Poppins', system-ui, -apple-system, sans-serif;
  --font-heading: 'Playfair Display', Georgia, serif;
}

[lang="km"] {
  --font-body: 'Battambang', system-ui, -apple-system, sans-serif;
  --font-heading: 'Battambang', 'Playfair Display', Georgia, serif;
  --line-height-relaxed: 1.8;
  --letter-spacing-khmer: 0.02em;
}
```

### HTML Google Fonts Link (`frontend/index.html`)

```html
<!-- Google Fonts: Poppins (English) + Battambang (Khmer) + Playfair Display -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600&family=Poppins:wght@300;400;500;600;700;800;900&family=Battambang:wght@300;400;500;600;700;800;900&display=swap"
  rel="stylesheet"
/>
```

---

## 📏 Typography Scale & Size Hierarchy

Use standard rem units or fluid clamps to maintain visual balance across all screen breakpoints.

| Scale Tier | Size (Rem / Px) | Recommended Weight | Usage Example | Components |
| :--- | :--- | :--- | :--- | :--- |
| **Micro / Overline** | `0.625rem`–`0.6875rem` (10px–11px) | `700`–`800` (Bold) | Badges, category pills, gender tags | `ProductCard`, `PageBanner` badge |
| **Caption / Helper** | `0.75rem` (12px) | `400`–`500` (Regular/Medium) | Review counts, input hints, footer copy | `StarRating`, `ProductCard` |
| **Small / UI Text** | `0.8125rem`–`0.875rem` (13px–14px) | `500`–`600` (Medium/SemiBold) | Buttons, form inputs, table data, counts | `.btn-primary`, `.input-field`, `PageBanner` count |
| **Base / Body** | `1rem` (16px) | `400`–`500` (Regular/Medium) | Standard paragraphs, descriptions | `ProductDetailView`, `AboutView` |
| **Subheading / Medium** | `1.125rem`–`1.25rem` (18px–20px) | `700`–`800` (Bold/ExtraBold) | Card titles, modal headers, amount input | `TopUpView`, `ConfirmModal` |
| **Heading 2 / Section** | `1.5rem`–`1.75rem` (24px–28px) | `800`–`900` (ExtraBold/Black) | Section headings, cart drawer headers | `HomeView`, `CartView` |
| **Hero / Banner Title** | `clamp(2rem, 4.5vw, 3.25rem)` (32px–52px) | `900` (Black) | Main page banners, hero showcase titles | `PageBanner.vue`, `HomeView` |

---

## ⚖️ Font Weights Scale

Always choose from the loaded weights in Google Fonts (`300` to `900`) to avoid synthetic browser faux-bold:

| Weight | Name | Recommended Use Case |
| :--- | :--- | :--- |
| `300` | Light | Luxury banner subtitles, editorial quote text |
| `400` | Regular | Standard body copy, form placeholders, table rows |
| `500` | Medium | Secondary metadata, count indicators, review timestamps |
| `600` | SemiBold | Interactive buttons, section labels, dropdown menus, table headers |
| `700` | Bold | Product card titles, prices, modal header titles, CTA buttons |
| `800` | ExtraBold | Key metrics, discount badges, emphasized section titles |
| `900` | Black | Page banner titles (`PageBanner`), brand logos |

---

## 🇰🇭 Multi-Language (Khmer / English) Rules

Khmer script includes stacked subscript consonants (ជើងអក្សរ) and stacked vowel marks (ស្រៈលើ / ស្រៈក្រោម). Scentique enforces specific global typography rules for `[lang="km"]`:

1. **Relaxed Line Height (`1.8`):** Prevents upper and lower diacritic signs from clipping against container edges.
2. **Word Breaking:** `word-break: break-word` and `overflow-wrap: break-word` applied to prevent overflow in fixed-width containers.
3. **Heading Line Height (`1.4`):** Maintains adequate clearance for large multi-line titles.
4. **Button Padding:** Enhanced horizontal padding (`padding: 0.75rem 1.5rem;`) accommodates longer phrasing in Khmer without truncation.

```css
/* src/assets/main.css */
[lang="km"] body,
[lang="km"] p,
[lang="km"] span,
[lang="km"] a,
[lang="km"] li,
[lang="km"] button,
[lang="km"] input,
[lang="km"] select,
[lang="km"] textarea,
[lang="km"] label {
  line-height: var(--line-height-relaxed, 1.8);
  letter-spacing: var(--letter-spacing-khmer, 0.02em);
  word-break: break-word;
  overflow-wrap: break-word;
}
```

---

## 🎯 Component Typography Patterns

### 1. Page Banner (`PageBanner.vue`)
```css
/* Badge */
.banner-badge {
  font-size: 0.6875rem; /* 11px */
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* Main Heading */
.banner-title {
  font-family: var(--font-heading, 'Playfair Display', serif);
  font-size: clamp(2rem, 4.5vw, 3.25rem); /* 32px to 52px */
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

/* Subtitle */
.banner-subtitle {
  font-size: clamp(0.85rem, 1.8vw, 1rem); /* 13.6px to 16px */
  font-weight: 300;
  line-height: 1.6;
}
```

### 2. Product Card (`ProductCard.vue`)
```html
<!-- Product Title -->
<h3 class="text-sm font-bold line-clamp-2 leading-snug" style="color: var(--text); font-family: var(--font-heading);">
  {{ product.name }}
</h3>

<!-- Price -->
<span class="text-base sm:text-lg font-bold" style="color: var(--primary);">
  {{ formatPrice(product.price) }}
</span>
```

---

## 🔠 Common Font Style & Font Size Issues & Solutions

This section details known font difference issues across components, viewports, and multi-language locales, along with concrete solutions.

---

### 1. Font Family Differences (Hardcoded Fonts vs CSS Design Tokens)
* **Problem:** Some legacy components hardcoded `'Playfair Display', serif` or `'Inter'` directly in scoped CSS instead of using design tokens.
* **Why it breaks:**
  * Hardcoded `'Playfair Display'` will not switch to the Khmer font (`Battambang`) when the user switches to Khmer (`lang="km"`). The browser attempts to render Khmer using default system fonts, resulting in visual font mismatch.
  * Referencing `'Inter'` (e.g. in older payment components) without loading it in `index.html` causes silent fallback to system UI fonts (San Francisco on Apple, Segoe UI on Windows), causing visual differences across OS platforms.
* **Code Example & Fix:**
  ```css
  /* ❌ Bad: Hardcoded font names break Khmer localization and cross-OS consistency */
  .category-title {
    font-family: 'Playfair Display', serif;
  }
  .payment-text {
    font-family: 'Inter', sans-serif;
  }

  /* ✅ Good: Automatically maps to Playfair Display (EN) or Battambang (KM) */
  .category-title {
    font-family: var(--font-heading);
  }
  .payment-text {
    font-family: var(--font-body);
  }
  ```

---

### 2. Font Size Unit Inconsistencies (`px` vs `rem` vs `clamp()`)
* **Problem:** Mixing static raw pixels (`22px`, `15px`, `20px` in `TopUpView.vue`), arbitrary Tailwind utilities (`text-[10px]`), standard `rem` (`0.875rem` in `main.css`), and fluid `clamp()` in `PageBanner.vue`.
* **Why it breaks:**
  * Static `px` units do not respect user browser zoom, accessibility preferences, or root `html` font-size scaling.
  * Static font sizes (e.g., `font-size: 48px;`) make banners look overly massive on mobile screens (375px) while appearing too small on wide desktop displays (1920px+).
* **Code Example & Fix:**
  ```css
  /* ❌ Bad: Static pixel sizes do not scale responsively */
  .banner-title {
    font-size: 52px;
  }
  .modal-title {
    font-size: 22px;
  }

  /* ✅ Good: Fluid clamp for large banners, rem for standard UI */
  .banner-title {
    font-size: clamp(2rem, 4.5vw, 3.25rem); /* Smooth scaling 32px -> 52px */
    line-height: 1.15;
  }
  .modal-title {
    font-size: 1.25rem; /* 20px relative to root */
    font-weight: 700;
  }
  ```

---

### 3. Visual Size & Optical X-Height Disparities (English vs Khmer)
* **Problem:** At the same numeric `font-size` (e.g. `14px`), `Battambang` (Khmer) and `Poppins` (English) have distinct optical x-heights and glyph structures.
* **Why it breaks:**
  * Khmer characters have stacked subscript consonants and intricate circular loops that require more vertical clearance.
  * Khmer text strings are often 20%–40% longer in character count than English equivalents, causing buttons and chips with tight fixed widths to overflow or wrap awkwardly.
* **Code Example & Fix:**
  ```css
  /* ✅ Good: Dynamic language override in src/assets/main.css */
  [lang="km"] .btn-primary,
  [lang="km"] .btn-secondary,
  [lang="km"] .btn-danger,
  [lang="km"] .btn-cancel {
    white-space: normal;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    line-height: 1.6;
  }
  ```

---

### 4. Khmer Text Vertical Clipping (Subscripts & Diacritics Cut Off)
* **Problem:** Subscript consonants (ជើងអក្សរ e.g. ្ត, ្ជ, ្ល) or upper diacritics (ស្រៈលើ e.g. ិ, ី, ឹ) get chopped off at container boundaries.
* **Why it breaks:**
  * Containers setting `height: 40px` with `overflow: hidden` or using `line-height: 1` / `leading-none` lack the vertical height required for Khmer diacritics.
* **Code Example & Fix:**
  ```css
  /* ❌ Bad: Fixed height with tight line-height clips Khmer vowel marks */
  .button-badge {
    height: 32px;
    line-height: 1;
    overflow: hidden;
  }

  /* ✅ Good: Flexible min-height and relaxed line-height */
  .button-badge {
    min-height: 36px;
    line-height: var(--line-height-relaxed, 1.8);
    display: inline-flex;
    align-items: center;
  }
  ```

---

### 5. Font Weight Inconsistencies (`font-bold` vs `800` vs `font-black` 900)
* **Problem:** Inconsistent heading weights across views (e.g. `HomeView` using `font-black` (900) with `var(--font-body)` vs catalog pages using `font-weight: 800` with `var(--font-heading)`).
* **Why it breaks:**
  * The Home page appeared visually disjointed from product category and detail pages.
* **Standardization Rule:**
  * **Primary Page / Hero Titles:** `font-family: var(--font-heading); font-weight: 900;`
  * **Section Headings (H2/H3):** `font-family: var(--font-heading); font-weight: 800;`
  * **Product Card Titles:** `font-family: var(--font-heading); font-weight: 700; font-size: 0.875rem;`
  * **Interactive Buttons:** `font-family: var(--font-body); font-weight: 600; font-size: 0.875rem;`

---

### 6. Letter-Spacing Conflicts on Serif vs Khmer Text
* **Problem:** Applying wide tracking/letter-spacing (`letter-spacing: 0.2em` or `tracking-widest`) intended for uppercase English badges onto Khmer script.
* **Why it breaks:**
  * Khmer script relies on continuous ligature attachments between vowels and consonants. Wide letter-spacing separates diacritic marks from their base characters, making the text unreadable.
* **Code Example & Fix:**
  ```css
  /* ✅ Good: Wide tracking for English, normalized spacing for Khmer */
  .badge-label {
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  [lang="km"] .badge-label {
    letter-spacing: var(--letter-spacing-khmer, 0.02em);
    text-transform: none;
  }
  ```

---

### 7. Flash of Unstyled Text (FOUT) / Faux Bold Rendering
* **Problem:** Text briefly flashes in default Times New Roman / Arial on initial page load, or bold weights render with fuzzy synthesized browser bold.
* **Why it breaks:**
  * Missing Google Fonts preconnect CDN links in `index.html` causes network latency when downloading font files.
  * Requesting a weight not declared in the Google Fonts query (e.g. `font-weight: 500` if only 400 and 700 were imported) forces the browser to generate an artificial "faux bold".
* **Code Example & Fix:**
  ```html
  <!-- frontend/index.html -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..700&family=Poppins:wght@300;400;500;600;700;800;900&family=Battambang:wght@300;400;500;600;700;800;900&display=swap"
    rel="stylesheet"
  />
  ```

---

### 8. Long Text Overflow & Card Grid Misalignment
* **Problem:** Lengthy fragrance names or translated product descriptions push prices and buttons down, breaking uniform card heights in product grids.
* **Why it breaks:**
  * Unbounded title heights cause adjacent cards in CSS grid/flex layouts to have mismatched bottom alignments.
* **Code Example & Fix:**
  ```vue
  <!-- ✅ Good: Clamps text to 2 lines max with uniform line height -->
  <h3 class="text-sm font-bold line-clamp-2 leading-snug" style="color: var(--text); font-family: var(--font-heading);">
    {{ product.name }}
  </h3>
  ```

---

## 🛠 Developer Best Practices & Checklist

When creating or modifying components:

- [ ] **Heading Font:** Use `font-family: var(--font-heading);` for all `<h1>`–`<h6>` and brand titles.
- [ ] **Body Font:** Use `font-family: var(--font-body);` or inherit for copy, inputs, buttons.
- [ ] **Avoid Hardcoded px Font Sizes:** Use `rem`, Tailwind classes (`text-sm`, `text-base`), or `clamp()` for banners.
- [ ] **Check Khmer Rendering:** Switch language to Khmer (`KM`) and verify no text clipping or unnatural wrapping occurs.
- [ ] **Line Clamping:** Use `line-clamp-1` or `line-clamp-2` for dynamic titles in cards and grid items.
- [ ] **Icons:** Use `<i class="ti ti-*">` Tabler icons with matching font size utilities (`text-sm`, `text-lg`).
