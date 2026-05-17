import re
from datetime import datetime
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape
from weasyprint import HTML

_TEMPLATE_DIR = Path(__file__).parent / "templates"

_env = Environment(
    loader=FileSystemLoader(str(_TEMPLATE_DIR)),
    autoescape=select_autoescape(["html"]),
)

_BOLD_RE = re.compile(r'\*\*(.+?)\*\*')


def _md_to_html(text: str) -> str:
    text = (
        text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )
    return _BOLD_RE.sub(r'<span class="term">\1</span>', text)


def _clean_value(value):
    if isinstance(value, str):
        return _md_to_html(value)
    if isinstance(value, list):
        return [_clean_value(v) for v in value]
    if isinstance(value, dict):
        return {k: _clean_value(v) for k, v in value.items()}
    return value


def _prepare_content(content: dict) -> dict:
    return _clean_value(content)


def _is_arabic_content(content: dict) -> bool:
    sample = ""
    if isinstance(content, dict):
        for key in ("conclusion", "introduction", "takeaways"):
            val = content.get(key, "")
            if isinstance(val, str):
                sample += val
            elif isinstance(val, list):
                sample += " ".join(str(v) for v in val[:3])
        sections = content.get("sections", [])
        if sections and isinstance(sections[0], dict):
            sample += sections[0].get("heading", "")

    if not sample:
        return False

    arabic = sum(1 for c in sample if "\u0600" <= c <= "\u06FF")
    total  = sum(1 for c in sample if c.isalpha())
    return total > 0 and (arabic / total) > 0.25


def _safe_filename(text: str, max_len: int = 40) -> str:
    slug = re.sub(r"[^\w\s-]", "", text or "document").strip()
    slug = re.sub(r"\s+", "_", slug)
    return slug[:max_len] or "document"


def _render_pdf(template_name: str, context: dict) -> bytes:
    template  = _env.get_template(template_name)
    html_str  = template.render(**context)
    pdf_bytes = HTML(string=html_str, base_url="/").write_pdf()
    return pdf_bytes


def generate_summary_pdf(
    content: dict,
    title: str,
    video_title: str,
    reading_time: dict | None = None,
) -> bytes:
    is_arabic = _is_arabic_content(content)   
    cleaned   = _prepare_content(content) 

    context = {
        "content":      cleaned,
        "title":        title,
        "video_title":  video_title,
        "is_arabic":    is_arabic,
        "generated_at": datetime.now().strftime("%Y-%m-%d"),
        "reading_time": reading_time,
    }
    return _render_pdf("summary.html", context)


def generate_studynotes_pdf(
    content: dict,
    title: str,
    video_title: str,
    reading_time: dict | None = None,
) -> bytes:
    is_arabic = _is_arabic_content(content)
    cleaned   = _prepare_content(content)

    context = {
        "content":      cleaned,
        "title":        title,
        "video_title":  video_title,
        "is_arabic":    is_arabic,
        "generated_at": datetime.now().strftime("%Y-%m-%d"),
        "reading_time": reading_time,
    }
    return _render_pdf("studynotes.html", context)