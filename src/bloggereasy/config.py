from __future__ import annotations

import os
from pathlib import Path


def project_root() -> Path:
    return Path(__file__).resolve().parents[2]


def data_dir() -> Path:
    raw = os.getenv("BLOGGEREASY_DATA_DIR", "data")
    path = Path(raw)
    if not path.is_absolute():
        path = project_root() / path
    path.mkdir(parents=True, exist_ok=True)
    return path


SAMPLES_DIR = data_dir() / "samples"
TEMPLATES_DIR = data_dir() / "templates"
OUT_DIR = data_dir() / "out"
