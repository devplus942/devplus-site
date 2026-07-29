import json, re, os

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, "src")
OUT = ROOT
SITE_URL = "https://devplus942.github.io/devplus-site"

head_tpl = open(os.path.join(SRC, "partials", "head.html")).read()
header = open(os.path.join(SRC, "partials", "header.html")).read()
footer = open(os.path.join(SRC, "partials", "footer.html")).read()

page_files = [f for f in os.listdir(os.path.join(SRC, "pages")) if f.endswith(".html")]

for fname in sorted(page_files):
    path = os.path.join(SRC, "pages", fname)
    raw = open(path, encoding="utf-8").read()

    m = re.match(r"<!--META\s*(\{.*?\})\s*-->\s*", raw, re.S)
    if not m:
        raise SystemExit(f"Missing META block in {fname}")
    meta = json.loads(m.group(1))
    body = raw[m.end():]

    canonical = f"{SITE_URL}/{meta['slug']}"
    head = (
        head_tpl.replace("{{TITLE}}", meta["title"])
        .replace("{{DESC}}", meta["desc"])
        .replace("{{CANONICAL}}", canonical)
        .replace("{{SITE_URL}}", SITE_URL)
        .replace("{{SCHEMA}}", json.dumps(meta["schema"], indent=2))
    )

    page_class = meta.get("bodyClass", "")
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
{head}
</head>
<body class="{page_class}">
{header}
<main id="top">
{body}
</main>
{footer}
</body>
</html>
"""
    out_path = os.path.join(OUT, meta["slug"])
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print("built", out_path)
