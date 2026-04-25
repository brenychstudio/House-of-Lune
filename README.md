# House of Lune

**House of Lune** is a production-oriented luxury jewelry website concept designed as a cinematic digital maison rather than a conventional e-commerce storefront.

The project explores how a premium jewelry brand can communicate rarity, restraint, materiality, and private-client intimacy through editorial hierarchy, dark atmospheric staging, slow motion, multilingual routing, object-led product pages, and a private inquiry flow.

Live project:  
https://house-of-lune.brenychinfo.workers.dev/en

---

## Overview

House of Lune was created as a full premium vertical demo for the luxury jewelry niche.

The site includes:

- cinematic homepage
- curated collection page
- dynamic product detail pages
- craftsmanship narrative
- maison philosophy page
- journal/editorial page
- private contact and inquiry flow
- multilingual routing
- Open Graph metadata
- Cloudflare Workers deployment via OpenNext

The visual direction is based on the idea of a **Moonlit Object Theatre**: a quiet digital stage where jewelry is revealed through darkness, contour, reflection, and deliberate silence.

---

## Project Type

Premium front-end system / luxury brand website concept.

This is not a real jewelry brand or commercial store. It is a portfolio-grade digital maison prototype created to demonstrate premium art direction, interaction design, front-end architecture, and production deployment capability.

---

## Creative Direction

The interface uses a dark editorial visual system with:

- near-black backgrounds
- warm ivory typography
- platinum-like borders
- soft atmospheric light
- restrained image motion
- slow editorial reveals
- object-led product presentation
- private salon language

The goal was to avoid generic luxury templates and standard e-commerce patterns. Products are presented as rare objects within a private maison system rather than as catalog inventory.

---

## Key Pages

### Home

Introduces the maison through a cinematic hero chamber, editorial quote, selected signatures, craftsmanship preview, maison preview, journal preview, and private inquiry CTA.

### Collection

A curated selection of jewelry pieces presented in a calm product grid with editorial pacing and minimal catalog noise.

### Piece Pages

Dynamic product detail pages for individual jewelry pieces. Each page includes hero imagery, material information, image chapters, story/craft copy, and private inquiry CTAs.

### Craftsmanship

An atelier-inspired narrative page with process chapters and a sticky visual stage on desktop, plus responsive fallback layouts on tablet/mobile.

### Maison

A private-house page describing philosophy, material language, and salon atmosphere.

### Journal

An editorial page for campaign studies, house notes, and material observations.

### Contact

A private inquiry page focused on appointments, availability requests, bespoke commissions, and salon-style communication.

---

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Motion
- OpenNext
- Cloudflare Workers
- Cloudflare Wrangler

---

## Technical Highlights

- App Router structure
- Multilingual routes: `/en`, `/fr`, `/es`
- Dynamic product pages: `/[lang]/piece/[slug]`
- Reusable editorial sections
- Shared layout system
- Motion primitives
- Route transition layer
- Private inquiry API route foundation
- Open Graph image integration
- Sitemap and robots support
- Cloudflare Workers deployment through OpenNext

---

## Deployment Note

This project uses **Next.js 16** and is deployed to **Cloudflare Workers** through **OpenNext**.

For Cloudflare runtime stability, the production build uses Webpack:

```json
"build": "next build --webpack"

Local Development

Install dependencies:

npm install

Run local development server:

npm run dev

Build production version:

npm run build

Preview Cloudflare Worker locally:

npm run preview:cf

Deploy to Cloudflare Workers:

npm run deploy:cf
Cloudflare Deployment

The project uses:

open-next.config.ts
wrangler.jsonc

Generated deployment artifacts such as .open-next and .wrangler should not be committed.

Environment Variables

Optional production site URL:

NEXT_PUBLIC_SITE_URL=https://house-of-lune.brenychinfo.workers.dev

If a custom domain is connected, update this value to the final production domain.

Open Graph

The main Open Graph image is expected at:

public/og/house-of-lune-og.png

Production URL:

https://house-of-lune.brenychinfo.workers.dev/og/house-of-lune-og.png
Repository Status

Current status:

deployed prototype
production build passing
Cloudflare Workers deployment working
mobile/tablet responsive QA pass completed
Open Graph metadata layer prepared
portfolio case text prepared
Role

Creative Developer / Premium Front-end Systems Builder

Responsibilities included:

concept implementation
front-end architecture
interface system
responsive layout
motion polish
product page system
multilingual structure
SEO/OG setup
Cloudflare deployment debugging
Portfolio Positioning

House of Lune demonstrates the ability to build a premium front-end system for luxury, jewelry, fashion, boutique retail, and editorial brand experiences.

The project combines visual direction, motion design, component architecture, multilingual routing, dynamic content, and production deployment into one complete digital maison prototype.
