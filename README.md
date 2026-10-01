# Hack4Her Website Re-creation

A complete clone of the [Hack4Her](https://hack4her.org/) website, preserving the full frontend design, interactive features, client-side routing, and all static assets.

## Included Pages & Features

- **Home (`/`)**: Hero section, mission statement, upcoming event information, event highlights, past events photo gallery, and sponsor grids (Prosus, VU CS Dept, Bol, Uber, Network Institute, DuckDB, Cloud Nine Digital, PCBway).
- **About Us (`/about`)**: History of Hack4Her, mission statement, and scientific committee member directory.
- **Information (`/information`)**: Event details, comprehensive code of conduct, and interactive FAQs.
- **Schedule (`/schedule`)**: Interactive tabbed schedule (Friday, Saturday, Sunday) with keynote detail modals and workshop links.
- **Registration (`/registration`)**: Step-by-step registration breakdown, eligibility requirements, and direct integration with the Hack4Her Google Form registration.
- **Workshops (`/workshops`)**: Full workshop timetable matrix across rooms (`NU-4B17`, `NU-4B43`, `NU-4B47`, `NU-4B05`, `NU-4B11`) with interactive workshop detail popups & presenter profiles.
- **Challenges (`/challenges`)**: Challenge cards for Uber (*Uber Eats Oracle*), Bol (*The Honest Price Tag*), and Studsec (*Code Red*).
- **Previous Events (`/previous-events`)**: History and link to the previous editions.

## Functionality Recreated

- **SvelteKit SPA & Client-Side Navigation**: Fast transitions between pages using pre-rendered hydration bundles.
- **Dark Mode / Light Mode Toggle**: Preserves theme selection in `localStorage` and respects system `prefers-color-scheme`.
- **Responsive Mobile Navigation**: Collapsible drawer menu with animated hamburger icon.
- **Interactive Modals & Tabs**: Keynote modal, workshop modal, and schedule day switcher.
- **Complete Asset Pipeline**: All high-resolution images, SVG graphics, sponsor logos, event photos, and CSS stylesheets.
- **Direct Mailto Links**: Cleaned obfuscated Cloudflare scripts to restore standard `mailto:info.hack4her@gmail.com` links.

## How to Run

You can serve the website locally with Python:

```bash
# Using the custom development server with clean URL support
python3 serve.py

# Or specify a custom port
python3 serve.py 3000

# Or using Python's built-in HTTP server
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in your web browser.

## Deployment

This site is fully static and can be deployed directly to:
- **GitHub Pages**
- **Vercel**
- **Netlify**
- **Cloudflare Pages**
- **AWS S3 / CloudFront**
- Any Nginx or Apache web server
