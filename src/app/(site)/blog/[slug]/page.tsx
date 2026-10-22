import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CTABanner } from '@/components/CTABanner';
import { Container } from '@/components/ui/Container';
import { getPost, getPosts, getTeam } from '@/lib/content';

export async function generateStaticParams() {
  return (await getPosts()).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getPost(slug);
  if (!note) return {};
  return { title: note.title, description: note.finding };
}

/**
 * One note.
 *
 * Single column at the reading measure with the key figures held in a sticky rail beside it, so
 * the numbers stay in view while the prose that explains them scrolls past. That is the whole
 * reason the rail exists: a reader checking a figure should not have to hunt back up the page for
 * it. Below lg it unsticks and sits above the body, because a sticky rail on a phone eats the
 * viewport, which is the same rule the valuation purpose pages follow.
 *
 * The body is rendered without a markdown dependency. Blank lines make paragraphs and a leading
 * "## " makes a subheading, which is exactly what the admin form tells the writer they can do.
 * Anything richer than that is a library and a bundle this site has so far not needed.
 */
function PostBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((block) => block.trim()).filter(Boolean);

  return (
    <div className="mt-8 grid gap-5">
      {blocks.map((block, index) =>
        block.startsWith('## ') ? (
          <h2 key={index} className="mt-4 text-h3 text-green">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={index} className="max-w-[66ch] text-lead leading-relaxed text-ink/85">
            {block}
          </p>
        ),
      )}
    </div>
  );
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = await getPost(slug);
  if (!note) notFound();

  const [team, posts] = await Promise.all([getTeam(), getPosts()]);
  const author = note.authorId ? team.byId[note.authorId] : undefined;
  const others = posts.filter((item) => item.slug !== note.slug).slice(0, 3);
  const date = new Date(`${note.publishedAt.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <>
      <section>
        <Container className="pt-8 pb-12 min-[961px]:pt-12 lg:pb-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
              <li>
                <Link href="/" className="hover:text-green">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-rule-strong">
                /
              </li>
              <li>
                <Link href="/blog" className="hover:text-green">
                  Blog
                </Link>
              </li>
            </ol>
          </nav>

          <span aria-hidden="true" className="mb-6 block h-[3px] w-10 rounded-full bg-gold" />
          <h1 className="max-w-[24ch] text-h1 tracking-[-0.02em] text-balance text-green">{note.title}</h1>
          <p className="mt-5 max-w-[46ch] font-display text-subhead leading-snug text-moss">
            {note.finding}
          </p>
          <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-green/12 pt-5 text-[13px] text-muted">
            <span className="tnum">{date}</span>
            {author && (
              <>
                <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
                <span>
                  {author.name}, {author.role}
                </span>
              </>
            )}
          </p>
        </Container>
      </section>

      <section className="pb-16 lg:pb-24">
        <Container className="grid gap-10 lg:grid-cols-[1.55fr_1fr] lg:gap-14">
          <div>
            <p className="max-w-[62ch] text-hero-lead leading-[1.6] text-prose">{note.excerpt}</p>
            <PostBody body={note.body} />

            {note.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2 border-t border-green/12 pt-6">
                {note.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-chip px-3 py-1 text-[12px] text-muted"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <aside className="lg:sticky lg:top-[calc(var(--header-h)+16px)] lg:self-start">
            {note.pullFigure && (
              <div className="rounded-[24px] border border-green/8 bg-white p-6">
                <span aria-hidden="true" className="mb-4 block h-[3px] w-7 rounded-full bg-gold" />
                <p className="tnum font-display text-stat leading-none font-semibold text-green">
                  {note.pullFigure}
                </p>
                {note.pullCaption && (
                  <p className="mt-3 text-body leading-snug text-muted">{note.pullCaption}</p>
                )}
              </div>
            )}

            {note.keyFigures.length > 0 && (
              <div className="mt-5 rounded-[24px] border border-green/8 bg-white p-6">
                <h2 className="font-sans text-[12px] font-semibold tracking-[0.14em] text-moss uppercase">Key figures</h2>
                <dl className="mt-3">
                  {note.keyFigures.map((figure) => (
                    <div key={figure.label} className="schedule-row text-body">
                      <dt className="text-muted">{figure.label}</dt>
                      <dd className="tnum text-right font-semibold text-green">{figure.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-5 rounded-[24px] bg-sage-soft p-6">
              <h2 className="font-display text-h4 font-semibold text-green">Where this comes from</h2>
              <p className="mt-2 text-body leading-relaxed text-muted">
                Posts here are written from instructions we actually took, not from listings data or
                press releases. If a figure here matters to a decision you are making, ask us about
                the property in front of you rather than the average.
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="pb-16 lg:pb-24">
          <Container>
            <h2 className="font-sans text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">More from the blog</h2>
            <ul className="mt-6 grid gap-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group flex flex-col gap-1 rounded-[20px] border border-green/8 bg-white p-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                  >
                    <span className="font-display text-h4 font-semibold text-green group-hover:text-moss">
                      {item.title}
                    </span>
                    <span className="max-w-[52ch] text-body leading-snug text-muted">
                      {item.finding}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CTABanner
        title="Ask about your own property"
        lead="An average is a starting point, not an answer. A valuation is the answer."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'The whole blog', href: '/blog' }}
      />
    </>
  );
}
