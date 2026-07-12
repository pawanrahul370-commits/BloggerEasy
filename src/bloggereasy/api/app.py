from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory

from bloggereasy import __version__
from bloggereasy.integrations.sdk import generate_from_html_string
from bloggereasy.theme.presets import PRESETS

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.responses import PlainTextResponse
    from pydantic import BaseModel, Field
except ImportError as exc:  # pragma: no cover
    raise ImportError("Install bloggereasy[api] for FastAPI support") from exc

app = FastAPI(title="BloggerEasy", version=__version__)


class HtmlGenRequest(BaseModel):
    html: str = Field(..., min_length=20)
    template: str = "simple"
    title_hint: str | None = None


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "bloggereasy", "version": __version__, "templates": list(PRESETS)}


@app.post("/gen/html")
def gen_html(req: HtmlGenRequest) -> dict:
    if req.template not in PRESETS:
        raise HTTPException(400, f"unknown template {req.template}")
    with TemporaryDirectory() as tmp:
        out = Path(tmp) / "theme.xml"
        result = generate_from_html_string(req.html, out, template=req.template)
        xml = out.read_text(encoding="utf-8")
    return {
        "ok": result["validation"]["ok"],
        "validation": result["validation"],
        "title": result["structure"].get("title"),
        "layout": result["structure"].get("layout"),
        "xml": xml,
        "import_hint": result["import_hint"],
    }


@app.post("/gen/html/raw", response_class=PlainTextResponse)
def gen_html_raw(req: HtmlGenRequest) -> str:
    data = gen_html(req)
    if not data["ok"]:
        raise HTTPException(400, detail=data["validation"])
    return data["xml"]
