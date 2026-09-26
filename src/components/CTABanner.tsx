import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cx } from '@/lib/cx';

/**
 * Closing CTA. With an image it goes full-bleed dark green over the photograph; without
 * one it is a flat green block, which is the lighter option for pages that already carry
 * a lot of imagery.
 */
export function CTABanner({
  title,
  lead,
  primary,
  secondary,
  image,
  imageAlt = '',
  className,
}: {
  title: string;
  lead?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: string;
  imageAlt?: string;
  className?: string;
}) {
  return (
    <section className={cx('relative overflow-hidden bg-green', className)}>
      {image && (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark enough for cream type at AA, light enough that the photograph reads. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-green/95 via-green/80 to-green/55"
          />
        </>
      )}
      <Container className="relative py-14 lg:py-20">
        {/* rem, not ch, for the same reason as SectionHeading: 46ch at body size is ~400px. */}
        <div className="max-w-[40rem]">
          <span aria-hidden="true" className="mb-5 block h-[3px] w-10 bg-gold" />
          <h2 className="max-w-[20ch] text-h2 text-balance text-cream">{title}</h2>
          {lead && (
            <p className="mt-4 max-w-[52ch] text-lead leading-relaxed text-cream/80">
              {lead}
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={primary.href} variant="gold" size="lg">
              {primary.label}
            </Button>
            {secondary && (
              <Button href={secondary.href} variant="onDark" size="lg">
                {secondary.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
