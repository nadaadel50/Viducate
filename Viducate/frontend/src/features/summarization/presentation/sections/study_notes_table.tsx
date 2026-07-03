import { COLORS } from "../../../../core/constants/colors";
import { FONT_STYLES } from "../../../../core/constants/fonts";

type StudyNotesTableProps = {
  table: {
    title: string;
    headers: string[];
    rows: string[][];
  };
};

export function StudyNotesTable({ table }: StudyNotesTableProps) {
  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
        <h3
          className={FONT_STYLES.cardTitle}
          style={{ color: COLORS.text.primary }}
        >
          {table.title}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-100 bg-white">
            <tr>
              {table.headers.map((header, index) => (
                <th
                  key={index}
                  className={`${FONT_STYLES.caption} px-4 py-3 uppercase tracking-wider text-gray-500`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {table.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="transition-colors hover:bg-gray-50/50"
              >
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`${FONT_STYLES.body} px-4 py-3.5`}
                    style={{ color: COLORS.text.secondary }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
