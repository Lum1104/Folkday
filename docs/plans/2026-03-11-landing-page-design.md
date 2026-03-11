# Folkday Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an App Store-style landing page for Folkday (节知) that drives APK downloads, deployed to `lum1104.github.io/Folkday`.

**Architecture:** Astro static site generator with a single-page scroll layout. All content in one `index.astro` page with CSS modules. Images copied from `assets/` to `website/public/`. GitHub Actions deploys to GitHub Pages on push to main.

**Tech Stack:** Astro 5.x, pure CSS (no Tailwind), GitHub Actions, GitHub Pages

---

### Task 1: Scaffold Astro Project

**Files:**
- Create: `website/package.json`
- Create: `website/astro.config.mjs`
- Create: `website/tsconfig.json`
- Create: `website/src/pages/index.astro` (placeholder)
- Create: `website/src/layouts/Layout.astro`

**Step 1: Initialize Astro project**

```bash
cd /Users/yuxianglin/Desktop/opensource/Folkday
mkdir -p website
cd website
npm create astro@latest -- --template minimal --no-install --no-git .
```

**Step 2: Configure Astro for GitHub Pages subdirectory**

Edit `website/astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://lum1104.github.io',
  base: '/Folkday',
});
```

**Step 3: Install dependencies**

```bash
cd /Users/yuxianglin/Desktop/opensource/Folkday/website
npm install
```

**Step 4: Verify dev server starts**

```bash
cd /Users/yuxianglin/Desktop/opensource/Folkday/website
npx astro dev --host 0.0.0.0 &
sleep 3
curl -s http://localhost:4321/Folkday/ | head -20
kill %1
```

Expected: HTML output with Astro boilerplate.

**Step 5: Commit**

```bash
git add website/
git commit -m "feat(website): scaffold Astro project for landing page"
```

---

### Task 2: Copy Assets and Create Layout

**Files:**
- Create: `website/public/images/` (copy screenshots and icon from `assets/`)
- Modify: `website/src/layouts/Layout.astro`

**Step 1: Copy image assets**

```bash
mkdir -p /Users/yuxianglin/Desktop/opensource/Folkday/website/public/images
cp /Users/yuxianglin/Desktop/opensource/Folkday/assets/folkday_icon.png website/public/images/
cp /Users/yuxianglin/Desktop/opensource/Folkday/assets/screenshot-calendar.png website/public/images/
cp /Users/yuxianglin/Desktop/opensource/Folkday/assets/screenshot-detail.png website/public/images/
cp /Users/yuxianglin/Desktop/opensource/Folkday/assets/screenshot-customs.png website/public/images/
cp /Users/yuxianglin/Desktop/opensource/Folkday/assets/screenshot-regions.png website/public/images/
cp /Users/yuxianglin/Desktop/opensource/Folkday/assets/screenshot-reminders.png website/public/images/
```

**Step 2: Create base Layout component**

Write `website/src/layouts/Layout.astro` with:
- HTML5 boilerplate with `lang="zh-CN"`
- Meta tags: viewport, description, charset, Open Graph tags
- Favicon pointing to folkday_icon.png
- Google Fonts import: Noto Sans SC (Chinese) + Inter (English)
- CSS reset and global variables slot
- `<slot />` for page content

Key CSS variables to define:
```css
:root {
  --color-chaoshan: #C0392B;
  --color-minnan: #E67E22;
  --color-guangfu: #D4A017;
  --color-kejia: #27826B;
  --color-text: #2C2C2C;
  --color-text-secondary: #666666;
  --color-bg: #FAFAF8;
  --font-cn: 'Noto Sans SC', sans-serif;
  --font-en: 'Inter', sans-serif;
}
```

**Step 3: Verify layout renders**

Update `website/src/pages/index.astro` to use Layout with a test heading. Run dev server, verify in browser or curl.

**Step 4: Commit**

```bash
git add website/public/images/ website/src/layouts/Layout.astro website/src/pages/index.astro
git commit -m "feat(website): add layout, CSS variables, and image assets"
```

---

### Task 3: Build Hero Section

**Files:**
- Modify: `website/src/pages/index.astro`

**Step 1: Implement Hero section**

Content:
- App icon (80px round) + "节知 Folkday" title
- Chinese slogan: "让年轻人不再错过家乡的每一个传统节日"
- English subtitle: "Never miss a hometown festival"
- Stats row: "196 个节日 · 4 大文化地区 · 双历显示"
- CTA button: "下载 APK / Download APK" → `https://github.com/lum1104/Folkday/releases/latest`
- Phone mockup: `screenshot-calendar.png` in a styled phone frame (CSS border-radius + shadow)

CSS approach:
- Centered flex column layout
- Gradient background using the 4 region colors at low opacity
- Phone mockup with subtle float animation (`@keyframes float`)
- Responsive: stack vertically on mobile, side-by-side on desktop (screenshot right, text left)

**Step 2: Verify Hero renders correctly**

Run dev server, check at `http://localhost:4321/Folkday/`.

**Step 3: Commit**

```bash
git add website/src/pages/index.astro
git commit -m "feat(website): add Hero section with phone mockup"
```

---

### Task 4: Build Features Section

**Files:**
- Modify: `website/src/pages/index.astro`

**Step 1: Implement Features section**

Section title: "功能亮点 / Features"

Four feature cards in a 2x2 grid (stacks to 1 column on mobile):

1. **双历显示 Dual Calendar**
   - Description: "农历/公历同步显示，节气标注一目了然"
   - English: "Synchronized Lunar & Gregorian calendar with solar terms"
   - Image: `screenshot-calendar.png`

2. **四大文化地区 Four Regions**
   - Description: "潮汕、闽南、广府、客家，196个传统节日全覆盖"
   - English: "Chaoshan, Minnan, Guangfu, Kejia — 196 festivals covered"
   - Image: `screenshot-regions.png`

3. **节日详情与民俗 Festival Details**
   - Description: "详尽的节日来源、民俗习惯和祭祀准备清单"
   - English: "Rich festival origins, customs, and preparation guides"
   - Image: `screenshot-detail.png`

4. **智能提醒 Smart Reminders**
   - Description: "按节日重要程度分级提醒，再也不会错过"
   - English: "Tiered reminders by importance — never miss a festival"
   - Image: `screenshot-reminders.png`

CSS approach:
- Each card: screenshot on one side, text on the other, alternating left/right
- Cards have subtle border and shadow
- Screenshots displayed in phone frame style (same as hero)
- Scroll-triggered fade-in animation using `IntersectionObserver` (tiny inline `<script>`)

**Step 2: Verify Features section**

Dev server check.

**Step 3: Commit**

```bash
git add website/src/pages/index.astro
git commit -m "feat(website): add Features section with 4 feature cards"
```

---

### Task 5: Build Regions Section

**Files:**
- Modify: `website/src/pages/index.astro`

**Step 1: Implement Regions section**

Section title: "四大文化地区 / Regional Cultures"

Four horizontal color blocks, each with:
- Region color as background (with white text)
- Chinese name + English name
- Festival count: "XX 个传统节日"
- A subtle pattern or icon to differentiate

Layout: 4 cards in a row (2x2 on tablet, 1 column on mobile), each card uses its region color.

```
| 潮汕 Chaoshan   | 闽南 Minnan     | 广府 Guangfu    | 客家 Kejia      |
| 41 个传统节日     | 66 个传统节日    | 44 个传统节日    | 45 个传统节日    |
```

CSS: hover scale effect, border-radius, consistent card height.

**Step 2: Verify Regions section**

Dev server check.

**Step 3: Commit**

```bash
git add website/src/pages/index.astro
git commit -m "feat(website): add Regions section with color cards"
```

---

### Task 6: Build Footer and Download CTA

**Files:**
- Modify: `website/src/pages/index.astro`

**Step 1: Implement download CTA + footer**

**Download CTA band:**
- Background: subtle gradient
- Text: "开始探索你的家乡节日 / Start exploring your hometown festivals"
- Large download button (same style as hero)

**Footer:**
- GitHub icon + link to `https://github.com/lum1104/Folkday`
- "AGPL-3.0 License · Made with ❤️ for cultural preservation"
- "© 2025 Folkday 节知"

**Step 2: Verify footer**

Dev server check.

**Step 3: Commit**

```bash
git add website/src/pages/index.astro
git commit -m "feat(website): add download CTA and footer"
```

---

### Task 7: Polish — Responsive Design and Animations

**Files:**
- Modify: `website/src/pages/index.astro` (styles section)

**Step 1: Add responsive breakpoints**

```css
/* Mobile first, then: */
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

Key responsive adjustments:
- Hero: text centered on mobile, side-by-side on desktop
- Features: single column on mobile, 2-col grid on desktop
- Regions: 1-col mobile, 2-col tablet, 4-col desktop
- Font sizes scale down on mobile

**Step 2: Add scroll animations**

Small inline `<script>` using `IntersectionObserver`:
- Fade-in-up for feature cards and region cards as they enter viewport
- CSS classes: `.animate-on-scroll` + `.is-visible`

**Step 3: Test on multiple viewport sizes**

Verify at 375px (iPhone), 768px (tablet), 1440px (desktop).

**Step 4: Commit**

```bash
git add website/src/pages/index.astro
git commit -m "feat(website): polish responsive design and scroll animations"
```

---

### Task 8: GitHub Actions Deployment Workflow

**Files:**
- Create: `.github/workflows/deploy-website.yml`

**Step 1: Write deployment workflow**

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'
      - '.github/workflows/deploy-website.yml'
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: website/package-lock.json

      - name: Install dependencies
        working-directory: website
        run: npm ci

      - name: Build
        working-directory: website
        run: npx astro build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: website/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: Verify workflow syntax**

```bash
cd /Users/yuxianglin/Desktop/opensource/Folkday
cat .github/workflows/deploy-website.yml | python3 -c "import sys,yaml; yaml.safe_load(sys.stdin); print('Valid YAML')"
```

**Step 3: Commit**

```bash
git add .github/workflows/deploy-website.yml
git commit -m "ci: add GitHub Actions workflow for website deployment"
```

---

### Task 9: Build Verification

**Step 1: Run production build**

```bash
cd /Users/yuxianglin/Desktop/opensource/Folkday/website
npx astro build
```

Expected: Clean build with output in `website/dist/`.

**Step 2: Preview production build**

```bash
cd /Users/yuxianglin/Desktop/opensource/Folkday/website
npx astro preview &
sleep 2
curl -s http://localhost:4321/Folkday/ | head -5
kill %1
```

Expected: Rendered HTML page.

**Step 3: Verify all images load**

```bash
ls -la /Users/yuxianglin/Desktop/opensource/Folkday/website/dist/images/
```

Expected: All 6 images present.

**Step 4: Final commit if any fixes needed**

```bash
git add -A website/
git commit -m "fix(website): build verification fixes"
```
