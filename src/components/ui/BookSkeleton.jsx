
//
// Skeleton con la forma de la tarjeta de libro
//
export default function BookSkeleton() {
  return (
    <div
      className="card shadow-sm placeholder-glow"
      aria-busy="true"
    >
      <div className="row g-0">
        <div className="col-4">
          <span className="placeholder w-100 portada-skeleton"></span>
        </div>

        <div className="col-8 card-body">
          <span className="placeholder col-10 placeholder-lg mb-2"></span>
          <span className="placeholder col-7 mb-2"></span>
          <span className="placeholder col-5"></span>
        </div>
      </div>
    </div>
  )
}
