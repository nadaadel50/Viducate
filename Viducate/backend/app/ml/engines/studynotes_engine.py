import json
import logging
import re
import time
from groq import Groq
from app.config import settings
from app.utils.text_sanitizer import sanitize_dict, strip_cjk
from app.services.network_errors import NetworkUnavailableError, with_network_retry

logger = logging.getLogger(__name__)

MODEL = "llama-3.3-70b-versatile"

STUDYNOTES_JSON_STRUCTURE = json.dumps(
    {
        "title": "Study Notes: <topic name>",
        "introduction": "2-3 sentence overview of what the student will learn from these notes.",
        "sections": [
            {
                "heading": "Section heading in target language",
                "explanation": [
                    {
                        "text": "Key technical term",
                        "type": "term",
                        "tooltip": "Short definition of the term",
                    },
                    {"text": " is a concept that ...", "type": "normal"},
                    {
                        "text": "Important person or idea",
                        "type": "important",
                        "tooltip": "Why this person/idea matters",
                    },
                    {"text": ".", "type": "normal"},
                ],
                "definitions": [
                    {"term": "Term 1", "meaning": "Clear one-sentence definition"},
                    {"term": "Term 2", "meaning": "Clear one-sentence definition"},
                ],
                "examples": [
                    "Concrete example illustrating the concept",
                    "Another real-world example",
                ],
                "tables": [
                    {
                        "title": "Comparison table title",
                        "headers": ["Column A", "Column B"],
                        "rows": [["Value 1", "Value 2"], ["Value 3", "Value 4"]],
                    }
                ],
                "notes": [
                    "Important tip or reminder about this concept",
                    "Common mistake to avoid",
                ],
            }
        ],
    },
    indent=2,
)


def _get_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)


def _clean_json(raw: str) -> str:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return raw.strip()


def _lang_instruction(language: str) -> str:
    if language == "ar":
        return (
            "Respond in Arabic. "
            "Keep all technical terms, code keywords, and established English terminology in English as-is. "
            "Section headings, explanations, definitions, examples, notes, and the introduction must be in Arabic. "
            "Do NOT transliterate English terms into Arabic letters."
            "STRICT PROHIBITION: Do NOT output any Chinese, Japanese, Korean, or other CJK characters.\n\n"
            "TECHNICAL TERMS RULE — the following categories MUST remain in English exactly as-is, "
            "never translated or transliterated into Arabic:\n"
            "  - Algorithm names: Linear Search, Binary Search, Bubble Sort, Merge Sort, Quick Sort, etc.\n"
            "  - Data structures: Array, Stack, Queue, Linked List, Tree, Graph, Heap, Hash Table, etc.\n"
            "  - Complexity notation: Big O, O(n), O(log n), O(1), O(n^2), Time Complexity, Space Complexity\n"
            "  - Programming concepts: Loop, Recursion, Pointer, Variable, Function, Class, Object, etc.\n"
            "  - CS/Math concepts: Binary, Index, Node, Edge, Path, Depth, Height, Matrix, Vector, etc.\n"
            "  - Any term that appears in English in the original video content\n\n"
            "CORRECT examples:\n"
            "  ✓ heading: 'Time Complexity و Big O Notation'\n"
            "  ✓ term block: text='Linear Search', tooltip='خوارزمية بحث تمر على كل عنصر واحداً تلو الآخر'\n"
            "  ✓ important block: text='Binary Search', tooltip='تعمل فقط على القوائم المترتبة'\n"
            "  ✓ normal block: ' أسرع من Linear Search — Time Complexity هي O(log n)'\n"
            "  ✓ definition: term='Stack', meaning='هيكل بيانات يعمل بمبدأ LIFO'\n"
            "  ✓ example: 'مثال على Time Complexity: Linear Search = O(n), Binary Search = O(log n)'\n"
            "  ✓ note: 'تذكر: Binary Search تتطلب قائمة مترتبة، أما Linear Search فلا'\n"
            "WRONG examples (never do this):\n"
            "  ✗ 'تعقيد الوقت'    → should be 'Time Complexity'\n"
            "  ✗ 'البحث الخطي'    → should be 'Linear Search'\n"
            "  ✗ 'البحث الثنائي'  → should be 'Binary Search'\n"
            "  ✗ 'المكدس'         → should be 'Stack'\n"
            "  ✗ 'الرسم البياني'  → should be 'Graph'\n"
            "  ✗ 'تدوين Big O'    → should be 'Big O Notation'\n"
            "  ✗ 'مبدأ LIFO'      → 'LIFO' stays in English but 'مبدأ' (principle) in Arabic is fine\n"
        )
    return "Respond in English."


def _build_segment_prompt(
    segment_title: str,
    main_topic: str,
    subtopics: list[dict],
    language: str,) -> str:
    lang_note = _lang_instruction(language)

    subtopics_text = "\n".join(
        f"  - {st['name']}: {st.get('description', '')[:300]}"
        for st in subtopics
        if st.get("name")
    )

    return f"""You are an expert educational content writer creating STUDY NOTES for students.

    {lang_note}

    INPUT:
    Segment Title: {segment_title}
    Main Topic: {main_topic}
    Subtopics:
    {subtopics_text}

    STRICT REQUIREMENTS:
    1. Extract all important terms, concepts, people, and ideas from the content.
    2. For the "explanation" array, mix "term" blocks (technical words with tooltip), "important" blocks
    (key people or pivotal ideas with tooltip), and "normal" blocks (connecting prose).
    The explanation blocks must flow as readable sentences when concatenated.
    3. "definitions" must only include terms that appear in the content.
    4. "examples" must be concrete and relate to the content — do NOT invent unrelated examples.
    5. "tables" are OPTIONAL. Only include a table if the content has a clear comparison or list
    that benefits from tabular format. Omit the "tables" key entirely if not needed.
    6. "notes" are study tips, warnings, or memory aids derived from the content.
    7. Do NOT hallucinate information not present in the input.
    8. Return ONLY valid JSON — no markdown, no extra text.

    Use this EXACT structure (field names must match exactly):
    {STUDYNOTES_JSON_STRUCTURE}

    The output must have exactly ONE section per main subtopic group (or one unified section if the
    segment covers a single tightly-coupled topic).
    """


def _build_video_prompt(
    video_title: str,
    segments: list[dict],
    language: str,) -> str:
    lang_note = _lang_instruction(language)

    segments_text = ""
    for seg in segments:
        segments_text += f"\n--- Segment {seg['segment_number']}: {seg['title']} ---\n"
        segments_text += f"Main topic: {seg.get('main_topic', seg['title'])}\n"
        for st in seg.get("subtopics", []):
            desc = st.get("description", "")[:200]
            segments_text += f"  • {st['name']}: {desc}\n"
        for kp in seg.get("key_points", []):
            if kp:
                segments_text += f"  Key point: {kp}\n"

    return f"""You are an expert educational content writer creating comprehensive STUDY NOTES for a full video lecture.

    {lang_note}

    Video Title: {video_title}

    SEGMENTS:
    {segments_text}

    STRICT REQUIREMENTS:
    1. Create one section in "sections" per major topic (roughly one per segment, but merge
    closely related segments).
    2. Each section must have: heading, explanation (rich-text array), definitions, examples, notes.
    3. "tables" are optional — include only where a comparison genuinely helps understanding.
    4. The "introduction" field must be 2-3 sentences summarising the whole video for a student.
    5. The "title" field must be: "Study Notes: <video title>".
    6. explanation blocks must flow as readable prose when concatenated.
    7. Do NOT hallucinate. All content must come from the segments data above.
    8. Return ONLY valid JSON — no markdown, no extra text.

    Use this EXACT structure:
    {STUDYNOTES_JSON_STRUCTURE}
    """


def _call_with_retry(client: Groq, prompt: str, max_retries: int = 3) -> str:
    for attempt in range(max_retries):
        try:
            response = with_network_retry(
                lambda: client.chat.completions.create(
                    model=MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=2500,
                    temperature=0.3,
                ),
                context="StudyNotesEngine Groq call",
            )
            return response.choices[0].message.content or ""
        except NetworkUnavailableError:
            raise
        except Exception as e:
            err = str(e).lower()
            if "rate_limit" in err or "429" in err:
                wait = 30 * (attempt + 1)
                logger.warning(
                    f"[StudyNotesEngine] Rate limited, waiting {wait}s (attempt {attempt+1})"
                )
                time.sleep(wait)
            else:
                logger.error(f"[StudyNotesEngine] Groq error attempt {attempt+1}: {e}")
                if attempt == max_retries - 1:
                    raise
    return ""


def _parse(raw: str) -> dict | None:
    try:
        result = json.loads(_clean_json(raw))
        return sanitize_dict(result)
    except json.JSONDecodeError:
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            try:
                return sanitize_dict(json.loads(match.group()))
            except Exception:
                pass
    return None


def _is_valid(data) -> bool:
    if not isinstance(data, dict):
        return False
    if not data.get("title") or not data.get("introduction"):
        return False
    sections = data.get("sections")
    if not isinstance(sections, list) or len(sections) == 0:
        return False
    for sec in sections:
        if not sec.get("heading") or not isinstance(sec.get("explanation"), list):
            return False
    return True


def generate_segment_studynotes(
    segment_title: str,
    main_topic: str,
    subtopics: list[dict],
    language: str = "en",) -> dict | None:
 
    client = _get_client()
    prompt = _build_segment_prompt(segment_title, main_topic, subtopics, language)

    logger.info(
        f"[StudyNotesEngine] Generating segment notes | "
        f"title='{segment_title}' | lang={language}"
    )

    raw = _call_with_retry(client, prompt)
    if not raw:
        logger.error("[StudyNotesEngine] Empty response from Groq")
        return None

    data = _parse(raw)
    if not _is_valid(data):
        logger.error(f"[StudyNotesEngine] Invalid response structure. raw={raw[:300]}")
        return None

    return data


def generate_video_studynotes(
    video_title: str,
    segments: list[dict],
    language: str = "en",) -> dict | None:

    CHUNK_SIZE = 5
    client = _get_client()

    seg_chunks = [segments[i: i + CHUNK_SIZE] for i in range(0, len(segments), CHUNK_SIZE)]
    logger.info(
        f"[StudyNotesEngine] Generating video notes | title='{video_title}' | "
        f"segments={len(segments)} | chunks={len(seg_chunks)} | lang={language}"
    )

    all_sections = []
    introduction = None
    title = f"Study Notes: {video_title}"

    for chunk_idx, chunk in enumerate(seg_chunks):
        prompt = _build_video_prompt(video_title, chunk, language)
        raw = _call_with_retry(client, prompt)

        if not raw:
            logger.warning(f"[StudyNotesEngine] Empty response for chunk {chunk_idx + 1}")
            continue

        data = _parse(raw)
        if not _is_valid(data):
            logger.warning(
                f"[StudyNotesEngine] Invalid structure for chunk {chunk_idx + 1}"
            )
            continue

        if introduction is None:
            introduction = data.get("introduction", "")
            title = data.get("title", title)

        all_sections.extend(data.get("sections", []))

        if chunk_idx < len(seg_chunks) - 1:
            time.sleep(4)

    if not all_sections:
        logger.error("[StudyNotesEngine] No sections generated for video")
        return None

    return {
        "title": title,
        "introduction": introduction or "",
        "sections": all_sections,
    }