#!/usr/bin/env python3
"""
Hack4Her Base Path Configurator for GitHub Pages & Custom Domains

Usage:
  python3 configure_base.py /                 # Root domain
  python3 configure_base.py /h4h-showcase     # GitHub Pages repo subfolder
"""

import os
import re
import sys
import shutil

ROUTES = [
    'about', 'challenges', 'information', 'previous-events',
    'registration', 'schedule', 'workshops'
]

def configure(base_url):
    base_url = base_url.strip()
    if base_url == '/' or base_url == '':
        base = ''
    else:
        base = '/' + base_url.strip('/')

    print(f"Configuring base path as: '{base or '/'}'")

    # 1. Ensure .nojekyll exists and has content
    with open('.nojekyll', 'w') as f:
        f.write("# Disable Jekyll for GitHub Pages to publish _app directory\n")
    print("Created/updated .nojekyll")

    # 2. Ensure 'app' folder is synchronized with '_app'
    if os.path.exists('_app'):
        if os.path.exists('app'):
            shutil.rmtree('app')
        shutil.copytree('_app', 'app')
        # Update app/immutable/chunks/VnNBZrFm.js
        chunk = 'app/immutable/chunks/VnNBZrFm.js'
        if os.path.exists(chunk):
            with open(chunk, 'r', encoding='utf-8') as f:
                c = f.read()
            c = c.replace('/_app/', '/app/')
            with open(chunk, 'w', encoding='utf-8') as f:
                f.write(c)
        print("Synchronized 'app/' directory (Jekyll-safe)")

    # 3. Process all root HTML files
    root_html_files = [
        'index.html', 'about.html', 'challenges.html', 'information.html',
        'previous-events.html', 'registration.html', 'schedule.html',
        'workshops.html', '404.html'
    ]

    for fname in root_html_files:
        if not os.path.exists(fname):
            continue
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()

        # Reset all assets and scripts to root first (handling both _app and app)
        content = re.sub(r'href="[^"]*/_?app/', 'href="/app/', content)
        content = re.sub(r'href="[^"]*/images/', 'href="/images/', content)
        content = re.sub(r'src="[^"]*/images/', 'src="/images/', content)
        content = re.sub(r'src="[^"]*/_?app/', 'src="/app/', content)
        content = re.sub(r'src="[^"]*/theme-switcher\.js"', 'src="/theme-switcher.js"', content)
        content = re.sub(r'src="[^"]*/gallery-scroll\.js"', 'src="/gallery-scroll.js"', content)
        content = re.sub(r'src="[^"]*/schedule-tabs\.js"', 'src="/schedule-tabs.js"', content)
        content = re.sub(r'href="[^"]*/favicon\.png"', 'href="/favicon.png"', content)
        content = re.sub(r'import\("[^"]*/_?app/', 'import("/app/', content)
        content = re.sub(r'base:\s*"[^"]*"', 'base: ""', content)

        # Reset navigation links
        content = re.sub(r'href="[^"]*/about"', 'href="/about"', content)
        content = re.sub(r'href="[^"]*/challenges"', 'href="/challenges"', content)
        content = re.sub(r'href="[^"]*/information"', 'href="/information"', content)
        content = re.sub(r'href="[^"]*/previous-events"', 'href="/previous-events"', content)
        content = re.sub(r'href="[^"]*/registration"', 'href="/registration"', content)
        content = re.sub(r'href="[^"]*/schedule"', 'href="/schedule"', content)
        content = re.sub(r'href="[^"]*/workshops"', 'href="/workshops"', content)
        content = re.sub(r'href="[^"]*/"', 'href="/"', content)

        # Apply new base if non-empty
        if base:
            content = content.replace('href="/app/', f'href="{base}/app/')
            content = content.replace('href="/images/', f'href="{base}/images/')
            content = content.replace('src="/images/', f'src="{base}/images/')
            content = content.replace('src="/app/', f'src="{base}/app/')
            content = content.replace('src="/theme-switcher.js"', f'src="{base}/theme-switcher.js"')
            content = content.replace('src="/gallery-scroll.js"', f'src="{base}/gallery-scroll.js"')
            content = content.replace('src="/schedule-tabs.js"', f'src="{base}/schedule-tabs.js"')
            content = content.replace('href="/favicon.png"', f'href="{base}/favicon.png"')
            content = content.replace('import("/app/', f'import("{base}/app/')
            content = content.replace('base: ""', f'base: "{base}"')

            # Nav links
            content = content.replace('href="/"', f'href="{base}/"')
            for r in ROUTES:
                content = content.replace(f'href="/{r}"', f'href="{base}/{r}"')

        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {fname}")

    # 4. Synchronize subfolder index.html files
    subfolder_map = {
        'about': 'about.html',
        'challenges': 'challenges.html',
        'information': 'information.html',
        'previous-events': 'previous-events.html',
        'registration': 'registration.html',
        'schedule': 'schedule.html',
        'workshops': 'workshops.html'
    }

    for folder, src_html in subfolder_map.items():
        if os.path.exists(folder) and os.path.exists(src_html):
            target = os.path.join(folder, 'index.html')
            shutil.copyfile(src_html, target)
            print(f"Synced {target} from {src_html}")

    # 5. Update SvelteKit navigation chunks in both _app and app
    b = base if base else ""
    new_routes_js = f'const e={{home:"{b}/",about:"{b}/about",registration:"{b}/registration",information:"{b}/information",schedule:"{b}/schedule",workshops:"{b}/workshops",challenges:"{b}/challenges",previousEvents:"{b}/previous-events"}};t=[{{title:"Home",route:e.home}},{{title:"About Us",route:e.about}},{{title:"Information",route:e.information}},{{title:"Schedule",route:e.schedule}},{{title:"Registration",route:e.registration}},{{title:"Workshops",route:e.workshops}},{{title:"Challenges",route:e.challenges}},{{title:"Previous Events",route:e.previousEvents}}];export{{t as n,e as r}};'

    for d in ['_app', 'app']:
        chunk_path = f'{d}/immutable/chunks/1z13vIjT.js'
        if os.path.exists(chunk_path):
            with open(chunk_path, 'w', encoding='utf-8') as f:
                f.write(new_routes_js)
            print(f"Updated routes chunk in {chunk_path}")

    print("\n[SUCCESS] Configuration complete for GitHub Pages!")

if __name__ == '__main__':
    base_arg = sys.argv[1] if len(sys.argv) > 1 else '/h4h-showcase'
    configure(base_arg)
