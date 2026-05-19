// import { createContext, useEffect, useState } from "react";
// import type { TopicResponse } from "../../../features/watch_video/domin/entity/topic_response";
// import type { LearningSessionContextType } from "./learning_constent_context";
// import { STORAGE_KEYS } from "../../constants";

// export const LearningSessionContext =
//   createContext<LearningSessionContextType | null>(null);

// export function LearningSessionProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [seekTo, setSeekTo] = useState<number | null>(null);

//   const [currentTime, setCurrentTime] = useState<number>(() => {
//     const saved = sessionStorage.getItem(STORAGE_KEYS.currentTime);
//     return saved ? Number(saved) : 0;
//   });

//   const [selectedTopic, setSelectedTopic] = useState<TopicResponse | null>(
//     () => {
//       const saved = sessionStorage.getItem(STORAGE_KEYS.selectedTopic);
//       return saved ? JSON.parse(saved) : null;
//     },
//   );

  // useEffect(() => {
  //   console.log("Current time updated:", currentTime);
  //   sessionStorage.setItem(STORAGE_KEYS.currentTime, String(currentTime));
  // }, [currentTime]);

//   useEffect(() => {
//     if (selectedTopic) {
//       sessionStorage.setItem(
//         STORAGE_KEYS.selectedTopic,
//         JSON.stringify(selectedTopic),
//       );
//     }
//   }, [selectedTopic]);

//   const [videoId, setVideoIdState] = useState<number | null>(() => {
//     const stored = sessionStorage.getItem(STORAGE_KEYS.video_Id);
//     return stored ? Number(stored) : null;
//   });

//   const setVideoId = (id: number | null) => {
//     if (id === null) {
//       sessionStorage.removeItem(STORAGE_KEYS.video_Id);
//     } else {
//       sessionStorage.setItem(STORAGE_KEYS.video_Id, String(id));
//     }
//     setVideoIdState(id);
//   };

//   const [videoTitle, setVideoTitleState] = useState<string | null>(() => {
//     const stored = sessionStorage.getItem(STORAGE_KEYS.title);
//     return stored ? stored : null;
//   });

//   const setVideoTitle = (title: string | null) => {
//     if (title === null) {
//       sessionStorage.removeItem(STORAGE_KEYS.title);
//     } else {
//       sessionStorage.setItem(STORAGE_KEYS.title, String(title));
//     }
//     setVideoTitleState(title);
//   };

//   const [topics, setTopicsState] = useState<TopicResponse[] | null>(() => {
//     const saved = sessionStorage.getItem(STORAGE_KEYS.topics);
//     return saved ? JSON.parse(saved) : null;
//   });

//   useEffect(() => {
//     if (topics) {
//       sessionStorage.setItem(STORAGE_KEYS.topics, JSON.stringify(topics));
//     }
//   }, [topics]);

//   const setTopics = (topics: TopicResponse[] | null) => {
//     if (topics === null) {
//       sessionStorage.removeItem(STORAGE_KEYS.topics);
//     }
//     setTopicsState(topics);
//   };

//   const [completedTopics, setCompletedTopics] = useState<Set<number>>(() => {
//     const saved = localStorage.getItem(STORAGE_KEYS.completedTopics);

//     if (!saved) return new Set();

//     return new Set(JSON.parse(saved));
//   });

//   useEffect(() => {
//     localStorage.setItem(
//       STORAGE_KEYS.completedTopics,
//       JSON.stringify([...completedTopics]),
//     );
//   }, [completedTopics]);
//   const toggleTopicComplete = (segmentId: number) => {
//     setCompletedTopics((prev) => {
//       const next = new Set(prev);
//       if (next.has(segmentId)) {
//         next.delete(segmentId);
//       } else {
//         next.add(segmentId);
//       }
//       return next;
//     });
//   };

//   const goToNextTopic = () => {
//     if (!topics || !selectedTopic) return;

//     const currentIndex = topics.findIndex(
//       (topic) => topic.segment_id === selectedTopic.segment_id,
//     );

//     if (currentIndex === -1) return;

//     const nextTopic = topics[currentIndex + 1];

//     if (!nextTopic) return;

//     setSelectedTopic(nextTopic);

//     setSeekTo(nextTopic.start_time);
//   };

//     const [duration, setDuration] = useState<number>(0);
//     function setDurationTime(newDuration: number) {
//       setDuration(newDuration);
      
//     }
   

//   return (
//     <LearningSessionContext.Provider
//       value={{
//         videoId,
//         setVideoId,
//         selectedTopic,
//         setSelectedTopic,
//         currentTime,
//         setCurrentTime,
//         seekTo,
//         setSeekTo,
//         videoTitle,
//         setVideoTitle,
//         topics,
//         setTopics,
//         completedTopics,
//         toggleTopicComplete,
//         goToNextTopic,
//         duration,
//         setDurationTime,
//        // handleSetVideoTitle
//       }}
//     >
//       {children}
//     </LearningSessionContext.Provider>
//   );
// }

import { createContext, useEffect, useState } from "react";
import type { TopicResponse } from "../../../features/watch_video/domin/entity/topic_response";
import type { LearningSessionContextType } from "./learning_constent_context";
import { STORAGE_KEYS } from "../../constants";

export const LearningSessionContext =
  createContext<LearningSessionContextType | null>(null);

export function LearningSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seekTo, setSeekTo] = useState<number | null>(null);

    const [currentTime, setCurrentTime] = useState<number>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEYS.currentTime);
    return saved ? Number(saved) : 0;
  });

    useEffect(() => {
    console.log("Current time updated:", currentTime);
    sessionStorage.setItem(STORAGE_KEYS.currentTime, String(currentTime));
  }, [currentTime]);

  const [selectedTopic, setSelectedTopic] =
    useState<TopicResponse | null>(null);

  
  const [videoId, setVideoIdState] = useState<number | null>(() => {
    const stored = sessionStorage.getItem(STORAGE_KEYS.video_Id);
    return stored ? Number(stored) : null;
  });

  const setVideoId = (id: number | null) => {
    if (id === null) {
      sessionStorage.removeItem(STORAGE_KEYS.video_Id);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.video_Id, String(id));
    }
    setVideoIdState(id);
  };

  const [videoTitle, setVideoTitle] = useState<string | null>(
    null,
  );

  const [topics, setTopics] = useState<TopicResponse[] | null>(
    null,
  );

 
  const [completedTopics, setCompletedTopics] = useState<
    Set<number>
  >(() => {
    const saved = localStorage.getItem(
      STORAGE_KEYS.completedTopics,
    );

    if (!saved) return new Set();

    return new Set(JSON.parse(saved));
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.completedTopics,
      JSON.stringify([...completedTopics]),
    );
  }, [completedTopics]);

  const toggleTopicComplete = (segmentId: number) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);

      if (next.has(segmentId)) {
        next.delete(segmentId);
      } else {
        next.add(segmentId);
      }

      return next;
    });
  };

  const goToNextTopic = () => {
    if (!topics || !selectedTopic) return;

    const currentIndex = topics.findIndex(
      (topic) =>
        topic.segment_id === selectedTopic.segment_id,
    );

    if (currentIndex === -1) return;

    const nextTopic = topics[currentIndex + 1];

    if (!nextTopic) return;

    setSelectedTopic(nextTopic);

    setSeekTo(nextTopic.start_time);
  };

  const [duration, setDuration] = useState<number>(0);

  function setDurationTime(newDuration: number) {
    setDuration(newDuration);
  }

  return (
    <LearningSessionContext.Provider
      value={{
        videoId,
        setVideoId,

        selectedTopic,
        setSelectedTopic,

        currentTime,
        setCurrentTime,

        seekTo,
        setSeekTo,

        videoTitle,
        setVideoTitle,

        topics,
        setTopics,

        completedTopics,
        toggleTopicComplete,

        goToNextTopic,

        duration,
        setDurationTime,
      }}
    >
      {children}
    </LearningSessionContext.Provider>
  );
}
