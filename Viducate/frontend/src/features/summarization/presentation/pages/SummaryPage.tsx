import { useEffect, useState } from "react";
import { COLORS } from '../../../../core/constants/colors';
import { SummaryHeader } from '../componants/SummaryHeader';
import { TakeawayList } from '../componants/TakeawayList';
import { QuizCard } from '../componants/QuizCard';
import { ToolsCard } from '../componants/ToolsCard';

type SummaryData = {
  title: string;
  takeaways: string[];
  content: {
    type: "heading" | "paragraph";
    text: string;
    highlights?: string[];
  }[];
};

const SummaryPage = () => {
  const [data, setData] = useState<SummaryData | null>(null);

  //Fake API
  useEffect(() => {
    setTimeout(() => {
      setData({
        title: "Topic Summary: Introduction to Psychology",
        takeaways: [
          "Psychology is the scientific study of the mind and behavior.",
          "The nature vs. nurture debate remains central to development.",
          "Early psychological theories were influenced by philosophy.",
          "Understanding research methods is critical for evaluating claims."
        ],
        content: [
          {
            type: "heading",
            text: "Core Concepts & Terminology"
          },
          {
            type: "paragraph",
            text: "Neuroplasticity describes the brain's ability to adapt and change based on experience.",
            highlights: ["Neuroplasticity"]
          },
          {
            type: "heading",
            text: "Historical Context"
          },
          {
            type: "paragraph",
            text: "Structuralism focused on breaking mental processes into their basic components."
          }
        ]
      });
    }, 1000);
  }, []);


  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.background.light }}>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content */}
          <article 
            className="flex-1 w-full min-w-0 rounded-xl shadow-sm p-8 md:p-12"
            style={{ backgroundColor: COLORS.layout.leftBackground }}
          >
            <SummaryHeader title={data?.title || ""} />

            <TakeawayList items={data?.takeaways || []} />

            {/* Dynamic Content */}
            <section className="space-y-8">
              {data?.content.map((item, index) => {
                
                if (item.type === "heading") {
                  return (
                    <h3
                      key={index}
                      className="text-xl font-bold"
                      style={{ color: COLORS.text.primary }}
                    >
                      {item.text}
                    </h3>
                  );
                }

                if (item.type === "paragraph") {
                  let text = item.text;

                  // Highlight logic
                  item.highlights?.forEach(word => {
                    text = text.replace(
                      word,
                      `<span class="px-1 mx-1 rounded font-medium" style="background:#FEF9C3;color:#000">${word}</span>`
                    );
                  });

                  return (
                    <p
                      key={index}
                      className="text-lg leading-relaxed"
                      style={{ color: COLORS.text.secondary }}
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  );
                }

                return null;
              })}

            
            </section>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-8 space-y-6">
            <QuizCard />
            <ToolsCard />
          </aside>
          
        </div>
      </main>
    </div>
  );
};

export default SummaryPage;