import { useState } from "react";
import { ContentLearningCard } from "../widgets/content_learning_card";
import { SearchTopicBar } from "../widgets/search_topic_bar";
import { TopicEntity } from "../../domin/entity/topic_entity";

export function LeftContentSection() {
  const [selectedTopic, setSelectedTopic] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const cards = [
    new TopicEntity(
      "Introduction to React",
      "Learn the basics of React.js",
      120
    ),
    new TopicEntity(
      "State Management in React",
      "Learn how to manage state in React applications",
      180
    ),
    new TopicEntity(
      "Performance Optimization in React",
      "Learn how to optimize performance in React application",
      240
    ),
  ];

  const filteredCards = cards.filter((item) => {
    if (!searchQuery) return true;

    return (
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
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
              isSelected={selectedTopic === index}
              onClick={() => setSelectedTopic(index)}
              cardInfo={card}
            />
          ))}

        </div>
      </div>

    </div>
  );
}