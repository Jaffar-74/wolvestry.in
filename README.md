# WOLVESTRY Shopify Theme — Maintenance Guide

Shopify Online Store 2.0 theme for **Wolvestry** (wolvestry.in). This guide explains how the theme is organised and how to change images, text, links, prices and settings later.

- Repo: https://github.com/Jaffar-74/wolvestry.git
- Live editing: Shopify Admin → **Online Store → Themes → Customize**
- Code editing: change files in this folder, commit, push. Shopify syncs the `main` branch when the theme is connected via **Add theme → Connect from GitHub**.

---

## 1. Folder map

| Folder / file | What it controls |
|---|---|
| `layout/theme.liquid` | Global HTML shell, fonts, colour variables, base CSS, meta tags, favicon |
| `layout/password.liquid` | Password ("opening soon") page shell |
| `sections/` | Every block of a page (hero, featured, bestsellers, header, footer…). Each file has `{% schema %}` at the bottom that defines what the merchant can edit |
| `snippets/` | Reusable pieces: `wolvestry-card.liquid` (product card), `wolvestry-icons.liquid` (SVG icons) |
| `templates/*.json` | Which sections appear on which page, and in what order. Edited mainly from the theme editor |
| `templates/customers/*.json` | Account, login, register, order and address pages |
| `sections/header-group.json`, `footer-group.json` | Header and footer that appear on every page |
| `config/settings_schema.json` | Global theme settings (logo, colours, fonts, social links, free-shipping threshold, etc.) |
| `config/settings_data.json` | Saved values of those settings. Shopify rewrites this when you save in the editor |
| `locales/en.default.json` | Default translation strings (button labels, form messages, etc.) |
| `assets/` | `wolvestry.css`, `wolvestry.js`, `Logo.png` (uploaded logo source file) |
| `images/` | Design reference files only. **Not used by the live theme** |
| `preview.html` | Static offline mock-up for viewing the design in a browser. **Not used by Shopify** |

---

## 2. How to find the right section

1. Open the page in **Shopify Admin → Customize** (the theme editor). The left panel lists the sections in order.
2. Click a section name. The matching file is the one with the same name in `sections/`.
   - Example: "Hero" on the homepage = `sections/wolvestry-hero.liquid`
   - Example: the page top bar = `sections/wolvestry-header.liquid` (it lives in `header-group.json`)
3. To find where a piece of text lives, search the `sections/` folder for it (Ctrl+Shift+F in VS Code). Example: search `BUILT FOR THE BOLD` to find the story section.

Section → page map:

| Page | Template file | Sections (in order) |
|---|---|---|
| Homepage | `templates/index.json` | hero, featured, bestsellers, story, reviews, instagram, newsletter |
| Product | `templates/product.json` | wolvestry-product, wolvestry-related-products |
| Collection | `templates/collection.json` | wolvestry-collection-banner, wolvestry-collection-grid |
| About / generic page | `templates/page.json` | wolvestry-page |
| Contact | `templates/page.contact.json` | wolvestry-contact-form |
| Size guide | `templates/page.size-guide.json` | wolvestry-size-guide |
| FAQ | `templates/page.faq.json` | wolvestry-faq |
| Cart | `templates/cart.json` | wolvestry-cart |
| Search | `templates/search.json` | wolvestry-search |
| 404 | `templates/404.json` | wolvestry-404 |
| Password | `templates/password.json` | wolvestry-password |
| Blog / article | `templates/blog.json`, `article.json` | wolvestry-blog, wolvestry-article |

---

## 3. Changing images

### 3.1 Logo
- **Preferred (no code):** Theme editor → **Theme settings → Logo** → upload `Logo.png` (or an SVG). Set **Logo width**.
- The header and footer read `settings.logo`. If no logo is uploaded they fall back to the text "WOLVESTRY".
- Favicon: **Theme settings → Favicon** (512×512 square PNG).

### 3.2 Section images (hero, featured tiles, story, Instagram)
Images are **not** stored in the code. Upload them in the theme editor:
- **Hero:** Hero section → *Desktop image* and *Mobile image*. Optional *Video URL* (YouTube/Vimeo) overrides the image.
- **Featured tiles:** Featured section → each tile block → choose a **Product** or **Collection**. The tile image comes from that product/collection automatically. Use *Image* on the block to override it.
- **Story:** Story section → *Image*.
- **Instagram:** Instagram section → add up to 6 *Image* blocks.
- **Product photos:** Shopify Admin → **Products → [product] → Media**. The first image is the main image, the second is the hover image on cards.

### 3.3 Image sizes that look best
- Hero: 1920 × 1080 or larger (landscape). Mobile hero: portrait.
- Product cards: 4:5 portrait (e.g. 1200 × 1500).
- Instagram / square: 1:1.
- Story: 3:4 portrait.

### 3.4 Changing the hero background in code (optional)
The offline preview uses `images/background.webp`. To change it in `preview.html`, edit:
```html
<img class="hero-bg" src="images/background.webp" ...>
```
Replace the file in `images/` or change the path. This does **not** change the live Shopify site.

---

## 4. Changing text and copy

Two places:

1. **Theme editor (preferred):** Click the section → edit the text field. Most copy is editable here (headings, subtext, button labels, review text, FAQ questions, footer description).
2. **Code defaults:** Each section's `{% schema %}` block contains `"default": "..."`. These are the values shown before the merchant edits anything. Change them there, e.g. in `sections/wolvestry-hero.liquid`:
   ```json
   { "type": "text", "id": "heading", "label": "Heading", "default": "WEAR THE WILD." }
   ```
3. **Translations:** Button labels and form messages come from `locales/en.default.json`, read with `{{ 'sections.newsletter.button_default' | t }}`.

Brand rule: copy must stay **unisex**. Do not write "men's" or "masculine".

---

## 5. Making links work

### 5.1 Links set in the theme editor (these work automatically)
- Hero button, story button, Instagram URL, announcement bar link, featured tile links: pick a **Product**, **Collection**, **Page** or paste a **URL** in the setting.
- Social icons: **Theme settings → Social media** (Instagram, X, YouTube, Facebook, Pinterest).

### 5.2 Menus managed in Shopify Navigation (recommended)
1. Shopify Admin → **Online Store → Navigation**.
2. Edit **Main menu** (header) and the footer menus.
3. Add/remove items. The theme's `link_list` settings read these menus.

### 5.3 Links hardcoded in code (must be edited in files)
These are **not yet** driven by Navigation and must be changed in code:

| Link | File | Current value |
|---|---|---|
| Header Home / Shop / About / Contact | `sections/wolvestry-header.liquid` (around lines 448–480) | `/`, `/collections/all`, `/pages/about`, `/pages/contact` |
| Header SHOP dropdown | same file (around lines 455–472) | `/collections/new-arrivals`, `/collections/bestsellers`, `/collections/tops`, `/collections/bottoms`, `/collections/outerwear`, `/collections/accessories` |
| Mobile drawer menu | same file (around lines 515–540) | same paths as above |
| Empty cart link | `sections/wolvestry-cart.liquid` | `/collections/all` |
| Collection grid link | `sections/wolvestry-collection-grid.liquid` | `/collections/all` |

To change one, edit the `href` value, e.g. `href="/pages/about"` → `href="/pages/our-story"`.

**Handles must match Shopify exactly.** The collection handle is the URL slug shown in Admin → Products → Collections → (collection) → URL. The collections must exist (see Section 7) or the link returns a 404.

**Recommended fix (later):** replace the hardcoded header links with `{% for link in linklists.main-menu.links %}` so they are edited in Navigation.

### 5.4 Newsletter, contact and password forms
- Newsletter uses `{% form 'customer' %}` with the tag `newsletter`. Submissions create customers tagged `newsletter`.
- The **WELCOME10** discount is created in Shopify Admin → **Discounts** and sent by a Shopify Email automation. The theme does not create it.
- Contact form uses `{% form 'contact' %}` and sends to the store email set in **Settings → Store details**. Set it to `hello@wolvestry.in`.

### 5.5 Testing links
Run `shopify theme dev --store <store>.myshopify.com` and click every link. Use `shopify theme check` to catch broken Liquid.

---

## 6. Changing prices and rates

**Prices are never typed into the theme.** They come from Shopify products, so change them in Admin:

- Shopify Admin → **Products → [product] → Pricing** (price and compare-at price for sale).
- Prices are shown tax-inclusive (GST). Set this in **Settings → Taxes and duties**.

### 6.1 Free shipping threshold
- Theme editor → **Theme settings → Cart → Free shipping threshold**.
- Value is in **paise** (₹999 = `99900`). Default is `99900`.
- The cart progress bar reads this setting.
- The **announcement bar text** ("FREE SHIPPING ON ORDERS ABOVE ₹999") is plain text. Update it in the announcement bar section in the editor, or in the default in `sections/wolvestry-announcement-bar.liquid`.
- The **product shipping tab** text (`templates/product.json`, the "SHIPPING & RETURNS" block) also says ₹999. Update it in the product template editor.
- Shipping rates themselves are set in Shopify Admin → **Settings → Shipping and delivery** (Shiprocket app).

### 6.2 Discount codes
- WELCOME10 (10%, one use per customer): Shopify Admin → **Discounts**.

### 6.3 Currency
- Shopify Admin → **Settings → Markets** → India, INR.

---

## 7. Store data to create in Shopify Admin (not in theme code)

- **Products:** Wolf Series Jacket ₹4,999 (new), Pack Hoodie ₹2,499 (new), Shadow Tee ₹1,299, Alpha Tee ₹1,299 (bestseller), Wolf Joggers ₹1,999 (bestseller), Instinct Shirt ₹1,799 (new). Tag all `unisex`. Sizes XS–XXL.
- **Smart collections** (Products → Collections → Create → Automated):
  - New Arrivals: tag = `new`
  - Bestsellers: tag = `bestseller`
  - Tops: product type = T-Shirt / Shirt / Hoodie / Sweatshirt
  - Bottoms: product type = Joggers
  - Outerwear: product type = Jacket
  - Accessories: product type = Accessories
- **Pages:** About (`/pages/about`), Contact (`/pages/contact`), Size guide, FAQ, Shipping & Returns. Create each in Online Store → Pages and assign the matching template.
- **Policies:** Refund, Privacy, Terms, Shipping (Settings → Policies).

---

## 8. Reviews

- The reviews section is **hidden until you add real reviews**. Do not add placeholder reviews.
- Add review blocks in the theme editor (Worn by the Pack section), or install **Judge.me** and place its app block.

---

## 9. Changing colours, fonts and layout

- **Colours:** Theme settings → Colors. Brand tokens are defined in `layout/theme.liquid` (`--wv-black`, `--wv-bone`, `--wv-gunmetal`, `--wv-muted`, `--wv-panel`, `--wv-oxblood`).
- **Fonts:** Theme settings → Typography (Barlow Condensed headings, Inter body).
- **Page width, section spacing, corner radius:** Theme settings → Layout.
- **Animations on/off:** Theme settings → Animations.

---

## 10. Making code changes and pushing to GitHub

```powershell
cd C:\wolvestry
git status
git add -A
git commit -m "Describe the change"
git push origin main
```

Shopify picks up the new commit on `main` within a minute. Check **Online Store → Themes** for the sync status.

Before pushing, run:
```powershell
shopify theme check
```
It must show no errors.

---

## 11. Local preview

- Open `preview.html` in a browser for a quick static visual check. It does **not** show live products, prices or links.
- For the real theme with live data: `shopify theme dev --store <store>.myshopify.com`.

---

## 12. Known gaps to fix in a future update

1. Header and footer navigation links are hardcoded (Section 5.3). Move them to Navigation.
2. Some copy is in code defaults (announcement bar, product shipping text). Consider moving to settings.
3. `preview.html` is a separate static mock-up and can drift from the Liquid sections. Treat the Liquid sections as the source of truth.
4. Newsletter section compares `color_scheme` to `'dark'` / `'light'`, while the other sections use `scheme-1` / `scheme-2`. Align these before relying on the scheme picker for that section.

---

## 13. Quick reference

| I want to change… | Where |
|---|---|
| Logo | Theme settings → Logo |
| Hero image / text / button | Theme editor → Hero section |
| Product photos | Shopify Admin → Products → Media |
| Product price | Shopify Admin → Products → Pricing |
| Free shipping amount (bar) | Theme settings → Cart + announcement bar text |
| Menu links | Shopify Admin → Navigation (or code, Section 5.3) |
| Social links | Theme settings → Social media |
| Newsletter discount | Shopify Admin → Discounts (WELCOME10) |
| Colours / fonts | Theme settings |
| Header/footer code | `sections/wolvestry-header.liquid`, `wolvestry-footer.liquid` |
| Section layout code | `sections/wolvestry-*.liquid` |
| Page section order | `templates/*.json` or theme editor |
