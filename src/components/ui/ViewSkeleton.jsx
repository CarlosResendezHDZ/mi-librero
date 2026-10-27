
//
// Fallback de Suspense: se ve mientras llega
// el código de una vista
//
export default function ViewSkeleton() {
  return (
    <div className="placeholder-glow" aria-busy="true">
      <span className="placeholder col-5 placeholder-lg mb-3"></span>
      <span className="placeholder col-12 bloque mb-2"></span>
      <span className="placeholder col-12 bloque mb-2"></span>
      <span className="placeholder col-12 bloque"></span>
    </div>
  )
}
