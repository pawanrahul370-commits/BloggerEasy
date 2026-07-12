from __future__ import annotations

from pathlib import Path

import typer
from rich.console import Console
from rich.table import Table

from bloggereasy import __version__
from bloggereasy.config import OUT_DIR, TEMPLATES_DIR
from bloggereasy.integrations.sdk import generate_from_html, generate_from_image
from bloggereasy.parse.html_page import parse_html_file
from bloggereasy.theme.builder import build_blogger_xml, sanitize_filename

app = typer.Typer(
    help="BloggerEasy — generate Blogger XML themes from HTML or images.",
    no_args_is_help=True,
)
gen_app = typer.Typer(help="Generate themes")
parse_app = typer.Typer(help="Parse inputs")
templates_app = typer.Typer(help="Built-in templates")
app.add_typer(gen_app, name="gen")
app.add_typer(parse_app, name="parse")
app.add_typer(templates_app, name="templates")
console = Console()

TEMPLATES = {
    "simple": "Single or two-column classic blog",
    "from-image": "Scaffold from design image palette",
    "magazine": "Magazine-style (alias of simple for now)",
}


@app.command("version")
def version_cmd() -> None:
    console.print(f"BloggerEasy {__version__}")
    console.print(f"Templates: {', '.join(TEMPLATES)}")


@templates_app.command("list")
def templates_list() -> None:
    table = Table(title="Templates")
    table.add_column("Name")
    table.add_column("Description")
    for name, desc in TEMPLATES.items():
        table.add_row(name, desc)
    # also list files under data/templates if any
    if TEMPLATES_DIR.exists():
        for path in sorted(TEMPLATES_DIR.glob("*.xml")):
            table.add_row(path.stem, f"file:{path.name}")
    console.print(table)


@parse_app.command("html")
def parse_html(input: Path = typer.Option(..., "--input", "-i", exists=True, dir_okay=False)) -> None:
    structure = parse_html_file(input)
    console.print_json(data=structure)


@gen_app.command("html")
def gen_html(
    input: Path = typer.Option(..., "--input", "-i", exists=True, dir_okay=False),
    out: Path | None = typer.Option(None, "--out", "-o"),
    template: str = typer.Option("simple", "--template", "-t"),
) -> None:
    out_path = out or (OUT_DIR / f"{sanitize_filename(input.stem)}.xml")
    result = generate_from_html(input, out_path, template=template)
    console.print(f"[green]Wrote[/green] {result['output']} ({result['bytes']} bytes)")
    console.print_json(data={"title": result["structure"]["title"], "layout": result["structure"]["layout"]})


@gen_app.command("image")
def gen_image(
    input: Path = typer.Option(..., "--input", "-i", exists=True, dir_okay=False),
    out: Path | None = typer.Option(None, "--out", "-o"),
    title: str = typer.Option("My Blog", "--title"),
) -> None:
    out_path = out or (OUT_DIR / f"{sanitize_filename(input.stem)}-image.xml")
    result = generate_from_image(input, out_path, title=title)
    console.print(f"[green]Wrote[/green] {result['output']} ({result['bytes']} bytes)")
    console.print_json(
        data={
            "title": result["structure"]["title"],
            "colors": result["structure"]["colors"],
            "from_image": True,
        }
    )


@gen_app.command("preview-css")
def preview_css(
    input: Path = typer.Option(..., "--input", "-i", exists=True, dir_okay=False),
) -> None:
    structure = parse_html_file(input)
    xml = build_blogger_xml(structure)
    # extract skin roughly
    start = xml.find("<![CDATA[")
    end = xml.find("]]>", start)
    if start >= 0 and end > start:
        console.print(xml[start + 9 : end].strip())
    else:
        console.print("[yellow]No skin CDATA found[/yellow]")


if __name__ == "__main__":
    app()
