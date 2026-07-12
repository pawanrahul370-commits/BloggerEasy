from __future__ import annotations

from pathlib import Path

from bloggereasy.export.writer import write_theme
from bloggereasy.parse.html_page import parse_html_file, parse_html_string
from bloggereasy.theme.builder import build_blogger_xml
from bloggereasy.vision.palette import structure_from_image


def generate_from_html(html_path: Path, out_path: Path, *, template: str = "simple") -> dict:
    structure = parse_html_file(html_path)
    xml = build_blogger_xml(structure, template_name=template)
    path = write_theme(xml, out_path)
    return {
        "integration_version": "bloggereasy.sdk.v1",
        "mode": "html",
        "structure": structure,
        "output": str(path),
        "bytes": path.stat().st_size,
    }


def generate_from_html_string(html: str, out_path: Path, *, template: str = "simple") -> dict:
    structure = parse_html_string(html)
    xml = build_blogger_xml(structure, template_name=template)
    path = write_theme(xml, out_path)
    return {
        "integration_version": "bloggereasy.sdk.v1",
        "mode": "html_string",
        "structure": structure,
        "output": str(path),
        "bytes": path.stat().st_size,
    }


def generate_from_image(image_path: Path, out_path: Path, *, title: str = "My Blog") -> dict:
    structure = structure_from_image(image_path, title=title)
    xml = build_blogger_xml(structure, template_name="from-image")
    path = write_theme(xml, out_path)
    return {
        "integration_version": "bloggereasy.sdk.v1",
        "mode": "image",
        "structure": structure,
        "output": str(path),
        "bytes": path.stat().st_size,
    }
