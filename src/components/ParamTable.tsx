import type { ReactNode } from 'react';

export interface ParamRow {
  name: string;
  type?: string;
  values?: string;
  /** Use "required" for a parameter with no default. */
  def?: string;
  effect: ReactNode;
}

/** The reference table: what you may send, and what it does. */
export default function ParamTable({
  rows,
  nameHeader = 'Parameter',
}: {
  rows: ParamRow[];
  nameHeader?: string;
}) {
  const showValues = rows.some((r) => r.values);
  const showDefault = rows.some((r) => r.def);
  const showType = rows.some((r) => r.type);

  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wide text-gray-400">
          <tr>
            <th className="px-4 py-2.5 font-medium">{nameHeader}</th>
            {showType && <th className="px-4 py-2.5 font-medium">Type</th>}
            {showValues && <th className="px-4 py-2.5 font-medium">Values</th>}
            {showDefault && <th className="px-4 py-2.5 font-medium">Default</th>}
            <th className="px-4 py-2.5 font-medium">Effect</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((r) => (
            <tr key={r.name} className="align-top">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-[#4DF98A]">
                {r.name}
              </td>
              {showType && (
                <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-gray-400">
                  {r.type ?? '—'}
                </td>
              )}
              {showValues && (
                <td className="px-4 py-3 font-mono text-[13px] text-gray-400">
                  {r.values ?? '—'}
                </td>
              )}
              {showDefault && (
                <td className="whitespace-nowrap px-4 py-3 font-mono text-[13px] text-gray-400">
                  {r.def ?? '—'}
                </td>
              )}
              <td className="px-4 py-3 text-gray-300">{r.effect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
