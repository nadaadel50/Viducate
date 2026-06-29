import re

def strip_cjk(text: str) -> str:
    """Remove CJK characters that occasionally leak from LLMs."""
    return re.sub(r'[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af\u3400-\u4dbf]+', '', text).strip()

def sanitize_dict(obj):
    """Recursively strip CJK from all string values in a dict/list structure."""
    if isinstance(obj, str):
        return strip_cjk(obj)
    if isinstance(obj, list):
        return [sanitize_dict(item) for item in obj]
    if isinstance(obj, dict):
        return {k: sanitize_dict(v) for k, v in obj.items()}
    return obj