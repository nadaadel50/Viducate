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
CHUNK_SIZE = 5         
DETAIL_WORDS = 10      
LABEL_WORDS  = 6      

def _split_transcript_vs_slides(description: str) -> tuple[str, str]:
    parts = description.split("|") if "|" in description else [description]
    transcript_parts = []
    slide_parts = []
    for part in parts:
        part = part.strip()
        if not part:
            continue
        ar = sum(1 for c in part if '\u0600' <= c <= '\u06FF')
        alpha = sum(1 for c in part if c.isalpha())
        if ar > 0:
            transcript_parts.append(part)
        else:
            slide_parts.append(part)
    return " ".join(transcript_parts), " ".join(slide_parts)


def _detect_language(segments: list[dict]) -> str:
    transcript_arabic = 0
    transcript_english = 0
    slide_english = 0

    for seg in segments:
        # Segment-level labels (title / main_topic / key_points)
        for text in [seg.get("main_topic", ""), seg.get("title", "")] + seg.get("key_points", []):
            for ch in text:
                if '\u0600' <= ch <= '\u06FF':
                    transcript_arabic += 1
                elif ch.isalpha():
                    transcript_english += 1

        for st in seg.get("sub_topics", []):
            for ch in st.get("name", ""):
                if '\u0600' <= ch <= '\u06FF':
                    transcript_arabic += 1
                elif ch.isalpha():
                    transcript_english += 1

            
            transcript_text, slide_text = _split_transcript_vs_slides(
                st.get("description", "")
            )
            for ch in transcript_text:
                if '\u0600' <= ch <= '\u06FF':
                    transcript_arabic += 1
                elif ch.isalpha():
                    transcript_english += 1
            for ch in slide_text:
                if ch.isalpha():
                    slide_english += 1

    total_transcript = transcript_arabic + transcript_english

    logger.debug(
        f"[MindmapEngine] Lang detection: "
        f"transcript_ar={transcript_arabic} transcript_en={transcript_english} "
        f"slide_en={slide_english}"
    )

    if total_transcript == 0:
        return "en"

    ar_ratio = transcript_arabic / total_transcript

    # mixed 
    if ar_ratio >= 0.25:
        if slide_english > 50:
            return "mixed"
        return "ar"

    return "en"


def _lang_instruction(language: str) -> str:
    if language == "ar":
        return (
            "The lecture is in ARABIC.\n"
            "Rules for labels:\n"
            "  - Write explanatory labels in Arabic.\n"
            "  - Keep established technical/English terms exactly as-is "
            "(e.g. 'Defuzzification', 'Centroid', 'Mamdani', 'fuzzy set'). "
            "Do NOT transliterate them into Arabic letters.\n"
            "  - If a subtopic name or key point is already in English, keep it in English."
            "STRICT PROHIBITION: Do NOT output any Chinese, Japanese, Korean, or other CJK characters.\n\n"
            "TECHNICAL TERMS RULE — the following categories MUST remain in English exactly as-is:\n"
            "  - Algorithm names, data structures, complexity notation, programming concepts, CS/Math terms\n"
            "  - Any term that appears in English in the original slide or transcript content\n\n"
            "CORRECT label examples:\n"
            "  ✓ 'Time Complexity'                (English term from slide — keep English)\n"
            "  ✓ 'أكثر الطرق استخداماً'            (Arabic explanation — keep Arabic)\n"
            "  ✓ 'Binary Search أسرع من Linear Search'\n"
            "WRONG label examples (never do this):\n"
            "  ✗ 'تعقيد الوقت'   → should be 'Time Complexity'\n"
            "  ✗ 'البحث الثنائي' → should be 'Binary Search'\n"
            "  ✗ 'Al-Stack'      → transliterating is forbidden\n"
        )
    if language == "en":
        return "The lecture is in ENGLISH. Write ALL labels in English."
    # mixed 
    return (
        "The lecture is MIXED: the instructor speaks Arabic but slides/terms are in English.\n"
        "Rules for labels:\n"
        "  - Segment labels: use the title as-is (already has the right language mix).\n"
        "  - Subtopic labels: use the subtopic name as-is.\n"
        "  - Detail labels: extract the most informative phrase from the description.\n"
        "    * If the phrase comes from an Arabic sentence → write it in Arabic.\n"
        "    * If the phrase is a technical English term or slide text → keep it in English.\n"
        "    * NEVER translate Arabic to English or English to Arabic.\n"
        "    * NEVER transliterate (do not write Arabic words in English letters or vice versa).\n"
        "  - Keypoint labels: keep exactly as given.\n"
        "EXAMPLES of correct mixed labels:\n"
        "  GOOD: 'Max membership principle'  (English term, keep English)\n"
        "  GOOD: 'أكثر الطرق استخداماً'        (Arabic explanation, keep Arabic)\n"
        "  GOOD: 'Centroid method'            (English slide term)\n"
        "  BAD:  'مبدأ الحدية القصوى'          (translating 'Max membership' — do NOT do this)\n"
        "  BAD:  'Al-Centroid'                (transliterating — do NOT do this)\n"
        "STRICT PROHIBITION: Do NOT output any Chinese, Japanese, Korean, or other CJK characters.\n\n"
        "TECHNICAL TERMS RULE — the following categories MUST remain in English exactly as-is:\n"
        "  - Algorithm names, data structures, complexity notation, programming concepts, CS/Math terms\n"
        "  - Any term that appears in English in the original slide or transcript content\n\n"
        "CORRECT label examples:\n"
        "  ✓ 'Time Complexity'                (English term from slide — keep English)\n"
        "  ✓ 'أكثر الطرق استخداماً'            (Arabic explanation — keep Arabic)\n"
        "  ✓ 'Binary Search أسرع من Linear Search'\n"
        "WRONG label examples (never do this):\n"
        "  ✗ 'تعقيد الوقت'   → should be 'Time Complexity'\n"
        "  ✗ 'البحث الثنائي' → should be 'Binary Search'\n"
        "  ✗ 'Al-Stack'      → transliterating is forbidden\n"
    )


def _build_prompt(video_title: str, segments: list[dict], language: str) -> str:
    lang_note = _lang_instruction(language)

    seg_blocks = []
    for seg in segments:
        lines = [
            f'=== Segment {seg["segment_number"]}: {seg["title"]} ===',
            f'Main topic: {seg.get("main_topic", seg["title"])}',
        ]
        for i, st in enumerate(seg.get("sub_topics", []), start=1):
            lines.append(f'  Subtopic {i}: {st["name"]}')
            desc = st.get("description", "").strip()
            if desc:
                if len(desc) > 500:
                    desc = desc[:500] + "..."
                if language == "mixed":
                    transcript_text, slide_text = _split_transcript_vs_slides(desc)
                    if transcript_text:
                        lines.append(f'    [Arabic transcript]: {transcript_text}')
                    if slide_text:
                        lines.append(f'    [English slide content]: {slide_text}')
                    if not transcript_text and not slide_text:
                        lines.append(f'    Description: {desc}')
                else:
                    lines.append(f'    Description: {desc}')
        for kp in seg.get("key_points", []):
            if kp:
                lines.append(f'  Key point: {kp}')
        seg_blocks.append("\n".join(lines))

    segments_text = "\n\n".join(seg_blocks)

    mixed_detail_guidance = ""
    if language == "mixed":
        mixed_detail_guidance = """
DETAIL EXTRACTION GUIDANCE for mixed-language content:
  Each description has two parts annotated above:
    [Arabic transcript] = what the instructor said in Arabic → use Arabic for details from here
    [English slide content] = slide text with technical terms → use English for details from here
  
  Extract 2-3 details per subtopic, picking the most informative content from EITHER part.
  A good detail set mixes both languages naturally, for example:
    det_1: "Max membership principle"          ← English term from slide
    det_2: "أكثر الطرق شيوعاً"                  ← Arabic explanation from transcript  
    det_3: "height method for peaked outputs"  ← English slide content
"""

    return f"""You are an expert educational content analyst creating a DETAILED mind map.

{lang_note}
{mixed_detail_guidance}
Video title: {video_title}

=== SEGMENTS DATA ===
{segments_text}
====================

TASK:
Create a detailed, hierarchical mind map as JSON with "nodes" and "edges".

NODE TYPES & IDs:
  root      id="root"                  — the video title (1 node only)
  segment   id="seg_N"                 — each segment (N = segment number)
  subtopic  id="sub_N_M"               — each subtopic (M = 1,2,3...)
  detail    id="det_N_M_D"             — 2-3 detail bullets per subtopic (D = 1,2,3)
                                          extracted from the description text
  keypoint  id="kp_N_K"               — each key point of the segment (K = 1,2,3...)

EDGE IDs:
  root → segment      : "e_root_seg_N"
  segment → subtopic  : "e_seg_N_sub_N_M"
  subtopic → detail   : "e_sub_N_M_det_N_M_D"
  segment → keypoint  : "e_seg_N_kp_N_K"

LABEL RULES:
  - root label     = video title (keep as-is)
  - segment label  = segment title (keep as-is, may be longer)
  - subtopic label = subtopic name (keep as-is)
  - detail label   = SHORT informative phrase (max {DETAIL_WORDS} words).
                     MUST be a clean, readable phrase — never a raw transcript fragment.
                     RULES for detail labels:
                       * Extract the core concept or fact, not a verbatim sentence
                       * If the description is garbled or contains OCR errors, summarize the subtopic name instead
                       * Never include ellipsis (...) or cut-off sentences
                       * Never copy transliterated Arabic words written in Latin script (e.g. 'liniar sirt', 'algorthm')
                       * Prefer phrases that add new information not already in the subtopic name
                     CORRECT: 'Time Complexity هي O(n)', 'يمر على كل عنصر بالترتيب', 'لا تحتاج قائمة مترتبة'
                     WRONG:   'هو اللينير سيرت اللينير سيرت هو من أسهل…'
                     WRONG:   'أكاريمية تنوجيز فرح يبحث عنصر عنصر…'
                     WRONG:   'كيف نكتب الالغورثم للينير سيرج في البداية…'
  - keypoint label = key point text (keep as-is)

STRICT RULES:
  1. Do NOT invent content. Detail labels MUST come from the description text provided.
  2. Every subtopic MUST have exactly 2-3 detail nodes.
  3. Every segment MUST have all its subtopics and all its key points.
  4. Labels must be meaningful — never empty, never generic like "Detail 1" or "More info".
  5. Do NOT translate. Do NOT transliterate. Each label stays in its source language.
  6. Return ONLY valid JSON, no markdown, no explanation outside the JSON.

JSON FORMAT:
{{
  "nodes": [
    {{"id": "root",       "label": "...", "type": "root"}},
    {{"id": "seg_1",      "label": "...", "type": "segment"}},
    {{"id": "sub_1_1",    "label": "...", "type": "subtopic"}},
    {{"id": "det_1_1_1",  "label": "...", "type": "detail"}},
    {{"id": "det_1_1_2",  "label": "...", "type": "detail"}},
    {{"id": "det_1_1_3",  "label": "...", "type": "detail"}},
    {{"id": "kp_1_1",     "label": "...", "type": "keypoint"}}
  ],
  "edges": [
    {{"id": "e_root_seg_1",        "source": "root",    "target": "seg_1"}},
    {{"id": "e_seg_1_sub_1_1",     "source": "seg_1",   "target": "sub_1_1"}},
    {{"id": "e_sub_1_1_det_1_1_1", "source": "sub_1_1", "target": "det_1_1_1"}},
    {{"id": "e_sub_1_1_det_1_1_2", "source": "sub_1_1", "target": "det_1_1_2"}},
    {{"id": "e_sub_1_1_det_1_1_3", "source": "sub_1_1", "target": "det_1_1_3"}},
    {{"id": "e_seg_1_kp_1_1",      "source": "seg_1",   "target": "kp_1_1"}}
  ]
}}"""



def _call_groq(client: Groq, prompt: str, max_retries: int = 3) -> str:
    for attempt in range(max_retries):
        try:
            response = with_network_retry(
                lambda: client.chat.completions.create(
                    model=MODEL,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=4000,
                    temperature=0.2,
                ),
                context="MindmapEngine Groq call"
            )
            return response.choices[0].message.content or ""
        
        except NetworkUnavailableError:
            raise
        
        except Exception as e:
            err = str(e).lower()
            if "rate_limit" in err or "429" in err:
                wait = 30 * (attempt + 1)
                logger.warning(
                    f"[MindmapEngine] Rate limited, waiting {wait}s (attempt {attempt+1})"
                )
                time.sleep(wait)
            else:
                logger.error(f"[MindmapEngine] Groq error attempt {attempt+1}: {e}")
                if attempt == max_retries - 1:
                    raise
    return ""



def _parse(raw: str) -> dict | None:
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    raw = raw.strip()

    try:
        return sanitize_dict(json.loads(raw))
    except json.JSONDecodeError:
        pass

    match = re.search(r'\{.*\}', raw, re.DOTALL)
    if match:
        try:
            return sanitize_dict(json.loads(match.group()))
        except Exception:
            pass
    return None


def _is_valid(data) -> bool:
    if not isinstance(data, dict):
        return False
    nodes = data.get("nodes")
    edges = data.get("edges")
    if not isinstance(nodes, list) or not isinstance(edges, list):
        return False
    for n in nodes:
        if not isinstance(n, dict) or not n.get("id") or not n.get("label"):
            return False
    for e in edges:
        if not isinstance(e, dict) or not e.get("id") or \
                not e.get("source") or not e.get("target"):
            return False
    return True


def _truncate(text: str, max_words: int) -> str:
    words = text.split()
    if len(words) <= max_words:
        return text
    return " ".join(words[:max_words]) + "…"

def _clean_label(label: str) -> str:
    
    if not label:
        return label

    label = re.sub(r'\s*[…\.]{2,}$', '', label).strip()

    words = label.split()
    if len(words) > DETAIL_WORDS:
        label = " ".join(words[:DETAIL_WORDS])

    return strip_cjk(label)


def _clean_nodes(nodes: list[dict]) -> list[dict]:
    for node in nodes:
        if node.get("type") == "detail":
            node["label"] = _clean_label(node.get("label", ""))
    return nodes

def _build_fallback(video_title: str, segments: list[dict], language: str) -> dict:
    """
    Builds a detailed mindmap directly from segmentation data without LLM.
    """
    nodes: list[dict] = [{"id": "root", "label": video_title, "type": "root"}]
    edges: list[dict] = []

    for seg in segments:
        n = seg["segment_number"]
        seg_id = f"seg_{n}"
        nodes.append({"id": seg_id, "label": seg.get("title", f"Segment {n}"), "type": "segment"})
        edges.append({"id": f"e_root_{seg_id}", "source": "root", "target": seg_id})

        for m, st in enumerate(seg.get("sub_topics", []), start=1):
            sub_id = f"sub_{n}_{m}"
            nodes.append({"id": sub_id, "label": st.get("name", f"Subtopic {m}"), "type": "subtopic"})
            edges.append({"id": f"e_{seg_id}_{sub_id}", "source": seg_id, "target": sub_id})

            # Extract detail bullets from description
            desc = st.get("description", "")
            # Split on sentence boundaries or " | "
            raw_parts = re.split(r'[|\n]|(?<=[.!?])\s+', desc)
            detail_parts = [p.strip() for p in raw_parts if len(p.strip()) > 10][:3]

            if not detail_parts and desc.strip():
                detail_parts = [_truncate(desc.strip(), DETAIL_WORDS)]

            for d, detail_text in enumerate(detail_parts, start=1):
                det_id = f"det_{n}_{m}_{d}"
                nodes.append({
                    "id":    det_id,
                    "label": _clean_label(_truncate(detail_text, DETAIL_WORDS)),
                    "type":  "detail",
                })
                edges.append({
                    "id":     f"e_{sub_id}_{det_id}",
                    "source": sub_id,
                    "target": det_id,
                })

        for k, kp in enumerate(seg.get("key_points", []), start=1):
            if not kp:
                continue
            kp_id = f"kp_{n}_{k}"
            nodes.append({"id": kp_id, "label": kp, "type": "keypoint"})
            edges.append({"id": f"e_{seg_id}_{kp_id}", "source": seg_id, "target": kp_id})

    logger.info(
        f"[MindmapEngine] Fallback done | nodes={len(nodes)} | edges={len(edges)}"
    )
    return {"nodes": nodes, "edges": edges, "language": language}



def generate_mindmap(video_title: str, segments: list[dict]) -> dict:
    
    language = _detect_language(segments)
    logger.info(
        f"[MindmapEngine] Starting | title='{video_title}' | "
        f"segments={len(segments)} | lang={language}"
    )

    # Process in chunks to respect token limits
    seg_chunks = [
        segments[i : i + CHUNK_SIZE]
        for i in range(0, len(segments), CHUNK_SIZE)
    ]

    all_nodes: list[dict] = []
    all_edges: list[dict] = []
    root_added = False
    client = _get_client()

    for chunk_idx, chunk in enumerate(seg_chunks):
        logger.info(
            f"[MindmapEngine] Processing chunk {chunk_idx + 1}/{len(seg_chunks)} "
            f"(segments {chunk[0]['segment_number']}–{chunk[-1]['segment_number']})"
        )

        prompt = _build_prompt(video_title, chunk, language)
        raw    = _call_groq(client, prompt)

        if not raw:
            logger.warning(
                f"[MindmapEngine] Empty response for chunk {chunk_idx+1}, "
                f"using fallback for this chunk"
            )
            fallback_chunk = _build_fallback(video_title, chunk, language)
            # merge without adding a second root
            for node in fallback_chunk["nodes"]:
                if node["id"] == "root":
                    if not root_added:
                        all_nodes.append(node)
                        root_added = True
                else:
                    all_nodes.append(node)
            all_edges.extend(fallback_chunk["edges"])
            continue

        data = _parse(raw)

        if not data or not _is_valid(data):
            logger.error(
                f"[MindmapEngine] Invalid JSON from LLM for chunk {chunk_idx+1}, "
                f"using fallback for this chunk"
            )
            fallback_chunk = _build_fallback(video_title, chunk, language)
            for node in fallback_chunk["nodes"]:
                if node["id"] == "root":
                    if not root_added:
                        all_nodes.append(node)
                        root_added = True
                else:
                    all_nodes.append(node)
            all_edges.extend(fallback_chunk["edges"])
            continue
         
        data["nodes"] = _clean_nodes(data["nodes"])
        # Merge chunk result
        for node in data["nodes"]:
            if node["id"] == "root":
                if not root_added:
                    all_nodes.append(node)
                    root_added = True
            else:
                all_nodes.append(node)
        all_edges.extend(data["edges"])

      
        if chunk_idx < len(seg_chunks) - 1:
            time.sleep(4)

    if not all_nodes:
        logger.warning("[MindmapEngine] All LLM chunks failed — full fallback")
        return _build_fallback(video_title, segments, language)

   
    if not any(n["id"] == "root" for n in all_nodes):
        all_nodes.insert(0, {"id": "root", "label": video_title, "type": "root"})

    logger.info(
        f"[MindmapEngine] Done | nodes={len(all_nodes)} | edges={len(all_edges)} | lang={language}"
    )
    return {"nodes": all_nodes, "edges": all_edges, "language": language}


def _get_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)