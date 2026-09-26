import type { Metadata } from 'next';
import Link from 'next/link';
import { CTABanner } from '@/components/CTABanner';
import { Container } from '@/components/ui/Container';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { agentById } from '@/data/agents';
import { sortedPosts } from '@/data/blog';
import { site } from '@/data/site';
import type { BlogPost } from '@/lib/types';

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

function LatestNote({ note }: { note: BlogPost }) {
  const author = note.authorId ? agentById[note.authorId] : undefined;

  return (
    <article className="border-y border-rule bg-mist/50">
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="text-label uppercase tracking-[0.12em] text-gold-deep">Latest post</p>
            <h2 className="mt-4 max-w-[22ch] text-h2 text-green">
              <Link href={`/blog/${note.slug}`} className="hover:text-gold-deep">
                {note.title}
              </Link>
            </h2>
            <p className="mt-5 max-w-[58ch] text-lead leading-relaxed text-ink/85">
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
            <div className="border-t-2 border-gold pt-5">
              <p className="tnum font-display text-stat leading-none text-green">
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

export default function BlogPage() {
  const notes = sortedPosts();
  const [latest, ...rest] = notes;

  return (
    <>
      <PageHeader
        title="What we are actually seeing"
        lead="A few posts a year, written from the instructions we took rather than from press releases. Short, dated, and each one built around a number you can quote."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
      />

      {notes.length === 0 ? (
        <section className="py-14 lg:py-20">
          <Container>
            <div className="max-w-[68ch] border border-dashed border-green/30 bg-paper p-6 sm:p-8">
              <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-gold" />
              <h2 className="text-h3 text-green">The first post is being written</h2>
              <p className="mt-4 text-lead leading-relaxed text-muted">
                This section is empty on purpose. A post here is a claim about what rents are
                doing and what banks are lending against, published under a valuation firm&rsquo;s
                name. Inventing one to fill the page would be fabricating exactly the kind of
                evidence the rest of this site exists to stand behind.
              </p>
              <p className="mt-4 text-body leading-relaxed text-muted">
                When there is something worth reporting from the instructions we have taken, it
                will be here, dated, signed, and with the figures it rests on.
              </p>
              <div className="mt-7 border-t border-rule pt-5">
                <p className="text-body text-muted">
                  In the meantime, the work itself is the better answer.{' '}
                  <Link
                    href="/valuations"
                    className="font-medium text-green underline decoration-gold decoration-2 underline-offset-4 hover:text-gold-deep"
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
          <LatestNote note={latest} />

          {rest.length > 0 && (
            <section className="py-12 lg:py-16">
              <Container>
                <h2 className="text-label uppercase tracking-[0.12em] text-muted">Earlier posts</h2>
                <ul className="mt-6 border-t border-rule">
                  {rest.map((note, index) => (
                    <Reveal as="li" key={note.slug} delay={index * 60}>
                      <Link
                        href={`/blog/${note.slug}`}
                        className="group grid gap-2 border-b border-rule py-6 lg:grid-cols-[7rem_1fr_11rem] lg:items-baseline lg:gap-8"
                      >
                        <span className="tnum text-micro text-muted">
                          {formatDate(note.publishedAt)}
                        </span>
                        <span>
                          <span className="block font-display text-h4 leading-snug text-green group-hover:text-gold-deep">
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
