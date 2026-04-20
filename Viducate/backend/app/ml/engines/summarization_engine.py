import os
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def summarize_segment(segment_title: str, main_topic: str, subtopics: list[dict], language: str = "en") -> str:
    lang_note = "Respond in Arabic." if language == "ar" else "Respond in English."

    subtopics_text = "\n".join(
        f"- {st['name']}: {st['description']}" for st in subtopics
    )

    prompt = f"""You are an educational content summarizer specializing in technical topics.
    Below is a video segment with its topic and subtopics.
    Write a detailed, specific summary (4-6 sentences) that:
    - Mentions specific concepts, components, or tools by name
    - Explains what each component DOES, not just that it exists
    - Is useful for someone who wants to understand the topic deeply

    Segment Title: {segment_title}
    Main Topic: {main_topic}
    Subtopics:
    {subtopics_text}
    Write a specific, detailed summary:"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600,      
        temperature=0.2,   
    )
    return response.choices[0].message.content.strip()


def summarize_full_video(video_title: str, segment_summaries: list[dict], language: str = "en") -> str:
    lang_note = "Respond in Arabic." if language == "ar" else "Respond in English."

    segments_text = "\n\n".join(
        f"Segment {i+1} - {s['title']}:\n{s['summary']}"
        for i, s in enumerate(segment_summaries)
    )

    prompt = f"""You are an educational content summarizer specializing in technical topics.
    Below are summaries of all segments from the video titled "{video_title}".

    Write a comprehensive summary that:
    - Mentions every specific technology, tool, or component discussed by name
    - Explains the relationships between components (e.g. how A communicates with B)
    - Is structured as a flowing paragraph, not bullet points
    - Would help a student understand what they will learn from this video
    - Is 5-7 sentences long
    {segments_text}
    Write a specific, comprehensive summary:"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=800,      
        temperature=0.2,
    )
    return response.choices[0].message.content.strip()