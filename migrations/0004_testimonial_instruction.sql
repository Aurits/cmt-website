-- What a testimonial vouches for.
--
-- The public reference card (TestimonialCard.tsx) prints the instruction a quote is about and its
-- year, e.g. "Mortgage valuation, 2025", because a quote that names the job is worth more than one
-- that does not. The type carried both fields but the table had nowhere to store them, so the CMS
-- could not set them. Both optional: a quote without them still publishes.

alter table testimonials add column if not exists instruction text;
alter table testimonials add column if not exists year        text;
