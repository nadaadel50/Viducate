def merge_transcript_ocr(transcript: list,video_id: int, ocr_segments: list) -> list:
   
    merged = []

    for ocr in ocr_segments:
        ocr_time = ocr["time"]

        matching_transcript = [
            t for t in transcript
            if t["start"] <= ocr_time <= t["end"]
        ]

        merged.append({
            "time": ocr_time,
            "timestamp": ocr["timestamp"],
            "transcript_text": matching_transcript[0]["text"] if matching_transcript else None,
            "ocr_text": ocr["text"],
            "ocr_lines": ocr["lines"],
            "combined_text": (
                (matching_transcript[0]["text"] + " " if matching_transcript else "") 
                + ocr["text"]
            )
        })

  
    ocr_times = {ocr["time"] for ocr in ocr_segments}
    for t in transcript:
        has_ocr = any(t["start"] <= ocr_time <= t["end"] for ocr_time in ocr_times)
        if not has_ocr:
            merged.append({
                "time": t["start"],
                "timestamp": f"{int(t['start'])//3600:02d}:{(int(t['start'])%3600)//60:02d}:{int(t['start'])%60:02d}",
                "transcript_text": t["text"],
                "ocr_text": None,
                "ocr_lines": [],
                "combined_text": t["text"]
            })

    merged.sort(key=lambda x: x["time"])


    with open(f"merged_{video_id}.txt", "w", encoding="utf-8") as f:
        for seg in merged:
            f.write(f"[{seg['timestamp']}]\n")
            f.write(f"  Transcript : {seg['transcript_text']}\n")
            f.write(f"  OCR        : {seg['ocr_text']}\n")
            f.write(f"  Combined   : {seg['combined_text']}\n\n")
    return merged
