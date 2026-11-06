# SE Primer — Design System & Visual Specification (`DESIGN.md`)

## 1. Visual Identity & Conceptual Foundations

### The "Diamond Age" Metaphor
In Neal Stephenson's *The Diamond Age*, the Illustrated Primer is an interactive, responsive book bound in dark leather with pages that emit an intelligent inner light. When opened, it does not lecture; it weaves the reader into living scenarios and projects a holographic, watchful mentor that shapes the reader's character through inquiry and real consequences.

**SE Primer** translates this metaphor into modern software engineering education:
- **The Book Surface:** Deep navy and charcoal surfaces evoke the quiet, serious atmosphere of an illuminated digital handbook in a darkened incident room.
- **The Lantern Light:** Warm amber and radiant orange accents represent knowledge, human judgment, and the warmth of the glowing book pages.
- **The Holographic Tutor:** Subtle cyan and celestial teal luminous accents highlight Socratic AI interactions, representing intelligent machine guidance.
- **The Terminal of Truth:** Clean monospaced telemetry blocks represent raw production infrastructure reality (logs, metrics, timestamps, and error traces).

---

## 2. Color Palette & Design Tokens

```css
:root {
  /* Surface Foundations */
  --primer-bg-abyss: #07090E;       /* Deepest background, total immersion */
  --primer-bg-base: #0B0F19;        /* Main screen background */
  --primer-bg-surface: #111827;     /* Component and card surfaces */
  --primer-bg-elevated: #1F2937;    /* Elevated cards, modals, dropdowns */
  --primer-bg-overlay: rgba(11, 15, 25, 0.85);

  /* Primary Amber / Orange Accent (The Illuminating Flame) */
  --primer-amber-50: #FFFBEB;
  --primer-amber-100: #FEF3C7;
  --primer-amber-300: #FCD34D;
  --primer-amber-400: #FBBF24;
  --primer-amber-500: #F59E0B;      /* Core amber brand token */
  --primer-amber-600: #D97706;
  --primer-amber-glow: rgba(245, 158, 11, 0.18);

  /* Cyan Accent (The Socratic Holographic Tutor) */
  --primer-cyan-300: #67E8F9;
  --primer-cyan-400: #22D3EE;
  --primer-cyan-500: #06B6D4;       /* Core AI tutor accent */
  --primer-cyan-600: #0891B2;
  --primer-cyan-glow: rgba(6, 182, 212, 0.16);

  /* Semantic State Colors */
  --primer-danger: #EF4444;         /* Crisis alerts, regression errors */
  --primer-danger-glow: rgba(239, 68, 68, 0.18);
  --primer-success: #10B981;        /* Safe recovery, clean tests */
  --primer-success-glow: rgba(16, 185, 129, 0.18);
  --primer-warning: #F59E0B;        /* 60s timer countdown */

  /* Typography Colors */
  --primer-text-primary: #F3F4F6;   /* Pure crisp text */
  --primer-text-secondary: #9CA3AF; /* Meta details, subtitles */
  --primer-text-muted: #6B7280;     /* Incidental stamps, inactive tags */
  --primer-text-accent: #FCD34D;    /* Warm highlighted technical terms */

  /* Border & Stroke Accents */
  --primer-border-subtle: rgba(255, 255, 255, 0.08);
  --primer-border-amber: rgba(245, 158, 11, 0.35);
  --primer-border-cyan: rgba(6, 182, 212, 0.35);
}
```

---

## 3. Typography Hierarchy

| Style Role | Font Family | Size (Mobile / Desktop) | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| **Display Title** | Serif / Book Antiqua / Merriweather / Georgia | 26px / 36px | Bold (700) | 1.25 | Book header, dramatic crisis titles |
| **Section Header**| Sans-serif (Inter / System) | 18px / 22px | SemiBold (600) | 1.35 | Step titles, decision prompts |
| **Body Reading**  | Sans-serif (Inter / System) | 15px / 16px | Regular (400) | 1.6 | Narrative context, consequences |
| **Code / Logs**   | JetBrains Mono / Fira Code / monospace | 13px / 14px | Medium (500) | 1.5 | Stack traces, KVKK log dumps, metrics |
| **Tutor Inquiries**| Sans-serif Italic (Inter / Georgia) | 14px / 15px | Medium Italic | 1.55 | Socratic reflective questions |

---

## 4. Component System

### 1. `PrimerCard`
- **Description:** Foundational container mimicking an illuminated parchment leaf set in modern dark glass.
- **Attributes:** Dark navy background (`#111827`), 1px subtle border (`rgba(255, 255, 255, 0.08)`), rounded-xl (`12px`), smooth transition on hover with amber glow.

### 2. `DecisionButton`
- **Description:** Interactive decision card presenting options A and B with clear visual affordances.
- **Attributes:** Distinct letter badge (A/B) with amber fill on active/focus, crisp typography, technical risk descriptor, active keyboard navigation (`Enter` / `Space`).

### 3. `SocraticTutorDrawer / Panel`
- **Description:** Contextual mentor interface with cyan holographic glow, avatar indicator ("AI Rehber"), input query bar, and collapsible suggestion chips.
- **Attributes:** Pulsing cyan indicator, structured response bubble highlighting the Socratic question, contextual hint, and theoretical concept tag.

### 4. `TelemetryTicker`
- **Description:** Real-time crisis banner displaying:
  - System Clock: `08:00 AM` -> `08:12 AM` -> `08:18 AM` -> `08:25 AM`.
  - Impact Counter: `300 Hastalar Beklemede` (300 patients waiting).
  - Outage Health Status: `KRİTİK (HTTP 500 / 502)`.
  - Experienced Countdown: 60-second radial or linear countdown bar.

### 5. `ConsequenceModal / Card`
- **Description:** Appears immediately upon making a decision to explain "Ne Oldu & Neden Oldu" (technical mechanics of the choice) before advancing.

---

## 5. Spacing & Grid System
- **Scale:** 4px base (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Container Max-Width:**
  - Mobile: `100%` with `16px` horizontal padding (`px-4`).
  - Tablet/Desktop: `768px` for focused single-column book experience, or `1120px` for split-pane scenario/tutor layout.
- **Touch Targets:** Minimum `48px x 48px` on all mobile clickable elements.

---

## 6. Mobile Screen Specifications (Stitch Reference Models)

### Screen 1: Mobile Onboarding (Giriş Ekranı)
- **Viewport:** 390px x 844px (iPhone 14 / modern smartphone).
- **Layout Architecture:**
  - **Header:** Top crest featuring glowing lantern icon and title: *"SE Primer: Yazılım Mühendisliği, Oynanan Bir Kitap"*.
  - **Subtext:** *"Her seçim bir durum geçişi. Her son bir kabul kriteri."*
  - **Question 1 (Seviye / Experience):** 3-way segment buttons (`Yeni Başladım [Beginner]`, `Orta Düzey [Intermediate]`, `Deneyimliyim [Experienced (60s timer)]`).
  - **Question 2 (Rol / Role):** Scrollable role selector pills (`Frontend`, `Backend`, `Full Stack`, `Yazılım Müh.`, `Öğrenci`).
  - **Question 3 (Öğrenme Hedefi / Goal):** 4 selectable goal cards with concise icons (`Mimari Kararlar`, `Test Stratejileri`, `KVKK ve Güvenlik`, `Teknik Problem Çözme`).
  - **Action Button:** Full-width glowing amber CTA: *"Krize Başla (08:00)"*.

### Screen 2: Mobile Scenario & Decisions (Kriz & Karar Ekranı)
- **Viewport:** 390px x 844px.
- **Layout Architecture:**
  - **Crisis Bar (Sticky Top):** Displays `🕒 08:00` | `⚠️ 300 Hasta Bekliyor` | `🚨 KRİTİK`. If Experienced, shows amber `⏳ 58s` countdown.
  - **Book Narrative Card:**
    - Dark parchment container with subtle amber border.
    - Title: *"Karar 1: Dağıtım Çöküşü & Mimari"*
    - Narrative text detailing the midnight deployment failure and database timeouts.
    - Monospace log snippet: `ERROR 500: Column 'appointment_slot_v2' not found on table 'appointments'`.
  - **Decision Options Stack:**
    - Card A: **[A] Eski sürüme geri dön (Rollback)** — *v2.3.9 sürümüne güvenli geri dönüş tetikle.*
    - Card B: **[B] Canlıda yama yap (Hotfix)** — *Doğrudan sunucuya bağlan ve kodu yerinde düzelt.*
  - **Socratic AI Companion (Collapsible Bottom Drawer):**
    - Floating cyan pill: *"AI Rehber'e Danış"* (opens tutor drawer).
    - Tutor prompt: *"Geri dönmeden önce veritabanı şemasının geriye dönük uyumlu olup olmadığını nasıl doğrularsın?"*

### Screen 3: Mobile Final Outcome & Post-Mortem (Sonuç & Kabul Kriteri Ekranı)
- **Viewport:** 390px x 844px.
- **Layout Architecture:**
  - **Banner:**
    - If Ending A: Emerald luminous emblem with checkmark: *"SON A: 08:25 Sistem Ayakta, Veri Güvende"*.
    - If Ending B: Amber/Red alert shield: *"SON B: 08:45 Sistem Risk Altında / KVKK İhlali"*.
  - **Post-Mortem Timeline:**
    - Chronological decision audit trail showing choices made at 08:00, 08:12, and 08:18.
    - Badges for each decision: Architectural Safety, Test Coverage, KVKK Compliance.
  - **Tutor Final Debrief:**
    - Socratic summary analyzing the learner's decision patterns.
  - **Action CTA:** Secondary outline button *"Senaryoyu Yeniden Başlat"*.

---

## 7. Accessibility & Motion Guidelines
- **WCAG 2.1 AA Compliance:** Minimum 4.5:1 text-to-background contrast ratio on all informational text.
- **Keyboard Navigation:** Full tab order throughout onboarding, decision cards, and tutor inputs.
- **Screen Readers:** ARIA live regions for the countdown timer and dynamic crisis state changes.
- **Reduced Motion:** Respects `prefers-reduced-motion: reduce` by disabling ambient glowing pulses and animated transitions.
