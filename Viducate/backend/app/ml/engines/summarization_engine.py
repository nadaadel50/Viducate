import os
from groq import Groq
import json
from app.utils.text_sanitizer import sanitize_dict, strip_cjk
import json
from app.services.network_errors import with_network_retry

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

SEGMENT_JSON_STRUCTURE = json.dumps({
    "takeaways": [
    "Specific takeaway 1",
    "Specific takeaway 2",
    "Specific takeaway 3",
    "Specific takeaway 4"
    ],

    "sections": [
        {
            "heading": "Core Concepts & Terminology",

            "content": [
                {
                    "text": "Important technical term",
                    "type": "term",
                    "tooltip": "Clear explanation of the term"
                },

                {
                    "text": " explanation that continues naturally after the term.",
                    "type": "normal",
                    "highlights": ["important phrase", "another term"]
                }
            ]
        },

        {
            "heading": "Historical Context",

            "content": [
                {
                    "text": "Historical term",
                    "type": "term",
                    "tooltip": "Explanation of the historical concept"
                },

                {
                    "text": " explanation of the historical background.",
                    "type": "normal",
                    "highlights": ["historical background"]
                }
            ]
        }
    ],

    "conclusion": "2-3 sentence summary connecting the major ideas."

    }, indent=2)

FULL_VIDEO_JSON_STRUCTURE = json.dumps({
    "takeaways": [
    "Comprehensive takeaway 1",
    "Comprehensive takeaway 2",
    "Comprehensive takeaway 3",
    "Comprehensive takeaway 4",
    "Comprehensive takeaway 5"
    ],

    "sections": [
        {
            "heading": "Core Concepts & Terminology",

            "content": [
                {
                    "text": "Important technical term",
                    "type": "term",
                    "tooltip": "Clear explanation of the term"
                },

                {
                    "text": " explanation that continues naturally after the term.",
                    "type": "normal",
                    "highlights": ["important phrase", "another term"]
                }
            ]
        },

        {
            "heading": "Historical Context",

            "content": [
                {
                    "text": "Historical term",
                    "type": "term",
                    "tooltip": "Explanation of the historical concept"
                },

                {
                    "text": " explanation of the historical background.",
                    "type": "normal",
                    "highlights": ["historical background"]
                }
            ]
        }
    ],

    "conclusion": "4-6 sentence summary connecting all major ideas across the video."

    }, indent=2)

def safe_json_load(raw: str) -> dict:
    try:
        return json.loads(raw)

    except json.JSONDecodeError as e:
        print("\n========== INVALID JSON RESPONSE ==========")
        print(raw)
        print("===========================================\n")
        raise e


def summarize_segment(segment_title: str, main_topic: str, subtopics: list[dict], language: str = "en") -> dict:
    lang_note = (
        "Respond in Arabic, BUT keep all technical terms, code, and programming concepts in English as-is (do not translate terms like 'Fuzzy Logic', 'membership', 'defuzzification', 'centroid', etc.). "
        "Section headings, explanations, takeaways, tooltips, and conclusion must be in Arabic. "
        "Technical terms inside 'term' blocks and highlights stay in English."
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
        "  ✓ term block: text='Linear Search', tooltip='خوارزمية بحث تمر على كل عنصر بالترتيب'\n"
        "  ✓ normal block: ' هي أبطأ من Binary Search لأن Time Complexity هي O(n)'\n"
        "  ✓ takeaway: 'Binary Search أسرع من Linear Search عند استخدام قوائم مترتبة'\n"
        "WRONG examples (never do this):\n"
        "  ✗ 'تعقيد الوقت'    → should be 'Time Complexity'\n"
        "  ✗ 'البحث الخطي'    → should be 'Linear Search'\n"
        "  ✗ 'البحث الثنائي'  → should be 'Binary Search'\n"
        "  ✗ 'المكدس'         → should be 'Stack'\n"
        "  ✗ 'تدوين Big O'    → should be 'Big O Notation'\n"
    ) if language == "ar" else "Respond in English."

    subtopics_text = "\n".join(
        f"- {st['name']}: {st['description']}" for st in subtopics
    )

    prompt = f"""
        You are an expert educational AI that creates HIGH-QUALITY, STRUCTURED summaries for technical content.
        Your goal is to help students quickly understand the most important ideas in the segment.

        STRICT REQUIREMENTS:
        - Extract ALL important technical concepts mentioned
        - Explain what each concept DOES and WHY it matters
        - Be precise and specific. Do NOT repeat ideas
        - Do NOT hallucinate information not present in the input
        - Keep the output educational and beginner-friendly
        - Organize information into sections with clear headings
        - When language is Arabic:
            - Keep technical terminology in English
            - Do NOT transliterate English terms into Arabic
            - Do NOT invent Arabic versions of technical concepts
            - Arabic is only for explanations and educational text, NOT for technical terms

        {lang_note}

        INPUT:
        Segment Title: {segment_title}
        Main Topic: {main_topic}
        Subtopics:
        {subtopics_text}

        OUTPUT RULES:
        - Return ONLY valid JSON
        - No explanations, no markdown, no extra text
        - highlights must EXACTLY appear inside the corresponding text
        - Never return null values
        - Never return empty arrays

        Return JSON using the SAME STRUCTURE and FIELD NAMES as this example.
        The values themselves should adapt to the requested language.
        {SEGMENT_JSON_STRUCTURE}
        
        SECTION RULES:
        - Always create:
        "Core Concepts & Terminology"

        - Create:
        "Historical Context"
        ONLY if relevant

        CONTENT RULES:
        - Allowed content types:
        - "term"
        - "normal"

        - "term" blocks:
        - contain important terminology
        - must include:
            text
            type
            tooltip

        - "normal" blocks:
        - continue explanations naturally
        - may contain highlights
        - highlights must appear EXACTLY in text

        - Keep explanations concise and educational

        LANGUAGE RULES:
        - Headings should be in Arabic when language='ar'
        - Conclusion should be in Arabic when language='ar'
        - Explanations should be in Arabic when language='ar'
        - Technical terms MUST remain in English
        - highlights containing technical terms MUST remain in English
        """


    response = with_network_retry(
        lambda: client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1200,
            temperature=0.2,
        ),
        context="summarize_segment Groq call",
    )
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    
    return sanitize_dict(json.loads(raw))


def summarize_full_video(video_title: str, segments: list[dict], language: str = "en") -> dict:
    lang_note = (
        "Respond in Arabic, BUT keep all technical terms, code, and programming concepts in English as-is (do not translate terms like 'Fuzzy Logic', 'membership', 'defuzzification', 'centroid', etc.). "
        "Section headings, explanations, takeaways, tooltips, and conclusion must be in Arabic. "
        "Technical terms inside 'term' blocks and highlights stay in English."
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
        "  ✓ term block: text='Linear Search', tooltip='خوارزمية بحث تمر على كل عنصر بالترتيب'\n"
        "  ✓ normal block: ' هي أبطأ من Binary Search لأن Time Complexity هي O(n)'\n"
        "  ✓ takeaway: 'Binary Search أسرع من Linear Search عند استخدام قوائم مترتبة'\n"
        "WRONG examples (never do this):\n"
        "  ✗ 'تعقيد الوقت'    → should be 'Time Complexity'\n"
        "  ✗ 'البحث الخطي'    → should be 'Linear Search'\n"
        "  ✗ 'البحث الثنائي'  → should be 'Binary Search'\n"
        "  ✗ 'المكدس'         → should be 'Stack'\n"
        "  ✗ 'تدوين Big O'    → should be 'Big O Notation'\n"
    ) if language == "ar" else "Respond in English."

    segments_text = ""

    for i, seg in enumerate(segments):
        summary = seg.get("summary", {})
        takeaways = summary.get("takeaways", [])
        section_titles = [
            section.get("heading", "")
            for section in summary.get("sections", [])
        ]
        subtopics = seg.get("subtopics", [])
        segments_text += f"""
        Segment {i+1}: {seg['title']}

        Takeaways:
        {", ".join(takeaways)}

        Sections:
        {", ".join(section_titles)}

        Subtopics:
        {", ".join([st['name'] for st in subtopics])}
        
    """

    prompt = f"""
    You are an expert educational AI that creates HIGH-QUALITY, STRUCTURED video summaries.
    Your task is to summarize the ENTIRE video by synthesizing all segments together.

    IMPORTANT REQUIREMENTS:
    - Connect ideas across segments
    - Highlight the most important concepts
    - Avoid repetition
    - Keep explanations concise and educational
    - Do NOT hallucinate information
    - Organize information into logical sections
    - When language is Arabic:
        - Keep technical terminology in English
        - Do NOT transliterate English terms into Arabic
        - Do NOT invent Arabic versions of technical concepts
        - Arabic is only for explanations and educational text, NOT for technical terms

    {lang_note}

    Video Title:
    {video_title}

    Segment Data:
    {segments_text}

    OUTPUT RULES:
    - Return ONLY valid JSON
    - No markdown
    - No explanations outside JSON
    - highlights must EXACTLY appear inside the corresponding text
    - Never return null values
    - Never return empty arrays

    Return JSON using the SAME STRUCTURE and FIELD NAMES as this example.
    The values themselves should adapt to the requested language.
    {FULL_VIDEO_JSON_STRUCTURE}

    SECTION RULES:
    - Always create:
      "Core Concepts & Terminology"

    - Create:
      "Historical Context"
      ONLY if relevant

    CONTENT RULES:
    - Allowed content types:
      - "term"
      - "normal"

    - "term" blocks:
      - contain important terminology
      - must include:
        text
        type
        tooltip

    - "normal" blocks:
      - continue explanations naturally
      - may contain highlights
      - highlights must appear EXACTLY in text
      - Keep explanations concise and educational

    LANGUAGE RULES:
    - Headings should be in Arabic when language='ar'
    - Conclusion should be in Arabic when language='ar'
    - Explanations should be in Arabic when language='ar'
    - Technical terms MUST remain in English
    - highlights containing technical terms MUST remain in English
    """

    response = with_network_retry(
        lambda: client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1800,
            temperature=0.2,
        ),
        context="summarize_full_video Groq call"
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()

    return sanitize_dict(json.loads(raw))
    