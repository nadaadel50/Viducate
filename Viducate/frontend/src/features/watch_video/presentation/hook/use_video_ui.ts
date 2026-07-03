import { useEffect, useRef, useState } from "react";

export function useVideoUI(
  containerRef: React.RefObject<HTMLDivElement | null>,
  isPlaying: boolean,
) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);

    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      await containerRef.current.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const resetHideTimer = () => {
    setShowControls(true);

    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }

    if (isFullscreen && isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }

    if (isFullscreen && isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 1000);
    }
  };
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [isFullscreen, isPlaying]);

  return {
    isFullscreen,
    showControls,
    toggleFullscreen,
    resetHideTimer,
    handleMouseLeave,
  };
}
