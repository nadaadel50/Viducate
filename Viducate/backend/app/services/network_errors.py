import socket
import time
import random
import logging
import functools
from typing import Callable, Any, TypeVar, Optional

try:
    import requests
except ImportError:  
    requests = None

try:
    import httpx
except ImportError: 
    httpx = None

try:
    from botocore.exceptions import EndpointConnectionError, ConnectTimeoutError
except ImportError:  
    EndpointConnectionError = ConnectTimeoutError = None

logger = logging.getLogger(__name__)

T = TypeVar("T")

DEFAULT_MAX_RETRIES = 1
DEFAULT_BASE_DELAY_SECONDS = 5.0
DEFAULT_MAX_DELAY_SECONDS = 5.0


class NetworkUnavailableError(Exception):
    pass


_NETWORK_ERROR_SIGNALS = [
    "getaddrinfo failed",
    "failed to resolve",
    "name or service not known",
    "connection refused",
    "connection reset",
    "network is unreachable",
    "temporary failure in name resolution",
    "max retries exceeded",
    "connection aborted",
    "read timed out",
    "could not connect",
    "no route to host",
    "connection timed out",
    "remote end closed connection",
    "dns lookup failed",
    "connection error",
]


def _network_exc_types() -> tuple:
    types = [socket.gaierror, ConnectionError, TimeoutError]

    if requests is not None:
        types += [
            requests.exceptions.ConnectionError,
            requests.exceptions.Timeout,
        ]
    if httpx is not None:
        types += [
            httpx.ConnectError,
            httpx.ConnectTimeout,
            httpx.ReadTimeout,
            httpx.NetworkError,
        ]
    if EndpointConnectionError is not None:
        types += [EndpointConnectionError, ConnectTimeoutError]

    return tuple(types)


def is_network_error(exc: Exception) -> bool:
    if isinstance(exc, _network_exc_types()):
        return True
    msg = str(exc).lower()
    return any(signal in msg for signal in _NETWORK_ERROR_SIGNALS)


def raise_if_network_error(exc: Exception, context: str = "") -> None:
    if is_network_error(exc):
        logger.error(
            f"[NetworkErrors] Detected network failure{f' in {context}' if context else ''}: {exc}"
        )
        raise NetworkUnavailableError(
            f"Network connection issue{f' during {context}' if context else ''}: {exc}"
        ) from exc


def with_network_retry(
    fn: Callable[[], T],
    max_retries: int = DEFAULT_MAX_RETRIES,
    base_delay: float = DEFAULT_BASE_DELAY_SECONDS,
    max_delay: float = DEFAULT_MAX_DELAY_SECONDS,
    context: str = "",
    on_retry: Optional[Callable[[int, float, Exception], None]] = None,
) -> T:
    last_exc: Optional[Exception] = None

    for attempt in range(1, max_retries + 1):
        try:
            return fn()
        except Exception as e:
            print("TYPE:", type(e))
            print("REPR:", repr(e))
            print("IS NETWORK:", is_network_error(e))
            if not is_network_error(e):
                raise

            last_exc = e
            if attempt == max_retries:
                break

            delay = min(max_delay, base_delay * (2 ** (attempt - 1)))
            delay += random.uniform(0, delay * 0.2)

            logger.warning(
                f"[NetworkErrors] Network error{f' in {context}' if context else ''} "
                f"(attempt {attempt}/{max_retries}): {e}. Retrying in {delay:.1f}s..."
            )
            if on_retry:
                try:
                    on_retry(attempt, delay, e)
                except Exception:
                    logger.exception("[NetworkErrors] on_retry callback failed")

            time.sleep(delay)

    logger.error(
        f"[NetworkErrors] Giving up after {max_retries} attempts"
        f"{f' in {context}' if context else ''}: {last_exc}"
    )
    raise NetworkUnavailableError(
        f"Network still unavailable after {max_retries} attempts"
        f"{f' during {context}' if context else ''}: {last_exc}"
    ) from last_exc
