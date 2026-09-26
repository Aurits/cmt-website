# Mobile

How the public site behaves on a phone, why, and what is left to do. Read this before changing any
layout below 640px.

Every measurement here is from headless Chrome at **390 × 844** (an iPhone 14-class screen), on a
production build, with motion reduced so every section is in its final state.

---

## The principle

**A phone gets the brief version by design, not a squashed desktop.** On a phone the page is one
column, read top to bottom with a thumb, so every section has to earn its height. The desktop
layout is unchanged by anything in this document: every rule below applies under 640px (Tailwind's
`sm`) and nowhere else.

What counts as "brief" is decided per section, but it is always one of three moves, in this order
of preference:

1. **Turn a stack into a rail.** Peer cards side by side on desktop become one horizontal,
   swipeable row, not a column.
2. **Say it once.** A section lead has a short phone version, written as its own sentence.
3. **Hide what repeats.** Copy that restates something the page already said is hidden on a phone.
   Never cut mid-sentence, and never hide the only place a fact appears.

---

## The tools

All three are defined once and documented where they live.

| Tool | Where | Use |
|---|---|---|
| `rail` | `src/app/globals.css`, "THE MOBILE SYSTEM" | `<ul className="rail sm:grid sm:grid-cols-3 sm:gap-4">`. Below `sm` the children scroll sideways and snap, each 84% wide so the next one peeks in. **No bare `grid` or `gap` class** on the same element, or it fights the rail. |
| `leadShort` | `SectionHeading`, `PageHeader` | The lead as it reads on a phone. One sentence that stands alone. Leave it out if the lead is already short. |
| `max-sm:hidden` | anywhere | For repeated supporting copy. Pair it with `sm:hidden` on a phone-only alternative if there is one. Both use `display:none`, so a screen reader only meets the one on screen. |

For content that is useful but long on a phone, a native `<details>` disclosure is the fourth tool:
the advisory deliverables use it. It needs no JavaScript and is accessible for free.

---

## What changed, measured

Page height at 390px, before and after this pass.

| Page | Before | After | Change |
|---|---|---|---|
| Home | 12,990px | 8,442px | −35% |
| Listings | 8,546px | 4,440px | −48% |
| Valuations | 9,759px | 5,996px | −39% |
| About | 7,923px | 5,872px | −26% |
| Advisory | 5,990px | 4,869px | −19% |
| Our clients | 5,341px | 4,046px | −24% |
| Property detail | 7,812px | 6,158px | −21% |
| Listings by type | 6,429px | 3,895px | −39% |

The footer change below took a further ~600px off every page after these were measured.

### By component

- **Homepage purposes and property types:** stacks became rails. The "Not sure which it is?" card
  rides at the end of the property-types rail, where the reader who swiped past all five is the one
  it is for.
- **Homepage identity:** the three reasons show their titles only; each body restated its title.
- **Homepage "in brief":** desktop only until real testimonials exist. It repeated the hero and the
  identity section two screens later. Real references will show everywhere.
- **Property card:** below `sm` a sideways row (photo left, price, title, area, one line of facts),
  with the title's link stretched over the whole card as the tap target. Carries `/listings` and
  "Similar property".
- **Valuations matrix:** below `md` a separate list, one row per purpose (name, the asset types it
  covers, the turnaround once). The grid stacked fifteen cells and ran to ~1,900px.
- **Process timeline** (home and `/valuations`): vertical on a phone, the line through the nodes.
  `/valuations` now uses the same component as the homepage.
- **Offices baseline:** Uganda and Kenya side by side, tighter rows, a key for the head-office mark.
- **About history:** the four stage titles only; they read as the story in one breath.
- **Advisory:** the deliverables fold into "What you receive (4)".
- **Page headers and closing banners:** less padding, short leads, and the banner paragraph is
  desktop only; the heading and buttons carry it.
- **Client logos with motion reduced:** two plates per row, not one.
- **Footer:** brand, Valuations and Office only. The Site and Property types lists repeat the menu.
  Office is full width so the email address no longer breaks mid-word.
- **Director tiles:** 2:1 instead of 4:3 while they hold only initials.

Checked after the pass: no page on the site scrolls sideways at 390px or 1440px (all 38 pages).

---

## Rules for the next person

- **Measure before and after.** A mobile change that is not measured is a guess. `.tmp-shot/` holds
  the scripts used here: `mheights.mjs` measures every page at 390px, `mstrip.mjs` renders a whole
  page as side-by-side columns so one image shows the full scroll, and `audit.mjs` checks every page
  for sideways overflow, broken images and console errors.
- **Write the short lead, do not truncate the long one.** "Most of our work starts with one of these
  three" is a sentence. The first twelve words of a longer one is not.
- **Never hide the only instance of a fact.** Everything hidden on a phone in this pass is said
  elsewhere on the same page, or one tap away.
- **Keep the phone and desktop versions in the same component**, side by side in the markup, so a
  copy edit to one is visibly next to the other.

## Still to do

In rough order of value:

1. **Test on a real phone**, on a mid-range Android over mobile data. Everything here was measured in
   desktop Chrome at phone width, which is close but does not show real scrolling, tap accuracy or
   load time.
2. **Property detail page** (6,158px): the enquiry form sits below the gallery, facts, description,
   inclusions and map. Consider a short "Enquire" button near the price that jumps to it, and a
   collapsed description.
3. **Contact forms:** the office panel and map follow the form on a phone. The map could be a
   tappable static image that opens Maps, which is lighter and more useful on a phone.
4. **Rail affordance:** the peek works, but a small "1 / 3" indicator under each rail would help
   readers who do not think to swipe.
5. **The mobile menu drawer** has not been reviewed in this pass.
