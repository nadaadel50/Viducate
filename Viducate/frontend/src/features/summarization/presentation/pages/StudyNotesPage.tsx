import { useEffect, useState } from "react";
import { COLORS } from "../../../../core/constants/colors";
import { SummaryHeader } from "../componants/SummaryHeader";
import { QuizCard } from "../componants/QuizCard";
import { ToolsCard } from "../componants/ToolsCard";
import { TermTooltip } from "../componants/TermTooltip";
import { TakeawayList } from "../componants/TakeawayList"; // المكون الجديد
import { GeneratingStudyNotesPage  } from "../pages/GeneratingStudyNotesPage"; // صفحة التحميل
/* ================= TYPES ================= */

 type ContentItem = {
  text: string;
  type: "normal" | "term" | "important";
  tooltip?: string;
};

type Definition = {
  term: string;
  meaning: string;
};

type Table = {
  title: string;
  headers: string[];
  rows: string[][];
};

type Section = {
  heading: string;
  explanation: ContentItem[];
  definitions?: Definition[];
  examples?: string[];
  tables?: Table[];
  notes?: string[];
};

type StudyNotesData = {
  title: string;
  introduction: string; 
  sections: Section[];
};

/* ================= PAGE ================= */

const StudyNotesPage = () => {
  const [data, setData] = useState<StudyNotesData | null>(null);

  /* Fake API */
  useEffect(() => {
    setTimeout(() => {
      setData({
        title: "Study Notes: Introduction to Psychology",
        introduction: "Welcome to your study notes summary. This document provides a concise overview of fundamental psychological concepts, including how we learn through association and how our memory systems process and store information. Review the highlighted terms and examples to solidify your understanding of these core theories.",
        sections: [
          {
            heading: "Classical Conditioning",
            explanation: [
              { text: "Classical conditioning", type: "term", tooltip: "Learning through association between stimuli" },
              { text: " is a behavioral theory introduced by ", type: "normal" },
              { text: "Ivan Pavlov", type: "important", tooltip: "Russian psychologist famous for dog experiments" },
              { text: ".", type: "normal" }
            ],
            definitions: [
              { term: "Stimulus", meaning: "Anything that triggers a response" },
              { term: "Response", meaning: "Reaction caused by stimulus" }
            ],
            examples: [
              "Dog salivating when hearing a bell",
              "Learning fear from experience"
            ],
            tables: [
              {
                title: "Conditioning Types",
                headers: ["Type", "Meaning"],
                rows: [
                  ["Classical", "Association between stimuli"],
                  ["Operant", "Learning via rewards/punishment"]
                ]
              }
            ],
            notes: [
              "Repetition strengthens learning",
              "Timing between stimulus and response is important"
            ]
          },
          {
            heading: "Memory Systems",
            explanation: [
              { text: "Memory", type: "term", tooltip: "System for storing and retrieving information" },
              { text: " is divided into short-term and long-term systems.", type: "normal" }
            ],
            definitions: [
              { term: "Encoding", meaning: "Process of converting info into memory" },
              { term: "Retrieval", meaning: "Accessing stored information" }
            ],
            examples: [
              "Remembering a phone number briefly",
              "Recalling childhood memories"
            ],
            notes: ["Sleep improves memory consolidation"]
          }
        ]
      });
    }, 1000);
  }, []);

if (!data) {
  return <GeneratingStudyNotesPage />;
}
  return (
    <div className="min-h-screen font-sans antialiased" style={{ backgroundColor: COLORS.background.light }}>
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* MAIN CONTENT AREA */}
          <article 
            className="flex-1 w-full rounded-2xl shadow-sm p-8 md:p-12 border border-gray-100"
            style={{ backgroundColor: COLORS.layout.leftBackground }}
          >
            
            {/* Header Info */}
            <SummaryHeader title={data.title} time="10 min read" />

            {/* INTRODUCTION */}
            <div className="mb-12 leading-relaxed text-lg" style={{ color: COLORS.text.secondary }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.text.primary }}>Introduction</h2>
              <p>{data.introduction}</p>
            </div>

            {/* SECTIONS */}
            <div className="space-y-16">
              {data.sections.map((section, index) => (
                <div key={index} className="space-y-6">
                  {/* Section Heading */}
                  <h2 className="text-2xl font-bold pb-2 border-b-2 border-gray-50" style={{ color: COLORS.text.primary }}>
                    {section.heading}
                  </h2>

                  {/* Explanation with Tooltips */}
                  <div className="text-lg leading-relaxed flex flex-wrap gap-x-1" style={{ color: COLORS.text.secondary }}>
                    {section.explanation.map((item, idx) => {
                      if (item.type === "term" || item.type === "important") {
                        return (
                          <TermTooltip
                            key={idx}
                            text={item.text}
                            tooltip={item.tooltip || ""}
                          />
                        );
                      }
                      return <span key={idx}>{item.text}</span>;
                    })}
                  </div>

                  {/* Definitions */}
                  {section.definitions && section.definitions.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="font-bold text-xl" style={{ color: COLORS.text.primary }}>Core Concepts & Terminology</h3>
                      <div className="space-y-3">
                        {section.definitions.map((d, i) => (
                          <p key={i} className="text-lg">
                            <span className="font-bold" style={{ color: COLORS.text.primary }}>{d.term}: </span>
                            <span style={{ color: COLORS.text.secondary }}>{d.meaning}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TakeawayList Component - المكون اللي بعتيه */}
                  {section.notes && section.notes.length > 0 && (
                    <TakeawayList items={section.notes} />
                  )}

                  {/* Examples */}
                  {section.examples && section.examples.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-bold text-xl mb-3" style={{ color: COLORS.text.primary }}>Key Examples</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {section.examples.map((ex, i) => (
                          <li key={i} className="text-lg leading-relaxed" style={{ color: COLORS.text.secondary }}>{ex}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tables */}
                  {section.tables?.map((table, i) => (
                    <div key={i} className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">
                         {table.title}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead className="bg-white border-b border-gray-100">
                            <tr>
                              {table.headers.map((h, j) => (
                                <th key={j} className="py-3 px-4 font-semibold text-gray-500 uppercase tracking-wider text-[11px]">
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 bg-white">
                            {table.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="py-3.5 px-4" style={{ color: COLORS.text.secondary }}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="w-full lg:w-80 space-y-6 lg:sticky lg:top-8">
            <QuizCard />
            <ToolsCard />
          </aside>

        </div>
      </main>
    </div>
  );
};

export default StudyNotesPage;