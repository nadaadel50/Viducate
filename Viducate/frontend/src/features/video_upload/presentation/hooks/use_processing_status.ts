import { useState, useEffect } from 'react';
import { getVideoStatusUseCase } from '../../../../core/di/video_status_container';

export const useProcessingStatus = (videoId: string | undefined) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'pending' | 'processing' | 'completed' | 'failed'>('pending');

  useEffect(() => {
    if (!videoId) return;

    const fetchStatus = async () => {
      console.log("Checking status for video:", videoId); // Debug log
      try {
        const entity = await getVideoStatusUseCase.execute(Number(videoId));
        
        setStatus(entity.status);

        if (entity.status === 'completed') {
          setProgress(100);
        } else if (entity.status === 'processing') {
          
          setProgress(prev => (prev < 92 ? prev + Math.floor(Math.random() * 3) + 1 : prev));
        } else if (entity.status === 'failed') {
            setStatus('failed');
        }
      } catch (error) {
        console.error("Polling Error:", error);
      }
    };

    //make polling every 3 seconds to check the status
    const intervalId = setInterval(fetchStatus, 3000);
    fetchStatus(); 

    return () => clearInterval(intervalId);
  }, [videoId]);

  return { status, progress };
};