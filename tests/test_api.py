from __future__ import annotations

import pytest

pytest.importorskip("fastapi")

from fastapi.testclient import TestClient

from bloggereasy.api.app import app

client = TestClient(app)


def test_health() -> None:
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["ok"] is True


def test_gen_html() -> None:
    html = """
    <html><head><title>API Blog</title>
    <style>body{color:#111;background:#fff}a{color:#06c}</style>
    </head><body><h1>API Blog</h1><nav class="menu"><a href="/">Home</a></nav>
    <p>Hello from test.</p></body></html>
    """
    r = client.post("/gen/html", json={"html": html, "template": "simple"})
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert "b:skin" in data["xml"]
