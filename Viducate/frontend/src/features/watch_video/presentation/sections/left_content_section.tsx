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
      120,
    ),
    new TopicEntity(
      "State Management in React",
      "Learn how to manage state in React applications",
      180,
    ),
    new TopicEntity(
      "Performance Optimization in React",
      "Learn how to optimize performance in React application",
      240,
    ),
  ];

  return (
    <>
      <div className="flex flex-col h-full w-full  ">
        <div className="flex-1  flex items-center justify-center p-5">
          <SearchTopicBar setSearchQuery={setSearchQuery} />
        </div>
        <div className="flex-[7]  flex items-center justify-center">
          <div className="flex flex-col w-full h-full p-4 gap-3">
            {cards
              .filter((item) => {
                if (searchQuery === "") return true;

                return (
                  item.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  item.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                );
              })
              .map(
                (
                  card,
                  index, // i will use this content of card soon!
                ) => (
                  <ContentLearningCard
                    key={index}
                    isSelected={selectedTopic === index}
                    onClick={() => setSelectedTopic(index)}
                    cardInfo={card}
                  />
                ),
              )}
          </div>
        </div>
      </div>
    </>
  );
}


