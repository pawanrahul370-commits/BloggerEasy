from __future__ import annotations

from pathlib import Path

from typer.testing import CliRunner

from bloggereasy.cli import app
from bloggereasy.integrations.sdk import generate_from_html
from bloggereasy.theme.presets import PRESETS
from bloggereasy.theme.validate import validate_theme_file

SAMPLES = Path(__file__).resolve().parents[1] / "data" / "samples" / "html"
runner = CliRunner()


def test_landing_template_generates_hero_cta_and_features(tmp_path: Path) -> None:
    out = tmp_path / "landing.xml"
    result = generate_from_html(SAMPLES / "landing_saas.html", out, template="landing")
    xml = out.read_text(encoding="utf-8")

    assert "landing" in PRESETS
    assert result["validation"]["ok"] is True
    assert result["structure"]["template"] == "landing"
    assert result["structure"]["features"]["landing"] is True
    assert "Template: landing" in xml
    assert "class='landing-hero'" in xml
    assert "class='landing-cta'" in xml
    assert "class='landing-features'" in xml
    assert "type='Blog'" in xml
    assert "b:skin" in xml
    assert validate_theme_file(out)["ok"] is True


def test_cli_gen_shortcut_landing_template_works_offline(tmp_path: Path) -> None:
    out = tmp_path / "shortcut-landing.xml"
    result = runner.invoke(
        app,
        [
            "gen",
            "--template",
            "landing",
            "--out",
            str(out),
        ],
    )

    assert result.exit_code == 0, result.stdout
    xml = out.read_text(encoding="utf-8")
    assert "class='landing-hero'" in xml
    assert "class='landing-cta'" in xml
    assert "class='landing-features'" in xml
    assert "type='Blog'" in xml
    assert validate_theme_file(out)["ok"] is True


def test_readme_lists_landing_template() -> None:
    readme = (Path(__file__).resolve().parents[1] / "README.md").read_text(encoding="utf-8")

    assert "| `landing` | SaaS/product landing page with hero, CTA, and feature cards |" in readme
