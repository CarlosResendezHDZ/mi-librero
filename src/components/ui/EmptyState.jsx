
//
// Estado vacío reutilizable: ícono, título
// y contenido libre
//
export default function EmptyState({ icono, titulo, children }) {
  return (
    <div className="text-center text-body-secondary py-5">
      <i className={`bi ${icono} display-4 d-block mb-3`}></i>

      <h2 className="h5 text-body">{titulo}</h2>

      {children}
    </div>
  )
}
