import {  useEffect, useState } from "react";
import { ContentLearningCard } from "../widgets/content_learning_card";
import { SearchTopicBar } from "../widgets/search_topic_bar";
import { TopicResponse } from "../../domin/entity/topic_response";
import { useSelectedTopic } from "../context/topic_context";

export function LeftContentSection() {
  const fakeTopics: TopicResponse[] = [
    new TopicResponse(1, 3, 1, 0, 60, "Introduction", "What is AI?"),
    new TopicResponse(2, 3, 2, 61, 120, "Basics", "Machine Learning Basics"),
    new TopicResponse(
      3,
      3,
      3,
      121,
      186,
      "Deep Learning",
      "Neural Networks Intro",
    ),
    new TopicResponse(4, 3, 4, 187, 600, "Applications", "AI in Real Life"),
  ];

  const [focusTopic, setfocusTopic] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentTime, setSelectedTopic, setChangeProgressValue } =
    useSelectedTopic();

  useEffect(() => {
    const currentTopicIndex = fakeTopics.findIndex(
      (topic) =>
        currentTime >= topic.start_time && currentTime <= topic.end_time,
    );
    if (currentTopicIndex !== -1) {
      const newTopic = fakeTopics[currentTopicIndex];
      setfocusTopic(currentTopicIndex);
      setChangeProgressValue(false);
      setSelectedTopic((prev) => {
        if (prev?.segment_id === newTopic.segment_id) return prev;
        return newTopic;
      });
    }
  }, [currentTime]);

  let cards: TopicResponse[] = fakeTopics;
  //const { data: topics } = useVideoData(3);

  const filteredCards = cards.filter((item) => {
    if (!searchQuery) return true;

    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col h-full w-full ">
      {/* { SEARCH BAR} */}
      <div className="p-4 border-b border-slate-100">
        <SearchTopicBar setSearchQuery={setSearchQuery} />
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 p-4 max-w-md mx-auto w-full">
          {filteredCards.map((card, index) => (
            <ContentLearningCard
              key={index}
              isSelected={focusTopic === index}
              onClick={() => setfocusTopic(index)}
              cardInfo={card}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
