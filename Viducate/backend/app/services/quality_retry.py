import logging
from typing import Callable, Any
from app.services.network_errors import (
    NetworkUnavailableError,
    with_network_retry,
)

logger = logging.getLogger(__name__)

print(" QUALITY RETRY LOADED FROM:", __file__)

def run_with_quality_retry(
    generator_fn: Callable[[], Any],
    score_fn: Callable[[Any], dict],
    label: str = "",
    max_retries: int = 2,
) -> tuple[Any, dict]:
    
    print(f"[QualityRetry] STARTED: {label}") 
    logger.info(f"[QualityRetry] {'='*60}")
    logger.info(f"[QualityRetry] STARTED | label={label} | max_retries={max_retries}")

    best_result  = None
    best_score   = -1.0
    best_quality = {"score": 0.0, "flag": True, "threshold": 0.0, "retries": 0}
    total_attempts = max_retries + 1

    for attempt in range(total_attempts):
        logger.info(
            f"[QualityRetry] {label} | "
            f">>> ATTEMPT {attempt + 1}/{total_attempts} <<<"
        )
        print(f"[QualityRetry] {label} | ATTEMPT {attempt + 1}/{total_attempts}")

        #  Call generator 
        try:
            logger.info(f"[QualityRetry] {label} | calling generator_fn ...")
            result = with_network_retry(
                generator_fn,
                context=f"generator_fn for {label}",
            )
            result_type = type(result).__name__
            result_empty = not result
            logger.info(
                f"[QualityRetry] {label} | generator OK | "
                f"type={result_type} | empty={result_empty}"
            )
        except NetworkUnavailableError:
            logger.error(
                f"[QualityRetry] {label} | Network unavailable after retries"
            )
            raise
        except Exception as e:
            logger.error(f"[QualityRetry] {label} | generator FAILED: {e}")
            print(f"[QualityRetry] {label} | generator FAILED: {e}")
            continue
 
        if result is None:
            logger.warning(f"[QualityRetry] {label} | generator returned None — skipping")
            print(f"[QualityRetry] {label} | generator returned None — skipping")
            continue

        #  Score result 
        try:
            logger.info(f"[QualityRetry] {label} | calling score_fn ...")
            print(f"[QualityRetry] {label} | calling score_fn ...")
            quality = with_network_retry(
                lambda: score_fn(result),
                context=f"score_fn for {label}",
            )
            score     = quality.get("score", 0.0)
            flag      = quality.get("flag", True)
            threshold = quality.get("threshold", 0.0)

            status_icon = " BELOW THRESHOLD" if flag else " PASSED"
            logger.info(
                f"[QualityRetry] {label} | "
                f"SCORE={score:.4f} | THRESHOLD={threshold} | "
                f"FLAG={flag} | {status_icon}"
            )
            print(
                f"[QualityRetry] {label} | "
                f"SCORE={score:.4f} | THRESHOLD={threshold} | FLAG={flag} | {status_icon}"
            )
        except NetworkUnavailableError:
            logger.error(
                f"[QualityRetry] {label} | Network unavailable during scoring after retries"
            )
            raise
        except Exception as e:
            logger.error(f"[QualityRetry] {label} | scorer FAILED: {e}")
            print(f"[QualityRetry] {label} | scorer FAILED: {e}")
            quality = {"score": 1.0, "flag": False, "threshold": 0.0}

        quality["retries"] = attempt

        #  Track best 
        current_score = quality.get("score", 0.0)
        if current_score > best_score:
            best_score   = current_score
            best_result  = result
            best_quality = quality
            logger.info(
                f"[QualityRetry] {label} |  new BEST score={best_score:.4f}"
            )
            print(f"[QualityRetry] {label} | new BEST score={best_score:.4f}")

        #  Check if passed 
        if not quality.get("flag", True):
            logger.info(
                f"[QualityRetry] {label} | "
                f" Quality OK at attempt {attempt + 1} — stopping early"
            )
            print(f"[QualityRetry] {label} | Quality OK — stopping at attempt {attempt + 1}")
            break

        #  Decide to retry 
        if attempt < total_attempts - 1:
            logger.warning(
                f"[QualityRetry] {label} | "
                f" score={current_score:.4f} < threshold={threshold} | "
                f"RETRYING (attempt {attempt + 2}/{total_attempts})"
            )
            print(
                f"[QualityRetry] {label} | "
                f"RETRYING: score={current_score:.4f} < threshold={threshold}"
            )
        else:
            logger.warning(
                f"[QualityRetry] {label} | "
                f" All {total_attempts} attempts exhausted | "
                f"best_score={best_score:.4f} — using best attempt"
            )
            print(
                f"[QualityRetry] {label} | "
                f"All {total_attempts} attempts done | best_score={best_score:.4f}"
            )

    #  Final summary 
    final_flag    = best_quality.get("flag", True)
    final_retries = best_quality.get("retries", 0)
    logger.info(
        f"[QualityRetry] {label} | "
        f"FINAL RESULT: score={best_score:.4f} | "
        f"flag={final_flag} | retries_used={final_retries}"
    )
    logger.info(f"[QualityRetry] {'='*60}")
    print(
        f"[QualityRetry] {label} | "
        f"FINAL: score={best_score:.4f} | flag={final_flag} | retries={final_retries}"
    )

    return best_result, best_quality