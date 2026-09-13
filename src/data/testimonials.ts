import type { Testimonial } from '@/lib/types';

/**
 * Intentionally empty.
 *
 * The brief allows real, named testimonials only, and forbids carrying over the current
 * site's Lorem ipsum placeholders. CMT has not supplied any real ones yet, and inventing
 * a quote and attributing it to a bank would be a straightforward misrepresentation.
 * The homepage renders an honest empty state until this array is filled; drop entries in
 * here and the section switches to real cards with no other change.
 */
export const testimonials: Testimonial[] = [];
