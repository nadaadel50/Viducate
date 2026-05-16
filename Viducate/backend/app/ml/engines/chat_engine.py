import logging
from groq import Groq
from app.config import settings

logger = logging.getLogger(__name__)

# the best model in groq for quality
MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are a smart assistant specialized in explaining educational video content.
You have context from the video, use it to answer the user's questions.
If the question is not covered in the context, answer from your general knowledge and mention that this info is not in the video.
IMPORTANT:
- Always respond in the SAME language as the user's question. If the user writes in English, respond in English. If the user writes in Arabic, respond in Arabic.
- Never translate technical terms - keep them in their original language (e.g. Binary Exponentiation, Stack, Queue, probabelistic , grammer, etc, ).
- Never use any language other than Arabic or English.
- Always provide a practical example when explaining a concept - use code examples if the topic is programming, or numerical examples if it is math-related.
- Use bullet points only when listing multiple items.
- No long intros or conclusions.
- No repeated ideas or step-by-step breakdowns.
- ALWAYS end your answer with a concrete example, never skip it.
"""

def _get_client() -> Groq:
    return Groq(api_key=settings.GROQ_API_KEY)


def _build_messages(context: str, history: list[dict], question: str) -> list[dict]:
    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        *history,
        {"role": "user", "content":f"Video context:\n{context}\n\nQuestion: {question}"
}
    ]


def generate_answer(context: str, history: list[dict], question: str) -> str:
    """
    Calls Groq and returns the answer string.
    """
    client = _get_client()
    messages = _build_messages(context, history, question)

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
        )
        answer = response.choices[0].message.content.strip()
        logger.info(f"[ChatEngine] Answer generated successfully")
        return answer

    except Exception as e:
        logger.error(f"[ChatEngine] Groq error: {e}")
        raise