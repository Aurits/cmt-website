import type { Metadata } from 'next';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { getPosts, getTeam } from '@/lib/content';
import { site } from '@/data/site';
import type { Agent, BlogPost } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Short posts from ${site.shortName} on what we are seeing across Uganda and Kenya: where rents moved, what banks are lending against, and which corridors are absorbing stock.`,
};

/**
 * A research library, not a blog.
 *
 * Cards with featured images and read-times signal content marketing. A ruled index with dates,
 * findings and a figure in tabular numerals signals research, which is what CMT is competing on
 * here: Knight Frank owns the market-commentary ground in this country and everyone else competes
 * on adjectives. The format has to carry the seriousness before a word is read.
 *
 * The index borrows the site's own schedule motif deliberately. Date on the left, finding in the
 * middle, figure right-aligned in tabular numerals — the same shape as the key facts panel on a
 * property and the standing schedule on /about. A valuation firm publishing research should look
 * like a valuation firm.
 *
 * See docs/LAYOUT-SPECS.md A-07.
 */
function formatDate(iso: string): string {
  const date = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function LatestNote({ note, author }: { note: BlogPost; author?: Agent }) {
  return (
    <article className="pb-16 lg:pb-24">
      <Container>
        <div className="grid gap-10 rounded-(--radius-plate) bg-sage-soft px-6 py-12 min-[601px]:px-12 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16 lg:py-16">
          <div>
            <p className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">
              <span aria-hidden="true" className="h-[3px] w-10 shrink-0 rounded-full bg-gold" />
              Latest post
            </p>
            <h2 className="mt-5 max-w-[22ch] text-h2 tracking-[-0.02em] text-green">
              <Link href={`/blog/${note.slug}`} className="hover:text-moss">
                {note.title}
              </Link>
            </h2>
            <p className="mt-5 max-w-[58ch] text-lead leading-relaxed text-prose">
              {note.excerpt}
            </p>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-micro text-muted">
              <span className="tnum">{formatDate(note.publishedAt)}</span>
              {author && (
                <>
                  <span aria-hidden="true" className="h-3 w-px bg-rule-strong" />
                  <span>{author.name}</span>
                </>
              )}
            </p>
          </div>

          {/* The figure. This is what gets quoted, and it is most of the reason to publish. */}
          {note.pullFigure && (
            <div className="rounded-[24px] bg-white p-6">
              <span aria-hidden="true" className="mb-4 block h-[3px] w-7 rounded-full bg-gold" />
              <p className="tnum font-display text-stat leading-none font-semibold text-green">
                {note.pullFigure}
              </p>
              {note.pullCaption && (
                <p className="mt-3 max-w-[30ch] text-body leading-snug text-muted">
                  {note.pullCaption}
                </p>
              )}
            </div>
          )}
        </div>
      </Container>
    </article>
  );
}

export default async function BlogPage() {
  const [notes, team] = await Promise.all([getPosts(), getTeam()]);
  const [latest, ...rest] = notes;

  return (
    <>
      <PageHeader
        title="What we are actually seeing"
        lead="A few posts a year, written from the instructions we took rather than from press releases. Short, dated, and each one built around a number you can quote."
        leadShort="Written from the instructions we took, not from press releases."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      />

      {notes.length === 0 ? (
        <section className="pb-16 lg:pb-24">
          <Container>
            <div className="max-w-[760px] rounded-(--radius-card) border border-green/8 bg-white p-6 sm:p-10">
              <span aria-hidden="true" className="mb-5 block h-[3px] w-10 rounded-full bg-gold" />
              <h2 className="font-display text-h3 font-semibold text-green">Our first post is on its way</h2>
              <p className="mt-4 text-lead leading-relaxed text-prose">
                Each post will report something we have seen in our own work: where rents are
                moving, what banks are lending against, which areas are in demand. Every one dated,
                signed, and with the figures behind it.
              </p>
              <div className="mt-7 border-t border-hair pt-5">
                <p className="text-body text-muted">
                  In the meantime, see what we do.{' '}
                  <Link
                    href="/valuations"
                    className="font-medium text-green underline decoration-gold decoration-2 underline-offset-4 hover:text-moss"
                  >
                    See what we are instructed to do
                  </Link>
                  .
                </p>
              </div>
            </div>
          </Container>
        </section>
      ) : (
        <>
          <LatestNote note={latest} author={latest.authorId ? team.byId[latest.authorId] : undefined} />

          {rest.length > 0 && (
            <section className="pb-16 lg:pb-24">
              <Container>
                <h2 className="font-sans text-[13px] font-semibold tracking-[0.16em] text-moss uppercase">Earlier posts</h2>
                <ul className="mt-6 grid gap-3">
                  {rest.map((note, index) => (
                    <Reveal as="li" key={note.slug} delay={index * 60}>
                      <Link
                        href={`/blog/${note.slug}`}
                        className="group grid gap-2 rounded-(--radius-card) border border-green/8 bg-white p-6 transition-shadow hover:shadow-[0_28px_56px_-28px_rgba(15,42,26,0.3)] lg:grid-cols-[7rem_1fr_11rem] lg:items-baseline lg:gap-8 lg:p-7"
                      >
                        <span className="tnum text-micro text-muted">
                          {formatDate(note.publishedAt)}
                        </span>
                        <span>
                          <span className="block font-display text-h4 leading-snug text-green group-hover:text-moss">
                            {note.title}
                          </span>
                          <span className="mt-1.5 block max-w-[62ch] text-body leading-relaxed text-muted">
                            {note.finding}
                          </span>
                        </span>
                        {note.pullFigure && (
                          <span className="tnum font-display text-h3 leading-none text-green lg:text-right">
                            {note.pullFigure}
                          </span>
                        )}
                      </Link>
                    </Reveal>
                  ))}
                </ul>
              </Container>
            </section>
          )}
        </>
      )}

      <CTABanner
        title="The figure behind the note"
        lead="These notes come out of instructions. If you need one of your own, that is where it starts."
        primary={{ label: 'Request a valuation', href: '/contact/request-a-valuation' }}
        secondary={{ label: 'How a valuation runs', href: '/valuations' }}
      />
    </>
  );
}
