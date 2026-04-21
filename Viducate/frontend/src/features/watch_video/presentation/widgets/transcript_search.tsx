import { PlayCircle, Search } from "lucide-react";
import { useState } from "react";

export function TranscriptSearch() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockResults = [
    {
      id: 1,
      time: "18:05",
      text: "applying the quotient rule for the limit of a rational function is straightforward...",
    },
    {
      id: 2,
      time: "21:10",
      text: "we can simplify the expression before taking the limit to avoid undefined forms...",
    },
    {
      id: 3,
      time: "25:40",
      text: "another example of limit using substitution method...",
    },
  ];

  function highlightText(text: string, query: string) {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");

    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark
          key={index}
          className="bg-amber-200/50 text-amber-900 px-0.5 font-medium rounded-sm"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  const filteredResults = mockResults.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-5xl mx-auto">

      {/* input */}
      <div className="relative group w-full">
        <Search className="text-slate-400 absolute w-4 h-4 left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[#4f46e5] transition-colors" />

        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Search with any keyword in the video..."
          className="placeholder:text-slate-400 w-full bg-white border border-slate-200 shadow-sm rounded-xl py-3 px-10 focus:border-[#4f46e5] focus:ring-[#4f46e5] focus:ring-1 focus:outline-none transition"
        />
      </div>

      {/* results */}
      {/* {filteredResults.map((item) => (
        <button
          key={item.id}
          className="cursor-pointer w-full text-left group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 hover:bg-slate-50 hover:border-[#4f46e5]/40 transition shadow-sm"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-500 group-hover:bg-[#4f46e5]/10 group-hover:text-[#4f46e5] transition">
              <PlayCircle size={16} className="mr-1" />
              {item.time}
            </span>
          </div>

          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {highlightText(item.text, searchQuery)}
          </p>
        </button>
      ))} */}

    </div>
  );
}