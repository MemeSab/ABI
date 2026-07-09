# Abigail Stocks Coaching – Website & Resources Codebase

This repository contains the source code for the landing page of **Abigail Stocks | Healthy Habits Coach** (`https://memesab.github.io/ABI/`). It is designed as a fast, lightweight, static site built with HTML5, CSS3 (Vanilla), and ES6+ JavaScript.

---

## 📂 Project Structure

- `index.html` — The main website landing page and modal definitions.
- `style.css` — Custom design system, layout tokens, and page styling.
- `script.js` — Client-side logic for the navigation drawer, testimonial lightbox, and form controllers.
- `assets/` — Directory containing image assets and the compiled PDF lead magnet.
- `movement-mindset-guide.html` — The source HTML template for the printable 16-page workbook.
- `build-pdf.js` — Compilation script to build the print-ready PDF using Google Chrome.
- `.github/workflows/static.yml` — Automated Pages deploy actions pipeline.

---

## 🛠️ Getting Started & Local Preview

To preview the website on your local machine:
1. Open your terminal in the project directory.
2. Start the local server:
   ```bash
   python3 -m http.server 8000
   ```
3. Open your browser and navigate to: **`http://localhost:8000/`**

---

## 📄 How to Rebuild the PDF Guide

The *Movement & Mindset Guide* workbook is compiled from a single HTML/CSS document (`movement-mindset-guide.html`) designed for exact A4 proportions.

To make edits and rebuild the PDF:
1. Make your visual or content modifications directly inside `movement-mindset-guide.html`.
2. Ensure you have **Google Chrome** installed in your `/Applications/` directory (macOS).
3. In the terminal, run the build utility:
   ```bash
   node build-pdf.js
   ```
4. The script will automatically compile your changes and replace the file at `assets/movement-mindset-guide.pdf`.

---

## 🔒 Security & Spam Prevention

### 1. Honeypot Spam Protection
All forms on the landing page contain a hidden input field:
```html
<input type="text" name="_honey" style="display:none">
```
Spam bots crawl forms and automatically fill out all available fields, whereas human users cannot see this input. FormSubmit automatically checks this field; if it is filled, the submission is silently blocked as spam.

### 2. Hiding Your Email (Recommended)
Currently, form submissions send requests directly to FormSubmit using your raw email address:
`https://formsubmit.co/ajax/abigailstockscoaching@gmail.com`

To prevent scraper bots from harvesting your email from the public GitHub repository:
1. Go to [FormSubmit.co](https://formsubmit.co/).
2. Submit a test form on the website once.
3. Check your email and click **Confirm** in the verification email FormSubmit sends you.
4. Once verified, FormSubmit will provide you with a random alphanumeric hash key (e.g. `2a78fbc3d...`).
5. Replace your email address in `script.js` with this hash key:
   `https://formsubmit.co/ajax/YOUR_HASH_KEY`
   Your forms will continue to routing to your email, but your raw email address will be completely hidden from public eyes.

### 3. Content Security Policy (CSP)
A secure CSP meta tag is embedded in the head of `index.html` to block cross-site scripting (XSS) and only allow connections to trusted endpoints (like FormSubmit and Google Fonts):
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://formsubmit.co;">
```
