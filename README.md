# BloggerEasy

**BloggerEasy** generates **usable Blogger XML themes** from:

| Input | Output |
| --- | --- |
| **Web HTML** | Layout + CSS + Blogger sections/widgets XML |
| **Design image** | Palette + layout hints → theme scaffold (vision extra) |

Import the exported XML in Blogger → **Theme → Backup/Restore → Upload**.

Built under [mergeos-bounties](https://github.com/mergeos-bounties) for MergeOS MRG bounties.

## Stack

- Python 3.11+
- CLI: `typer` + `rich`
- HTML parse: BeautifulSoup
- Blogger XML builder (sections, gadgets, skin CSS)
- Optional Pillow vision for image → palette

## Quick start

```bash
cd BloggerEasy
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -e ".[dev]"
bloggereasy --help
```

## Commands

```bash
bloggereasy version

# HTML page → Blogger theme XML
bloggereasy gen html --input data/samples/html/minimal_blog.html --out data/out/theme.xml

# Image design → theme scaffold (needs vision extra for real palette)
bloggereasy gen image --input path/to/mockup.png --out data/out/from_image.xml --title "My Blog"

# Inspect parsed HTML structure
bloggereasy parse html --input data/samples/html/minimal_blog.html

# List built-in layout presets
bloggereasy templates list
```

## Layout

```
src/bloggereasy/
  cli.py
  parse/html_page.py     # HTML → structure model
  theme/builder.py       # structure → Blogger XML
  vision/palette.py      # image palette stub
  export/writer.py
  integrations/sdk.py
data/samples/html/
data/templates/
docs/BOUNTY.md
```

## MergeOS bounties

1. Star this repo + [mergeos](https://github.com/mergeos-bounties/mergeos)
2. Claim a `bounty` issue
3. Claim on MergeOS [issue #1](https://github.com/mergeos-bounties/mergeos/issues/1)
4. PR to **BloggerEasy** with tests/evidence
5. Credit MRG 25/50/100/200

See [docs/BOUNTY.md](docs/BOUNTY.md).

## License

MIT
