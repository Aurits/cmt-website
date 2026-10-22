/**
 * The CMS while a screen loads: the dashboard's shapes (four figure cards, a panel) pulsing in
 * place, inside the sidebar and top bar, which stay put. Square, like every admin card.
 */
export default function Loading() {
  return (
    <div aria-busy="true">
      <span className="sr-only" role="status">
        Loading
      </span>
      <div aria-hidden="true" className="grid animate-pulse gap-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="block h-[150px] border border-green/10 bg-white" />
          ))}
        </div>
        <span className="block h-80 border border-green/10 bg-white" />
      </div>
    </div>
  );
}
