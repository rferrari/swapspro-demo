import type { ReactNode } from 'react';

/** A titled block of explanation. Anchored so the on-page nav can link to it. */
export default function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-white/5 py-8 first:border-t-0">
      {title && (
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-white">
          {title}
        </h2>
      )}
      <div className="space-y-4 text-[15px] leading-relaxed text-gray-300 [&_a]:text-[#4DF98A] [&_a]:underline-offset-2 hover:[&_a]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em] [&_code]:text-[#9beec0] [&_li]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
