# DermaScan — Design System

## Brand Identity

**App name:** DermaScan  
**Visual style reference:** Oyster Skin (oysterskin.com) — minimal, data-forward, high whitespace, clinical-meets-warm, premium feel  
**Platform:** Mobile-first (iOS + Android)  
**User context:** Nigerian individuals with limited dermatology access. Low-bandwidth environments. Fitzpatrick IV–VI primary skin tones.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#0d6b5e` | Dark Teal/Green — buttons, active states, accents |
| **Background** | `#f9f5ef` | Cream/Off-white — page backgrounds |
| **Card Surface** | `#ffffff` | White cards with shadow `0 2px 12px rgba(0,0,0,0.08)` |
| **Success** | `#4caf87` | Positive outcomes, low severity |
| **Warning** | `#e8a838` | Moderate severity, caution states |
| **Danger** | `#e05252` | High severity, errors, critical alerts |
| **Muted Text** | `#6b7280` | Secondary text, timestamps, subtitles |

---

## Typography

| Element | Weight | Size | Notes |
|---------|--------|------|-------|
| **Headlines** | Bold (700) | 28–32px | Page titles |
| **Subheadings** | Semibold (600) | 18–20px | Section headers |
| **Body** | Regular (400) | 14–16px | General content |
| **Metrics/Scores** | Extra-bold (800) | Variable | Hero elements — treat as focal points |

**Font style:** Clean modern sans-serif

---

## Components

### Cards
- Border radius: `16px`
- Padding: `20–24px` (generous)
- Shadow: `0 2px 12px rgba(0,0,0,0.08)` (subtle)
- No harsh borders

### Buttons
- **Primary:** Full-width, teal (`#0d6b5e`) background, white text, `16px` border radius
- **Secondary:** Outlined teal border, transparent background
- **Rule:** No competing button colors on the same screen

### Icons
- Minimal line-style
- Colors: Teal (`#0d6b5e`) or muted grey (`#6b7280`)

### Chips / Badges
- Pill shape (fully rounded)
- Color-coded by severity (success / warning / danger)

### Bottom Navigation
- Maximum 5 items
- Active state: Teal (`#0d6b5e`)

---
