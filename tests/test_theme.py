from __future__ import annotations

from pathlib import Path

from bloggereasy.export.writer import write_theme
from bloggereasy.parse.html_page import parse_html_file
from bloggereasy.theme.builder import build_blogger_xml

SAMPLES = Path(__file__).resolve().parents[1] / "data" / "samples" / "html"


def test_build_xml_contains_blogger_markers(tmp_path: Path) -> None:
    structure = parse_html_file(SAMPLES / "minimal_blog.html")
    xml = build_blogger_xml(structure, template_name="simple")
    assert "xmlns:b=" in xml
    assert "b:skin" in xml
    assert "type='Blog'" in xml or 'type="Blog"' in xml
    assert "Header" in xml
    path = write_theme(xml, tmp_path / "theme.xml")
    assert path.exists()
    assert path.stat().st_size > 500
