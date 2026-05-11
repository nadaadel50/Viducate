// import { useEffect, useState } from "react";

// import { COLORS } from "../../../../core/constants/colors";

// import { SummaryHeader } from "../componants/SummaryHeader";
// import { TakeawayList } from "../componants/TakeawayList";
// import { QuizCard } from "../componants/QuizCard";
// import { ToolsCard } from "../componants/ToolsCard";
// import { TermTooltip } from "../componants/TermTooltip";
// import { GeneratingSummaryPage } from "./GeneratingSummaryPage";

// type ContentItem = {
//   text: string;
//   type: "normal" | "term";
//   tooltip?: string;
// };

// type Section = {
//   heading: string;
//   content: ContentItem[];
// };

// type SummaryData = {
//   title: string;
//   takeaways: string[];
//   sections: Section[];
// };

// const SummaryPage = () => {
//   const [data, setData] = useState<SummaryData | null>(null);

//   // Fake API
//   useEffect(() => {
//     setTimeout(() => {
//       setData({
//         title: "Topic Summary: Introduction to Psychology",

//         takeaways: [
//           "Psychology is the scientific study of the mind and behavior.",
//           "The nature vs. nurture debate remains central to development.",
//           "Early psychological theories were influenced by philosophy.",
//           "Understanding research methods is critical for evaluating claims.",
//         ],

//         sections: [
//           {
//             heading: "Core Concepts & Terminology",

//             content: [
//               {
//                 text: "Neuroplasticity",
//                 type: "term",
//                 tooltip:
//                   "The brain's ability to reorganize itself by forming new neural connections",
//               },

//               {
//                 text:
//                   " describes the brain's ability to adapt and change based on experience.",
//                 type: "normal",
//               },
//             ],
//           },

//           {
//             heading: "Historical Context",

//             content: [
//               {
//                 text: "Structuralism",
//                 type: "term",
//                 tooltip:
//                   "An early school of psychology that aimed to analyze the structure of the mind",
//               },

//               {
//                 text:
//                   " focused on breaking mental processes into their basic components.",
//                 type: "normal",
//               },
//             ],
//           },
//         ],
//       });
//     }, 1000);
//   }, []);
// if (!data) {
//   return <GeneratingSummaryPage />;
// }
//   return (
//     <div
//       className="min-h-screen flex flex-col"
//       style={{ backgroundColor: COLORS.background.light }}
//     >
//       <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
//         <div className="flex flex-col lg:flex-row gap-8 items-start">
          
//           {/* Main Content */}
//           <article
//             className="flex-1 w-full min-w-0 rounded-xl shadow-sm p-8 md:p-12"
//             style={{ backgroundColor: COLORS.layout.leftBackground }}
//           >
//             <SummaryHeader
//               title={data?.title || ""}
//               time="5 min read"
//             />

//             <TakeawayList items={data?.takeaways || []} />

//             {/* Sections */}
//             <section className="space-y-10">
//               {data?.sections.map((section, index) => (
//                 <div key={index} className="space-y-4">
                  
//                   <h3
//                     className="text-2xl font-bold"
//                     style={{ color: COLORS.text.primary }}
//                   >
//                     {section.heading}
//                   </h3>

//                   <p
//                     className="text-lg leading-relaxed flex flex-wrap gap-[2px]"
//                     style={{ color: COLORS.text.secondary }}
//                   >
//                     {section.content.map((item, idx) => {

//                       if (item.type === "term") {
//                         return (
//                           <TermTooltip
//                             key={idx}
//                             text={item.text}
//                             tooltip={item.tooltip || ""}
//                           />
//                         );
//                       }

//                       return (
//                         <span key={idx}>
//                           {item.text}
//                         </span>
//                       );
//                     })}
//                   </p>
//                 </div>
//               ))}
//             </section>
//           </article>

//           {/* Sidebar */}
//           <aside className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-8 space-y-6">
//             <QuizCard />
//             <ToolsCard />
//           </aside>

//         </div>
//       </main>
//     </div>
//   );
// };

// export default SummaryPage;
import { useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { COLORS } from "../../../../core/constants/colors";
import { SummaryHeader } from "../componants/SummaryHeader";
import { TakeawayList } from "../componants/TakeawayList";
import { QuizCard } from "../componants/QuizCard";
import { ToolsCard } from "../componants/ToolsCard";
import { TermTooltip } from "../componants/TermTooltip";
import { GeneratingSummaryPage } from "./GeneratingSummaryPage";
import { useSegmentSummary } from "../hooks/use_segment_summary";
import type { SummarySection, ContentItem } from "../../domain/entity/summary_entity";

const SummaryPage = () => {
  const { segmentId } = useParams();
  const { state: locationState } = useLocation();
  const { videoId } = locationState || {};

  const { state, fetch } = useSegmentSummary();

  useEffect(() => {
    fetch(Number(videoId), Number(segmentId));
  }, [videoId, segmentId]);

  if (state.status === "idle" || state.status === "loading") {
    return <GeneratingSummaryPage />;
  }

  if (state.status === "error") {
    return <p className="text-center text-red-500 mt-20">{state.message}</p>;
  }

  const { title, summary } = state.data;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: COLORS.background.light }}>
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          <article
            className="flex-1 w-full min-w-0 rounded-xl shadow-sm p-8 md:p-12"
            style={{ backgroundColor: COLORS.layout.leftBackground }}
          >
            <SummaryHeader title={title} time="5 min read" />
            <TakeawayList items={summary.takeaways} />

            <section className="space-y-10">
              {summary.sections.map((section: SummarySection, index: number) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-2xl font-bold" style={{ color: COLORS.text.primary }}>
                    {section.heading}
                  </h3>
                  <p
                    className="text-lg leading-relaxed flex flex-wrap gap-[2px]"
                    style={{ color: COLORS.text.secondary }}
                  >
                    {section.content.map((item: ContentItem, idx: number) =>
                      item.type === "term" ? (
                        <TermTooltip key={idx} text={item.text} tooltip={item.tooltip || ""} />
                      ) : (
                        <span key={idx}>{item.text}</span>
                      )
                    )}
                  </p>
                </div>
              ))}
            </section>
          </article>

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