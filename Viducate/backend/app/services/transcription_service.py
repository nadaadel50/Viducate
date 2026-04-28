from fastapi import HTTPException,status
import yt_dlp
import glob
import os
import time
import whisper
from groq import Groq
from pydub import AudioSegment

import logging

from app.services.downloading import download_video
from app.config import settings
logger = logging.getLogger(__name__)


def detect_language(audio_file: str) -> str:    
    logger.info("detecting language...")
    model = whisper.load_model("base")
    audio = whisper.load_audio(audio_file)
    audio = whisper.pad_or_trim(audio)
    mel = whisper.log_mel_spectrogram(audio).to(model.device)
    _, probs = model.detect_language(mel)
    lang = max(probs, key=probs.get)
    logger.info(f"detected language: {lang}")
    del model
    return lang


def extract_audio(video_path: str) -> str:
    audio_path = video_path.replace(".mp4", ".mp3")
    
    audio = AudioSegment.from_file(video_path)
    audio.export(audio_path, format="mp3")

    return audio_path



def split_audio(file_path: str, chunk_minutes: int = 2) -> list:
    logger.info(f"Splitting start: ")
    audio = AudioSegment.from_file(file_path)
    chunk_ms = chunk_minutes * 60 * 1000
    chunks = []
    for i, start in enumerate(range(0, len(audio), chunk_ms)):
        chunk = audio[start:start + chunk_ms]
        chunk_path = f"chunk_{i}.mp3"
        chunk.export(chunk_path, format="mp3", bitrate="64k")
        chunks.append((chunk_path, start / 1000))
    logger.info(f"Splitting done: ")
    return chunks

def send_to_groq(client: Groq, chunk_path: str, offset: float, lang: str, retries: int = 5):
    logger.info("before groq call")
    logger.info(f"sending to groq: {chunk_path}")
    for attempt in range(retries):
        try:
            with open(chunk_path, "rb") as f:
                logger.info(f"START chunk {chunk_path}")
                result = client.audio.transcriptions.create(
                    file=f,
                    model="whisper-large-v3-turbo",
                    language=lang,
                    response_format="verbose_json",
                    timeout=120  # timeout
                )
            
            
            if not hasattr(result, 'segments') or result.segments is None:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail=f"Invalid response from Groq{result}"
                )
                
            logger.info(f"chunk done: {chunk_path}")
            return result
            
        except Exception as e:
            logger.warning(f"attempt {attempt+1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(10)  
            
    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail="Groq transcription failed after multiple attempts"
    )
async def transcribe(url: str, video_id: int, language: str = None) -> str:
    audio_file = None
    chunks_created = []
    try:
        # 1. Download
        video_file = download_video(url, video_id)
        audio_file = extract_audio(video_file)

        # 2. Detect language
        lang = language or detect_language(audio_file)

        # 3. Split
        chunks = split_audio(audio_file)
        chunks_created = [c[0] for c in chunks]

        # 4. Transcribe
        client = Groq(api_key=settings.GROQ_API_KEY)
        full_transcript = []

        for chunk_path, offset in chunks:
            result = send_to_groq(client, chunk_path, offset, lang)
            for segment in result.segments:
                full_transcript.append({
                "start": segment["start"] + offset,
                "end": segment["end"] + offset,
                "text": segment["text"],
                "lines": [segment["text"]] 
            })
                
        with open(f"transcript_{video_id}.txt", "w", encoding="utf-8") as f:
            for segment in full_transcript:
                f.write(f"[{segment['start']:.1f} --> {segment['end']:.1f}] {segment['text']}\n")

        return full_transcript, video_file

    finally:
        if audio_file and os.path.exists(audio_file):
            os.remove(audio_file)
        for chunk_path in chunks_created:
            if os.path.exists(chunk_path):
                os.remove(chunk_path)