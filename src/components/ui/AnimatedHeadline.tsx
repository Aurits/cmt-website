/**
 * Splits a headline into one span per word, each carrying its own --word-delay — hero-rise
 * (globals.css) applied word by word instead of to the block as a whole, so the sentence
 * arrives left to right rather than fading in at once.
 *
 * Deliberately not a typewriter: a literal type-on effect makes a visitor wait out the full
 * sentence, letter by letter, before the value proposition is even readable, which is the
 * wrong trade for the first thing a bank-referred visitor sees. This keeps the whole
 * sentence in the server HTML as real text from the first byte — nothing here needs
 * JavaScript to become legible — and only staggers each word's entrance with a CSS
 * animation-delay, no JS timer. prefers-reduced-motion is handled by the sitewide rule in
 * globals.css, the same one hero-rise itself relies on.
 */
export function AnimatedHeadline({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, index) => (
        <span key={index}>
          {/*
            The space is its own text node, a sibling AFTER the closing span, not a
            trailing character inside it: a browser trims whitespace sitting at the very
            end of an inline-block's own content, so a space placed there disappears and
            every word runs into the next. Outside the box it's ordinary breakable text
            between two inline elements, exactly like a space between two <a> tags, and
            survives.
          */}
          <span
            className="hero-word"
            style={{ '--word-delay': `${index * 55}ms` } as React.CSSProperties}
          >
            {word}
          </span>
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </>
  );
}
