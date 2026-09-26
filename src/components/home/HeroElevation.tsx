import { cx } from '@/lib/cx';

/**
 * The hero's drawing, in three parts: the backdrop behind the whole hero, the skyline, and the
 * datum it stands on.
 *
 * THE DATUM IS THE LAYOUT. Every survey drawing has a ground line, and every level on it is
 * measured from there. The hero is organised the same way. Above the line: the claim, and the
 * building it is about. On the line: the ground, running the full width of the viewport rather
 * than stopping at the edge of a picture. Below it: the evidence, meaning the ledger and the
 * counter. That replaces the split hero this used to be (words on the left, picture on the
 * right), which is the composition every property site in this market opens with.
 *
 * WHY A DRAWING, AND WHY IN MATERIALS. Four earlier versions of this slot were photographs of
 * buildings CMT has never valued, which is a decorative claim about work that did not happen.
 * A pure line drawing read as a diagram. Render, glass and stone make it property, and the
 * dimensions make it a valuer's property: a photograph says "here is a building", an elevation
 * with a height dimension on it says "this has been measured, by someone who does this
 * properly".
 *
 * THE BUILDING is a tropical-modern office block of the kind Kampala's newer commercial
 * districts are made of: a glass tower wrapped in white sunshade fins, one floor to each fin, a
 * solid stone core down one side, a thin roof slab projecting past the walls for shade, and a
 * two-storey glazed podium with a stone colonnade. It replaced a brick tower with a lower wing,
 * which read as generic, and the trees that stood either side of it, which cluttered the base.
 *
 * ABOUT THESE COLOURS. Pigments in one illustration, not additions to the palette, and declared
 * here rather than in globals.css so nothing else can reach for them. The site has one green,
 * one gold and one cream, and that rule is what holds it together. A rendered building needs
 * render and stone, and neither is a brand colour. Every survey mark, the roofline and the
 * entrance canopy stay gold.
 *
 * NOTHING HERE ASSERTS A FIGURE. The dimension line carries no number: it is the mark for
 * "measured", not a claim about a measurement.
 */

/* ---- Levels, in the skyline's own units. The viewBox is cropped to end exactly on the
 * ground line, so the bottom edge of the SVG IS the datum and the full-bleed line below
 * meets the buildings with no gap to tune. */
const GROUND = 372;
/* 1800 units wide, centred on 525: the middle of the subject group, from the height dimension
 * at 345 to the storey ticks at 644, so the building sits under the centred headline rather
 * than a hair to one side of it. Wide enough that at the skyline's height the street overruns a
 * 1440px viewport on both sides, and the neighbours run off the page edges instead of stopping
 * short and leaving the ground line bare at each end. */
const VIEW = { x: -375, y: 20, w: 1800, h: GROUND - 20 };

/* The massing. The tower sits off-centre on a wider podium, which is what gives the podium a
 * roof of its own on each side and the elevation its asymmetry. */
const PODIUM = { x: 380, w: 290, top: 300 };
const PODIUM_FLOOR = 336;
const TOWER = { x: 420, w: 180, top: 64, bottom: PODIUM.top };
const CORE = { x: 562, w: 38 };
const ROOF = { x: 410, w: 200, top: 56 };

/* Illustration pigments. See above: not palette, not reusable, not exported. */
const RENDER = '#efeadf';
const RENDER_SHADE = '#d8cfbc';
const STONE = '#c9bc9e';
const STONE_DEEP = '#a99c7e';
const GLASS_DEEP = '#16302f';
const DOORWAY = '#13292a';
const DISTANT = '#c9cdc3';
const FIGURE = '#14211a';

const FLOOR = 26;
/* One sunshade fin per floor, so the fins ARE the floors: count them and you have counted the
 * storeys, which is how you read this kind of building from the street. */
const FINS = Array.from({ length: 8 }, (_, i) => TOWER.top + FLOOR * (i + 1));
const MULLIONS = Array.from({ length: 6 }, (_, i) => TOWER.x + 26 + i * 22);
const CORE_SLITS = Array.from({ length: 8 }, (_, i) => TOWER.top + 8 + FLOOR * i);
const COLUMNS = Array.from({ length: 9 }, (_, i) => PODIUM.x + i * 36).concat(PODIUM.x + PODIUM.w - 6);
const LEVEL_TICKS = [116, 168, 220, 272];

/* People, for scale: the cheapest realism cue there is. A storey here is 26 units at the
 * tower and 36 at the podium, so a person is about half a podium storey. */
const FIGURES = [
  { x: 468, h: 17 },
  { x: 552, h: 16 },
  { x: 638, h: 17 },
];

/* THE STREET BEHIND, IN TWO DEPTHS, AND OUT OF FOCUS. The whole drawing is softened (see the
 * svg's class below), and the city behind the subject is blurred further still, so depth reads
 * the way it does through a lens.
 * That is what turns a row of pale rectangles into atmosphere: the eye stops reading them as
 * shapes to be inspected and reads them as distance.
 *
 *   NEAR  the neighbours on the street itself: short, lightly blurred, still recognisably
 *         buildings with a window rhythm and a gold roofline.
 *   FAR   the city beyond: taller, far more blurred and paler, rising further up the hero so
 *         the skyline reaches toward the headline instead of stopping in a flat band. A few
 *         carry a sage or warm-stone tint, so the haze has colour in it rather than one grey.
 *
 * On a phone both crop away at the sides and the subject stays whole. */
const NEAR_MASSES = [
  { x: -392, w: 110, top: 224 },
  { x: -274, w: 84, top: 182 },
  { x: -182, w: 128, top: 238 },
  { x: -46, w: 104, top: 170 },
  { x: 70, w: 120, top: 196 },
  { x: 198, w: 92, top: 156 },
  { x: 742, w: 118, top: 176 },
  { x: 868, w: 96, top: 214 },
  { x: 972, w: 132, top: 160 },
  { x: 1112, w: 90, top: 204 },
  { x: 1210, w: 118, top: 180 },
  { x: 1336, w: 64, top: 230 },
];
const FAR_MASSES = [
  { x: -365, w: 150, top: 120, tint: '#c9cdc3' },
  { x: -196, w: 118, top: 86, tint: '#b4c2b6' },
  { x: -52, w: 170, top: 138, tint: '#d6d1c4' },
  { x: 146, w: 128, top: 98, tint: '#c9cdc3' },
  { x: 290, w: 96, top: 150, tint: '#b4c2b6' },
  { x: 716, w: 112, top: 128, tint: '#d6d1c4' },
  { x: 846, w: 162, top: 92, tint: '#c9cdc3' },
  { x: 1028, w: 118, top: 142, tint: '#b4c2b6' },
  { x: 1166, w: 152, top: 108, tint: '#d6d1c4' },
  { x: 1330, w: 96, top: 152, tint: '#c9cdc3' },
];

/* The sequence: ground laid, distant masses, podium, tower, roof, the fins floor by floor from
 * the bottom up, then the dimensions last because they are the point. */
const T = { distant: 250, podium: 360, tower: 480, roof: 620, fins: 760, dimension: 1400 };

const rise = (ms: number) => ({ '--rise-delay': `${ms}ms` }) as React.CSSProperties;
const fade = (ms: number) => ({ '--fade-delay': `${ms}ms` }) as React.CSSProperties;
const draw = (ms: number) => ({ '--draw-delay': `${ms}ms` }) as React.CSSProperties;

/**
 * The drawing sheet: a faint drafting grid behind everything above the ground line.
 *
 * It replaces an oval that sat behind the whole hero. The oval gave the upper half presence,
 * but it was a shape with no reason to be there. A survey is drawn on gridded paper, so the
 * grid does the same job and belongs to the concept: with it, the claim, the building and the
 * ground line read as one sheet rather than as a headline above a picture.
 *
 * Anchored to the bottom, so its lines meet the datum, and masked into an ellipse so it is
 * strongest around the building and dissolves toward the edges and the top instead of ruling
 * the whole viewport. Where the browser supports scroll-driven animation it drifts slower than
 * the page as the hero scrolls away, which is the one scroll effect here (globals.css).
 */
export function HeroSheet() {
  return (
    <div
      aria-hidden="true"
      className="drafting-grid hero-sheet-drift pointer-events-none absolute inset-0 -z-10"
    />
  );
}

/**
 * The street. The caller sets its height (the hero lays it behind the headline) and its width
 * follows, so the building is the same size on every screen of the same height; on a phone that makes it wider than the viewport, and it is centred and
 * clipped rather than shrunk, which keeps the subject legible and lets the neighbours crop.
 *
 * ONE RULE FOR EVERY ANIMATED ELEMENT BELOW: the animation class goes on a wrapping <g>, and any
 * resting opacity goes on the element inside it. On one element they fight. The fade-in animates
 * opacity to 1 and wins, so a neighbour meant to sit back at 0.42 arrives as a solid slab.
 */
export function HeroSkyline({ className }: { className?: string }) {
  return (
    // Position and height come from the caller: the hero lays this behind its words.
    <div className={cx('w-full overflow-hidden', className)}>
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        role="img"
        aria-label="A measured elevation of an office building on its street: a glass tower with white sunshade fins over a stone colonnade, dimensioned for height."
        // The whole drawing is out of focus: it is the background of the hero's words, not a
        // picture beside them, and a sharp building competed with the headline for the eye. The
        // depth blurs inside (far city heavier than near) still read through it, so the street
        // keeps its distance. Lighter on a phone, where the drawing is drawn at half the size
        // and the same pixel radius would smear it into a single shape.
        className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 blur-[3px] sm:blur-[6px]"
        // Stated rather than left to the viewBox: an inline SVG with width:auto falls back to
        // 300px in some engines unless the ratio is explicit.
        style={{ aspectRatio: `${VIEW.w} / ${VIEW.h}` }}
      >
        <defs>
          {/* Depth of field. Sized to the whole view in user space: the default filter region
              is the element's box plus 10%, which would crop the blur into hard edges at the
              sides of every group. */}
          <filter id="cmt-blur-far" filterUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}>
            <feGaussianBlur stdDeviation={7} />
          </filter>
          <filter id="cmt-blur-near" filterUnits="userSpaceOnUse" x={VIEW.x} y={VIEW.y} width={VIEW.w} height={VIEW.h}>
            <feGaussianBlur stdDeviation={2.4} />
          </filter>
          {/* Glass reflects sky at the top and the street at the bottom, which is what stops a
              curtain wall reading as a flat dark panel. */}
          <linearGradient id="cmt-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#86a3a1" />
            <stop offset="0.5" stopColor="#4a6d6e" />
            <stop offset="1" stopColor="#2c4a4b" />
          </linearGradient>
          {/* Sky, reflected: ONE diagonal band across the whole curtain wall, the way a real
              reflection crosses a facade instead of repeating inside each pane. */}
          <linearGradient
            id="cmt-reflect"
            gradientUnits="userSpaceOnUse"
            x1={TOWER.x}
            y1={TOWER.top}
            x2={CORE.x}
            y2={TOWER.bottom}
          >
            <stop offset="0.3" stopColor="#ffffff" stopOpacity={0} />
            <stop offset="0.4" stopColor="#ffffff" stopOpacity={0.32} />
            <stop offset="0.48" stopColor="#ffffff" stopOpacity={0.1} />
            <stop offset="0.55" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
          {/* Light from the left across the stone: the lit edge and the shaded one. */}
          <linearGradient id="cmt-daylight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" stopOpacity={0.14} />
            <stop offset="1" stopColor="#000000" stopOpacity={0.12} />
          </linearGradient>
          {/* A lit lobby: warm at the floor, cooler where it meets the glass above. */}
          <linearGradient id="cmt-lobby" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2c4a47" />
            <stop offset="1" stopColor="#8a7b4c" />
          </linearGradient>
        </defs>

        {/* The city beyond: far, heavily blurred, pale. */}
        <g className="hero-fade-in" style={fade(T.distant - 150)}>
          <g opacity={0.5} filter="url(#cmt-blur-far)">
            {FAR_MASSES.map((m) => (
              <g key={m.x}>
                <rect x={m.x} y={m.top} width={m.w} height={GROUND - m.top} fill={m.tint} />
                {[0.3, 0.52, 0.74].map((f) => (
                  <rect
                    key={f}
                    x={m.x + m.w * f - 5}
                    y={m.top + 20}
                    width={10}
                    height={GROUND - m.top - 36}
                    fill="#ffffff"
                    opacity={0.45}
                  />
                ))}
              </g>
            ))}
          </g>
        </g>

        {/* The neighbours on the street: near, lightly blurred. */}
        <g className="hero-fade-in" style={fade(T.distant)}>
          <g opacity={0.5} filter="url(#cmt-blur-near)">
            {NEAR_MASSES.map((m) => (
              <g key={m.x}>
                <rect x={m.x} y={m.top} width={m.w} height={GROUND - m.top} fill={DISTANT} />
                <path
                  d={`M${m.x} ${m.top} H${m.x + m.w}`}
                  stroke="var(--color-gold)"
                  strokeWidth={2}
                  opacity={0.6}
                />
                {[0.28, 0.5, 0.72].map((f) => (
                  <rect
                    key={f}
                    x={m.x + m.w * f - 4}
                    y={m.top + 16}
                    width={8}
                    height={GROUND - m.top - 30}
                    fill="#ffffff"
                    opacity={0.4}
                  />
                ))}
              </g>
            ))}
          </g>
        </g>

        {/* PODIUM: two glazed storeys behind a stone colonnade. The lower storey is the lit
            lobby; the upper one is office glass. */}
        <g className="hero-rise-in" style={rise(T.podium)}>
          <rect x={PODIUM.x} y={PODIUM_FLOOR} width={PODIUM.w} height={GROUND - PODIUM_FLOOR} fill="url(#cmt-lobby)" />
          <rect x={PODIUM.x} y={PODIUM.top} width={PODIUM.w} height={PODIUM_FLOOR - PODIUM.top} fill="url(#cmt-glass)" />
          {/* The first-floor slab edge, in stone, dividing the two storeys. */}
          <rect x={PODIUM.x} y={PODIUM_FLOOR - 3} width={PODIUM.w} height={6} fill={STONE} />
          {COLUMNS.map((x) => (
            <rect key={x} x={x} y={PODIUM.top} width={6} height={GROUND - PODIUM.top} fill={STONE} />
          ))}
          {/* The podium cornice, and its own gold roofline on either side of the tower. */}
          <rect x={PODIUM.x - 4} y={PODIUM.top - 5} width={PODIUM.w + 8} height={6} fill={STONE_DEEP} />
          {/* Entrance: a double door under the tower's centreline, a canopy slab over it. */}
          <rect x={494} y={PODIUM_FLOOR + 10} width={34} height={GROUND - PODIUM_FLOOR - 10} fill={DOORWAY} />
          <path d={`M511 ${PODIUM_FLOOR + 10} V${GROUND}`} stroke="#2c4a47" strokeWidth={1} />
          <path d={`M494 ${GROUND} H528`} stroke="var(--color-gold)" strokeWidth={1.5} opacity={0.7} />
        </g>
        <g stroke="var(--color-gold)" strokeWidth={2.5} strokeLinecap="square" fill="none" className="hero-rise-in" style={rise(T.podium)}>
          <path d={`M${PODIUM.x - 4} ${PODIUM.top - 5} H${TOWER.x}`} />
          <path d={`M${TOWER.x + TOWER.w} ${PODIUM.top - 5} H${PODIUM.x + PODIUM.w + 4}`} />
        </g>
        <path
          className="hero-glow"
          d={`M484 ${PODIUM_FLOOR + 7} H538`}
          stroke="var(--color-gold)"
          strokeWidth={3}
        />

        {/* TOWER: a glass curtain wall, and a solid stone core down its right side. */}
        <g className="hero-rise-in" style={rise(T.tower)}>
          <rect x={TOWER.x} y={TOWER.top} width={CORE.x - TOWER.x} height={TOWER.bottom - TOWER.top} fill="url(#cmt-glass)" />
          <g stroke={GLASS_DEEP} strokeWidth={1} opacity={0.45}>
            {MULLIONS.map((x) => (
              <path key={x} d={`M${x} ${TOWER.top} V${TOWER.bottom}`} />
            ))}
          </g>
          <rect x={TOWER.x} y={TOWER.top} width={CORE.x - TOWER.x} height={TOWER.bottom - TOWER.top} fill="url(#cmt-reflect)" />
          {/* The frame column at the lit edge. */}
          <rect x={TOWER.x} y={TOWER.top} width={6} height={TOWER.bottom - TOWER.top} fill={RENDER} />
          {/* The core: stone, lit on its left face, with the stair's slit windows. */}
          <rect x={CORE.x} y={TOWER.top} width={CORE.w} height={TOWER.bottom - TOWER.top} fill={STONE} />
          <rect x={CORE.x} y={TOWER.top} width={CORE.w} height={TOWER.bottom - TOWER.top} fill="url(#cmt-daylight)" />
          {CORE_SLITS.map((y) => (
            <rect key={y} x={CORE.x + 16} y={y} width={5} height={14} fill={GLASS_DEEP} />
          ))}
        </g>
        {/* The core stands proud of the glass, so it throws a shadow onto it. */}
        <g className="hero-rise-in" style={rise(T.tower)}>
          <rect x={CORE.x - 6} y={TOWER.top} width={6} height={TOWER.bottom - TOWER.top} fill="#000000" opacity={0.16} />
        </g>

        {/* The sunshade fins, one per floor, arriving from the bottom up. Each projects a little
            past the glass on the lit side and casts a thin shadow beneath it. */}
        {[...FINS].reverse().map((y, i) => (
          <g key={y} className="hero-fade-in" style={fade(T.fins + i * 70)}>
            <rect x={TOWER.x - 4} y={y - 5} width={CORE.x - TOWER.x + 4} height={5} fill={RENDER} />
            <rect x={TOWER.x} y={y} width={CORE.x - TOWER.x} height={3} fill="#000000" opacity={0.18} />
          </g>
        ))}

        {/* ROOF: a thin slab projecting past the walls for shade, its shadow on the top floor,
            and the plant screen and mast set back on top of it. */}
        <g className="hero-rise-in" style={rise(T.roof)}>
          <rect x={ROOF.x + 60} y={ROOF.top - 14} width={70} height={14} fill={RENDER_SHADE} />
          {[ROOF.top - 10, ROOF.top - 6].map((y) => (
            <path key={y} d={`M${ROOF.x + 64} ${y} H${ROOF.x + 126}`} stroke={STONE_DEEP} strokeWidth={1} />
          ))}
          <path d={`M${ROOF.x + 178} ${ROOF.top} V${ROOF.top - 28}`} stroke={STONE_DEEP} strokeWidth={1.5} />
          <rect x={ROOF.x} y={ROOF.top} width={ROOF.w} height={8} fill={RENDER} />
          <rect x={TOWER.x} y={ROOF.top + 8} width={TOWER.w} height={4} fill="#000000" opacity={0.14} />
        </g>
        <path
          className="hero-rise-in"
          style={rise(T.roof)}
          d={`M${ROOF.x} ${ROOF.top} H${ROOF.x + ROOF.w}`}
          stroke="var(--color-gold)"
          strokeWidth={2.5}
          strokeLinecap="square"
          fill="none"
        />

        {/* People at the door, for scale. */}
        <g className="hero-fade-in" style={fade(T.dimension + 1000)}>
          <g fill={FIGURE} opacity={0.72}>
            {FIGURES.map(({ x, h }) => (
              <g key={x}>
                <circle cx={x} cy={GROUND - h + 2.4} r={2.4} />
                <path
                  d={`M${x - 3} ${GROUND} V${GROUND - h + 9} Q${x - 3} ${GROUND - h + 5.5} ${x} ${GROUND - h + 5.5} Q${x + 3} ${GROUND - h + 5.5} ${x + 3} ${GROUND - h + 9} V${GROUND} Z`}
                />
              </g>
            ))}
          </g>
        </g>

        {/* ---- The survey, drawn on last. ---- */}

        {/* Ground level, marked the way a section drawing marks it: an inverted triangle on
            the line and "±0.00" beside it. That is the definition of the datum every other
            level is measured from, not a measurement of anything, so it claims nothing. */}
        <g className="hero-fade-in" style={fade(T.dimension + 900)}>
          <path
            d={`M246 ${GROUND - 12} H266 L256 ${GROUND - 1} Z`}
            fill="none"
            stroke="var(--color-gold-deep)"
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
          <text
            x={272}
            y={GROUND - 3}
            className="font-sans"
            fontSize={13}
            letterSpacing={0.6}
            fill="var(--color-gold-deep)"
          >
            ±0.00
          </text>
        </g>

        {/* Storey levels, ticked off the core's flank at floor lines. */}
        <g stroke="var(--color-gold)" strokeWidth={1} opacity={0.4} fill="none">
          {LEVEL_TICKS.map((y, i) => (
            <path
              key={y}
              className="hero-draw"
              pathLength={1}
              style={draw(T.dimension + 420 + i * 80)}
              d={`M${TOWER.x + TOWER.w + 4} ${y} H${TOWER.x + TOWER.w + 44}`}
            />
          ))}
        </g>

        {/* Height, to the top of the roof slab: extension line off it, arrowheads both ends,
            no figure. */}
        <g stroke="var(--color-gold)" fill="none">
          <path d={`M345 ${ROOF.top} H${ROOF.x}`} strokeWidth={1} opacity={0.45} />
          <path
            className="hero-draw"
            pathLength={1}
            style={draw(T.dimension)}
            d={`M345 ${ROOF.top} V${GROUND}`}
            strokeWidth={1.5}
          />
        </g>
        <g className="hero-fade-in" style={fade(T.dimension + 600)} fill="var(--color-gold)">
          <path d={`M345 ${ROOF.top} L340.5 ${ROOF.top + 12} L349.5 ${ROOF.top + 12} Z`} />
          <path d={`M345 ${GROUND} L340.5 ${GROUND - 12} L349.5 ${GROUND - 12} Z`} />
        </g>
      </svg>
    </div>
  );
}

/**
 * The ground line and the earth under it, full bleed. In HTML rather than inside the SVG so it
 * reaches both edges of any viewport; the skyline above is cropped to end exactly on its own
 * ground, so the two meet with no gap to tune.
 */
export function HeroDatum() {
  return (
    <div aria-hidden="true" className="relative w-full">
      <div className="hero-datum h-[2.5px] w-full bg-gold" />
      <div
        className="hero-datum datum-hatch h-3 w-full opacity-35"
        style={{ '--datum-delay': '120ms' } as React.CSSProperties}
      />
    </div>
  );
}
