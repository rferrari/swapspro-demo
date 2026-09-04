import Link from 'next/link';
import { notFound } from 'next/navigation';
import DocLayout from '@/components/DocLayout';
import PageHeader from '@/components/PageHeader';
import Section from '@/components/Section';
import ParamTable from '@/components/ParamTable';
import { TOOLS, toolBySlug } from '@/lib/tools';

export function generateStaticParams() {
  return TOOLS.map((t) => ({ slug: t.slug }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = toolBySlug(slug);
  if (!tool) notFound();

  return (
    <DocLayout href="/tools">
      <PageHeader eyebrow="Tools" title={tool.name} intro={<p>{tool.tagline}</p>} doc={tool.doc} />

      <Section title="What it does">
        {tool.body.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </Section>

      <Section title="The three questions an integrator asks">
        <ParamTable
          nameHeader=""
          rows={[
            { name: 'Signs', effect: tool.signs },
            { name: 'Costs', effect: tool.cost },
            { name: 'Refuses', effect: tool.refuses },
          ]}
        />
        <div className="flex flex-wrap gap-3 pt-2">
          {tool.live && (
            <a
              href={tool.live}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#4DF98A] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#3ce577]"
            >
              Open the live tool ↗
            </a>
          )}
          <Link
            href="/tools"
            className="rounded-md border border-white/15 px-4 py-2 text-sm text-gray-300 transition-colors hover:border-[#4DF98A]/40"
          >
            All nine tools
          </Link>
        </div>
      </Section>

      <Section title="Other tools">
        <ul className="grid gap-2 sm:grid-cols-2">
          {TOOLS.filter((t) => t.slug !== tool.slug).map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}`}
                className="block rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition-colors hover:border-[#4DF98A]/40 hover:text-white"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </DocLayout>
  );
}
