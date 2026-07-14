# BloggerEasy

[![Python 3.11+](https://img.shields.io/badge/python-3.11%2B-blue.svg)](https://www.python.org/downloads/)
[![Version](https://img.shields.io/badge/version-0.3.0-0E8A16.svg)](pyproject.toml)
[![Qt GUI](https://img.shields.io/badge/GUI-PySide6-41CD52.svg)](src/bloggereasy/gui/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![MergeOS](https://img.shields.io/badge/MergeOS-bounties-5319E7.svg)](https://github.com/mergeos-bounties)

**BloggerEasy** turns a **website URL** or a **design image** into an **importable Blogger XML theme** — layout, CSS skin, sections, and widgets ready for Blogger → Theme → Backup/Restore → Upload.

**Product:** [mergeos-bounties/BloggerEasy](https://github.com/mergeos-bounties/BloggerEasy)

```text
URL  ──┐
       ├──► parse / palette ──► Blogger XML theme ──► upload to Blogger
Image ─┘
```

---

## Table of contents

- [Highlights](#highlights)
- [Desktop GUI (Qt)](#desktop-gui-qt)
- [Screenshots](#screenshots)
- [Quick start](#quick-start)
- [CLI reference](#cli-reference)
- [Templates & samples](#templates--samples)
- [Import into Blogger](#import-into-blogger)
- [Diagrams](#diagrams)
- [Repository layout](#repository-layout)
- [Development](#development)
- [MergeOS bounties](#mergeos-bounties)
- [License](#license)

---

## Highlights

| Capability | Description |
| --- | --- |
| **URL → theme** | Fetch a public page → structure → validated Blogger XML |
| **Image → theme** | Sample palette from a mockup/screenshot → theme skin |
| **HTML file** | Offline local HTML samples or your own page |
| **Templates** | `simple`, `portfolio`, `news`, `dark`, `magazine`, `from-image` |
| **Desktop GUI** | Modern **PySide6** app (`bloggereasy-gui`) |
| **Validate** | Check theme XML before upload |
| **Offline demo** | `bloggereasy demo` batch-generates all bundled samples |

---

## Desktop GUI (Qt)

Beautiful dark **PySide6** app for the main product flow: **paste URL** or **pick design image** → choose style template → **export `.xml`** → import in Blogger.

```powershell
pip install -e ".[gui]"
bloggereasy-gui
# or: bloggereasy gui
```

| Tab | Purpose |
| --- | --- |
| **Create theme** | Mode: Website URL · Design image · Local HTML |
| **Output** | Path, validation, XML preview, open file/folder |
| **Templates** | Pick preset style |
| **Import to Blogger** | Step-by-step restore instructions |
| **Sample demo** | Offline batch from `data/samples/html` |

<p align="center">
  <img src="docs/screenshots/gui-convert-url.png" alt="BloggerEasy GUI — URL input" width="100%" />
</p>
<p align="center"><em>Create theme from a public website URL</em></p>

<p align="center">
  <img src="docs/screenshots/gui-convert-image.png" alt="BloggerEasy GUI — Image input" width="100%" />
</p>
<p align="center"><em>Create theme from a design image (palette → skin)</em></p>

<p align="center">
  <img src="docs/screenshots/gui-result.png" alt="BloggerEasy GUI — Output XML" width="100%" />
</p>
<p align="center"><em>Generated Blogger XML ready to upload</em></p>

<p align="center">
  <img src="docs/screenshots/gui-import.png" alt="BloggerEasy GUI — Import guide" width="100%" />
</p>
<p align="center"><em>How to restore the theme in Blogger</em></p>

---

## Screenshots

CLI / offline demo captures:

| Batch | Portfolio | News |
| :---: | :---: | :---: |
| ![Batch](docs/screenshots/demo-batch.png) | ![Portfolio](docs/screenshots/demo-portfolio.png) | ![News](docs/screenshots/demo-news_portal.png) |
| *Demo batch table* | *Portfolio sample* | *News portal* |

---

## Quick start

```powershell
cd BloggerEasy
python -m venv .venv
.\.venv\Scripts\activate
pip install -e ".[dev,gui]"

bloggereasy version
bloggereasy-gui                 # recommended: URL or image → XML
bloggereasy demo                # offline sample batch
```

### CLI one-shots

```powershell
# From a public URL
bloggereasy gen url -u "https://example.com/" -t portfolio -o data/out/from_url.xml

# From a design image (Pillow via [gui] or [vision])
bloggereasy gen image -i path\to\mockup.png --title "My Blog" -o data/out/from_image.xml

# From local HTML
bloggereasy gen html -i data/samples/html/portfolio.html -t portfolio

# From a public HTML page through the html command
bloggereasy gen html --url "https://example.com/" --timeout 10 -t portfolio -o data/out/from_url.xml
```

Respect robots.txt, site Terms of Service, and rate limits when fetching public URLs.

---

## CLI reference

| Command | Purpose |
| --- | --- |
| `bloggereasy version` | Version + template names |
| `bloggereasy gui` / `bloggereasy-gui` | **Qt app** (needs `.[gui]`) |
| `bloggereasy demo` | Themes for all `data/samples/html/*.html` |
| `bloggereasy templates list` | Built-in presets |
| `bloggereasy gen url -u …` | URL → XML |
| `bloggereasy gen image -i …` | Image → XML |
| `bloggereasy gen html -i …` | HTML file → XML |
| `bloggereasy validate -f …` | Validate theme XML |
| `bloggereasy serve` | Optional FastAPI |

---

## Templates & samples

| Template | Best for |
| --- | --- |
| `simple` | Clean default blog |
| `portfolio` | Portfolio / personal brand |
| `news` | Dense editorial |
| `magazine` | Magazine-style two-column |
| `dark` | Dark developer look |
| `from-image` | Image palette (auto for image mode) |

Bundled HTML samples: `data/samples/html/` (`portfolio`, `news_portal`, `dark_dev`, `magazine`, …).

Respect site Terms of Service when fetching live URLs.

---

## Import into Blogger

1. Open [Blogger](https://www.blogger.com/) → your blog → **Theme**.  
2. **⋮** → **Backup** (save current theme first).  
3. **Restore** / **Upload** the generated `.xml` (default under `data/out/`).  
4. Confirm — layout, CSS, and widgets apply.  
5. Preview and fine-tune under Theme customize if needed.

---

## SEO defaults

Generated themes include safe Blogger head placeholders for common search and
social previews:

- `description` uses `data:blog.metaDescription`
- Open Graph site/title/description/url tags use Blogger data expressions
- Twitter summary card title and description mirror the Blogger page metadata

These snippets do not hard-code a domain, image, or author profile. Edit the
generated XML after export if a blog needs custom preview images or verification
tokens.

---

## Diagrams

System architecture and workflow — full width. Open HTML for dark/light theme.

### Architecture

[Open interactive diagram](docs/diagrams/architecture.html)

<p align="center">
  <img src="docs/diagrams/architecture.svg" alt="BloggerEasy architecture" width="100%" />
</p>

### Workflow

[Open interactive diagram](docs/diagrams/workflow.html)

<p align="center">
  <img src="docs/diagrams/workflow.svg" alt="BloggerEasy workflow" width="100%" />
</p>

*Generated with [archify](https://github.com/tt-a1i).*

---

## Repository layout

```text
src/bloggereasy/
  cli.py              # Typer CLI
  gui/                # PySide6 desktop (URL / image / HTML → XML)
  parse/              # HTML parse + URL fetch
  vision/palette.py   # Image → colors
  theme/              # presets, builder, validate
  integrations/sdk.py # generate_from_url / image / html
data/samples/html/
data/out/             # generated themes
docs/screenshots/
docs/diagrams/
```

---

## Development

```powershell
pytest -q
ruff check src tests
bloggereasy demo
python scripts/capture_gui_shots.py   # refresh GUI screenshots
```

---

## MergeOS bounties

Star → claim bounty → PR to **master** with theme XML evidence → MRG **25–200**.  
See [mergeos](https://github.com/mergeos-bounties/mergeos) · [docs/BOUNTY.md](docs/BOUNTY.md).

---

## Export HTML normalization

Messy exported HTML (Figma / site exporters) is cleaned automatically before
theme generation via `bloggereasy.parse.normalize.normalize_export_html()`,
wired into `parse_html_string()` so every entry point (CLI, GUI, API, SDK)
benefits. It strips `<script>` tags, caps oversized inline `<style>` blocks, and
rewrites absolute `file://` / `localhost` / `127.0.0.1` paths — while leaving
already-clean HTML untouched (idempotent). See issue #14.

---

## License

MIT · MergeOS / ThanhTrucSolutions
