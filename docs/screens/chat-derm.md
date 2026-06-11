# Screen Spec — DermaScan Chat (Derm)

> A text-based AI skin health assistant — always available, multilingual, scan-aware.  
> **Style:** Warm but clinical. Should feel like texting a knowledgeable doctor friend. Not robotic. Not formal. Concise responses with clear formatting — use bold for condition names, bullet points for steps.

---

## Header

| Position | Element | Details |
|----------|---------|---------|
| Left | Back arrow | Standard navigation back |
| Centre | Title | **"Derm"** (bold) + "AI Skin Assistant" subtitle in muted grey (`#6b7280`) |
| Right | Language toggle | `EN` · `YO` · `HA` · `IG` |
| Name area | Online indicator | Green dot next to name |

---

## Chat Window

- **Background:** Cream (`#f9f5ef`)

### User Bubbles
- Right-aligned
- Background: Dark teal (`#0d6b5e`)
- Text: White
- Border radius: `18px`
- Padding: `12px 16px`

### Derm Bubbles
- Left-aligned
- Background: White card (`#ffffff`)
- Left accent border: Teal (`#0d6b5e`)
- Text: Dark (default body color)
- Border radius: `18px`
- Padding: `12px 16px`

### Metadata
- **Timestamp:** Small muted text (`#6b7280`) below each exchange
- **Avatar:** Small teal circle with letter **"D"** for Derm

---

## Smart Reply Chips

After each Derm response, show **2–3 contextual quick-reply chips**.

**Example** (after an eczema response):
- "What triggers it?"
- "Show me products"
- "Book a doctor"

---

## Scan Context Banner

> Displayed when chat is opened from a scan result.

- **Position:** Top of chat
- **Style:** Teal info banner
- **Content:** `"Chatting about your Eczema scan — 94% confidence"`
- **Extras:** Small thumbnail of scan + "View scan" link
- **Opening message from Derm:**  
  _"I can see your scan flagged moderate eczema on your forearm. What would you like to know?"_

---

## Media Attachments

- **Trigger:** Paperclip icon in input bar
- **Behaviour:** User can attach a photo mid-chat for Derm to analyse inline
- **Derm response flow:**
  1. _"I'll analyse this image..."_ → loading state
  2. Result card rendered inline in chat

---

## Escalation Card

> Triggered when Derm detects severity or user distress.

- **Layout:** Full-width card in chat
- **Headline:** "This may need professional attention."
- **Subtext:** "Connect to a Dermatologist — from ₦2,500"
- **CTA:** Teal button → **"See Available Experts"**

---

## Empty / Welcome State

- Derm avatar centred
- **Greeting:**  
  _"Hi! I'm Derm, your AI skin assistant."_  
  _"Ask me about any skin concern — in English, Yoruba, Hausa, or Igbo."_

### Starter Prompt Cards (2×2 grid)

| | |
|---|---|
| "I have a rash on my arm" | "What causes dark spots?" |
| "Is my condition contagious?" | "Talk to me in Yoruba" |

---

## Input Bar (Sticky Bottom)

| Position | Element | Details |
|----------|---------|---------|
| Centre | Text field | Placeholder: _"Ask Derm anything..."_ |
| Left | Mic icon | Switch to voice mode |
| Left | Attachment icon | Photo upload |
| Right | Send button | Teal circle with arrow icon |

---
