import { useState, useEffect } from 'react';
import { getVideoStatusUseCase } from '../../../../core/di/video_status_container';

type VideoStatus =
  | 'uploaded'
  | 'pending'
  | 'processing'
  | 'transcribing'
  | 'ocr_processing'
  | 'merging'
  | 'segmenting'
  | 'completed'
  | 'failed';

export const useProcessingStatus = (videoId: number | undefined) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<VideoStatus>('pending');

  useEffect(() => {
    if (!videoId) return;

    const fetchStatus = async () => {
      try {
        const entity = await getVideoStatusUseCase.execute(Number(videoId));
        const newStatus: VideoStatus = entity.status;

        setStatus(newStatus);

        
        if (newStatus === 'failed') {
          setProgress(0);
          return;
        }

        
        if (newStatus === 'uploaded') {
          setProgress(100);
          setStatus('completed');
          return;
        }

        
        const preSegmenting: VideoStatus[] = [
          'pending',
          'processing',
          'transcribing',
          'ocr_processing',
          'merging',
        ];

        if (preSegmenting.includes(newStatus)) {
  setProgress(prev => Math.min(prev + 1, 70));
  return;
}

      if (newStatus === 'segmenting') {
  setProgress(prev => Math.min(prev + 1, 99));
  return;
}
      
        if (newStatus === 'completed') {
          setProgress(100);
          return;
        }

      } catch (error) {
        console.error('Polling Error:', error);
      }
    };

    const intervalId = setInterval(fetchStatus, 2000);
    fetchStatus();

    return () => clearInterval(intervalId);
  }, [videoId]);

  return { status, progress };
};
