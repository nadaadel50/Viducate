import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def summarize_segment(segment_title: str, main_topic: str, subtopics: list[dict], language: str = "en") -> str:
    lang_note = "Respond in Arabic." if language == "ar" else "Respond in English."

    subtopics_text = "\n".join(
        f"- {st['name']}: {st['description']}" for st in subtopics
    )

    prompt = f"""
        You are an expert educational AI that creates HIGH-QUALITY, DEEP, and STRUCTURED summaries for technical content.
        Your goal is to help a student FULLY understand the topic — not just summarize it.

        STRICT REQUIREMENTS:
        - Extract ALL important technical concepts mentioned
        - Explain what each concept DOES and WHY it matters
        - Avoid generic phrases like "this is important"
        - Be precise and specific
        - Do NOT repeat ideas
        - Do NOT hallucinate information not present in the input

        DEPTH REQUIREMENTS:
        - Key takeaways must be meaningful and specific (not generic)
        - Core concepts must include clear, educational definitions
        - Highlight relationships between concepts where possible
        - If concepts depend on each other, reflect that in explanations

        STYLE:
        - Clear, structured, and easy to study
        - Suitable for students learning this topic for the first time
        - Technically accurate and concise

        {lang_note}

        INPUT:
        Segment Title: {segment_title}
        Main Topic: {main_topic}
        Subtopics:
        {subtopics_text}

        OUTPUT RULES:
        - Return ONLY valid JSON
        - No explanations, no markdown, no extra text

        Return EXACTLY this JSON structure:

        {{
        "key_takeaways": [
            "Specific takeaway 1",
            "Specific takeaway 2",
            "Specific takeaway 3",
            "Specific takeaway 4"
        ],
        "core_concepts": [
            {{
            "term": "Concept Name",
            "definition": "Clear, detailed explanation of what this concept is and what it does"
            }},
            {{
            "term": "Another Concept",
            "definition": "Explanation including how it relates to other concepts if applicable"
            }}
        ],
        "historical_context": "Short relevant background if applicable, otherwise null",
        "conclusion": "2-3 sentence summary showing what was learned and how concepts connect",
        "highlighted_terms": [
            {{
            "term": "ImportantTerm",
            "reason": "Why this term is critical to understanding the segment"
            }},
            {{
            "term": "AnotherTerm",
            "reason": "Why it matters in this context"
            }}
        ]
        }}
        """

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1000,      
        temperature=0.2,   
    )
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    import json
    return json.loads(raw)


def summarize_full_video(video_title: str, segments: list[dict], language: str = "en") -> dict:
    lang_note = "Respond in Arabic." if language == "ar" else "Respond in English."

    segments_text = ""
    for i, seg in enumerate(segments):
        summary = seg.get("summary", {})

        key_points = summary.get("key_takeaways", [])
        concepts = summary.get("core_concepts", [])
        Subtopics= seg.get("subtopics", [])

        concepts_text = ", ".join([c["term"] for c in concepts]) if concepts else ""
    

        segments_text += f"""
            Segment {i+1}: {seg['title']}
            Key Takeaways: {", ".join(key_points)}
            Core Concepts: {concepts_text}
            Subtopics: {", ".join([st['name'] for st in Subtopics])}
            """

    prompt = f"""
    You are an expert educational AI that creates HIGH-QUALITY, DEEP, and STRUCTURED summaries.

    Your task is to generate a COMPREHENSIVE summary of the ENTIRE video.

    IMPORTANT INSTRUCTIONS:
    - You MUST synthesize information across ALL segments
    - You MUST connect ideas between segments (not treat them separately)
    - You MUST include ALL important concepts mentioned
    - The final summary MUST be MORE detailed and richer than any single segment
    - Avoid repetition
    - Do NOT invent information

    STYLE REQUIREMENTS:
    - Clear, structured, and educational
    - Suitable for a student learning this topic for the first time
    - Technically accurate

    {lang_note}

    Video Title: {video_title}

    Segment Data:
    {segments_text}

    Return ONLY valid JSON.
    Do NOT include explanations or markdown.

    Return this exact JSON structure:

    {{
    "key_takeaways": [
        "Comprehensive takeaway 1",
        "Comprehensive takeaway 2",
        "Comprehensive takeaway 3",
        "Comprehensive takeaway 4",
        "Comprehensive takeaway 5"
    ],
    "core_concepts": [
        {{"term": "Concept Name", "definition": "Detailed explanation connecting multiple segments"}},
        {{"term": "Another Concept", "definition": "Clear, deep explanation"}}
    ],
    "historical_context": "Full context if relevant, otherwise null",
    "conclusion": "A detailed 5-7 sentence explanation summarizing the entire video, showing relationships between topics",
    "highlighted_terms": [
        {{"term": "ImportantTerm", "reason": "why this term is critical in the overall video"}},
        {{"term": "AnotherTerm", "reason": "why it matters in the bigger picture"}}
    ]
    }}
    """

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1500,
        temperature=0.2,
    )
    raw = response.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    import json
    return json.loads(raw)