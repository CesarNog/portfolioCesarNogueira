# Codebase Overview

This repository contains the source for **Cesar Augusto Nogueira**'s portfolio website. Below is a summary of the main folders and files as well as deployment-related notes.

## Key Directories

- `css/` – Stylesheets used throughout the site.
- `js/` – Client-side scripts. A `vendor/` subfolder stores third‑party libraries such as Font Awesome.
- `images/` – Graphics and assets for the pages (icons, backgrounds, portfolio images, avatars and more).
- `inc/` – Server-side scripts. The main file here is `sendEmail.php` for handling contact form submissions.
- `curriculum/` – Contains downloadable curriculum vitae PDFs.

## Important Files

- `index.html` – Main entry point for the website.
- `index.old.html` and `demo.html` – Older versions or demonstrations of the page layout.
- `README.md` – Repository documentation and license reference.
- `inc/sendEmail.php` – PHP script that validates and sends contact form emails.

## Deployment Notes

- `CNAME` – Specifies the custom domain `cesarnogueira.tech` for GitHub Pages deployment.
- `robots.txt` – Basic crawler directives; disallows `/inc` and `/images` from indexing.
- `sitemap.xml` – XML sitemap listing the website URLs for search engines.
- Additional web‑app manifests and verification files are present (`site.webmanifest`, `googlee1c60bf288bbd3a3.html`).

## Template & License

The site is built from the **Ceevee** theme by [StyleShout](http://www.styleshout.com/). The theme is released under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/), as noted in `README.md` lines 7–10. Always download the latest template files directly from StyleShout's website, as referenced in the README lines 14–17.
