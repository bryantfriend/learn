"""Create permanent class entry pages and locally generated QR artwork."""
from pathlib import Path
from html import escape
from reportlab.graphics.barcode.qr import QrCodeWidget
from PIL import Image, ImageDraw
import json

root = Path(__file__).resolve().parents[1] / 'study-guides'
sites = [
    ('gp7a', '7a-global-perspectives', '7A Global Perspectives', 'Book 8: research questions, methods, main ideas and paragraph summaries.', '#7247a6'),
    ('gp7b', '7b-global-perspectives', '7B Global Perspectives', 'Book 7: finding information, taking notes and summarising a complete text.', '#a54361'),
    ('gp8', '8-global-perspectives', 'Grade 8 Global Perspectives', 'Book 9: predictions, evidence, perspectives and proposed actions.', '#ad5d20'),
    ('geo7a', '7a-geography', '7A Geography', 'Map, key, ruler, compass rose, directions and simple scale.', '#246b42'),
    ('geo7b', '7b-geography', '7B Geography', 'UK countries and capitals, Great Britain and basic weather.', '#27658d'),
]
qrdir = root / 'qr'
qrdir.mkdir(exist_ok=True)
cards = []
manifest = []
for guide, slug, title, description, colour in sites:
    url = f'https://bryantfriend.github.io/learn/study-guides/{slug}/'
    folder = root / slug
    folder.mkdir(exist_ok=True)
    (folder / 'index.html').write_text(f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<base href="../"><meta name="theme-color" content="{colour}"><title>{title} | Exam study guide</title>
<meta name="description" content="{description}"><link rel="canonical" href="{url}">
<link rel="stylesheet" href="./styles.css?v=compact-1"></head>
<body><div id="app"></div><noscript>Enable JavaScript to explore this class study guide.</noscript>
<script type="module" src="./app.js?v=compact-1"></script></body></html>
''', encoding='utf-8')
    code = QrCodeWidget(url, barLevel='M')
    code.qr.make()
    cells = code.qr.modules
    size = len(cells) + 8
    rects = ''.join(f'<path d="M{x+4} {y+4}h1v1h-1z"/>' for y, row in enumerate(cells) for x, dark in enumerate(row) if dark)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" role="img" aria-label="QR code for {title}"><rect width="{size}" height="{size}" fill="white"/><g fill="black">{rects}</g></svg>'
    (qrdir / f'{slug}.svg').write_text(svg, encoding='utf-8')
    image = Image.new('RGB', (size * 12, size * 12), 'white')
    draw = ImageDraw.Draw(image)
    for y, row in enumerate(cells):
        for x, dark in enumerate(row):
            if dark:
                draw.rectangle(((x+4)*12, (y+4)*12, (x+5)*12-1, (y+5)*12-1), fill='black')
    image.save(qrdir / f'{slug}.png')
    manifest.append(dict(guide=guide, slug=slug, title=title, description=description, url=url))
    cards.append(f'''<article style="--accent:{colour}"><p class="label">EXAM REVISION</p><h2>{title}</h2>
<p>{description}</p><a href="{url}" aria-label="Open {title}"><img src="./{slug}.svg" alt="Scan to open {title}" width="240" height="240"></a>
<p class="scan">Scan. Choose a topic. Test yourself.</p><a class="open" href="{url}">Open study site →</a>
<p class="address">{url}</p><a class="download" href="./{slug}.png" download="{slug}-qr.png">Download QR code (PNG)</a></article>''')
(qrdir / 'sites.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
(qrdir / 'index.html').write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Class study sites · QR cards</title>
<style>*{box-sizing:border-box}body{margin:0;background:#f3f4f0;color:#19353c;font:17px/1.6 'Segoe UI',Arial,sans-serif}header,main{max-width:1200px;margin:auto;padding:32px 24px}header{padding-bottom:8px}h1{font-size:clamp(2rem,5vw,3.5rem);line-height:1.1;margin:12px 0}header p{max-width:760px}button,.open{font:inherit;background:#19353c;color:white;border:0;border-radius:8px;padding:10px 18px;display:inline-block;text-decoration:none;cursor:pointer}a{color:#195e73;text-underline-offset:3px}a:focus-visible,button:focus-visible{outline:3px solid #d98a00;outline-offset:4px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,310px),1fr));gap:22px}article{border:1px solid #d5dcd8;border-top:6px solid var(--accent);background:white;padding:24px;border-radius:12px;text-align:center}h2{font-size:1.5rem;line-height:1.2;color:var(--accent);margin:12px 0}article p{font-size:15px}.label{font-weight:800;letter-spacing:.14em;color:var(--accent);font-size:11px}img{display:block;width:min(100%,240px);height:auto;margin:20px auto}.scan{font-weight:700}.address{overflow-wrap:anywhere;font-size:12px;color:#52666b}.download{font-size:14px}@media print{body{background:white}header{padding:12px 24px}header button,header .back{display:none}main{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding-top:0}article{break-inside:avoid;padding:14px}img{width:170px;margin:10px auto}.download,.open{display:none}h1{font-size:28px}h2{font-size:21px}article p{margin:8px 0;font-size:12px}}
</style></head><body><header><a class="back" href="../">← All study guides</a><h1>Your class. Your study space.</h1><p>Five class sites with illustrated explanations, workbook examples and questions with feedback. No student account is needed. Select a QR code to open the site, or download it for your classroom.</p><button onclick="window.print()">Print QR cards / Save as PDF</button></header><main>''' + ''.join(cards) + '</main></body></html>\n', encoding='utf-8')
print('Created five class sites and five QR codes (SVG + PNG), with printable sharing page.')
