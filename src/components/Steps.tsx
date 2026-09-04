import type { ReactNode } from 'react';

export interface Step {
  title: string;
  body: ReactNode;
}

/**
 * "How to implement": each step is one thing to do, paired with the code that
 * does it. Numbered so a reader can follow it top to bottom into their own app.
 */
export default function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="my-6 space-y-8">
      {steps.map((s, i) => (
        <li key={s.title} className="relative pl-11">
          <span className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#4DF98A]/40 bg-[#4DF98A]/10 text-sm font-semibold text-[#4DF98A]">
            {i + 1}
          </span>
          <h3 className="mb-2 pt-0.5 font-semibold text-white">{s.title}</h3>
          <div className="space-y-3 text-[15px] leading-relaxed text-gray-300 [&_a]:text-[#4DF98A] [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-[#9beec0]">
            {s.body}
          </div>
        </li>
      ))}
    </ol>
  );
}
