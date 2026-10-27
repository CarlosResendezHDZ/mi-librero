
//
// "978-0-14-032872-1" -> "9780140328721"
//
export function limpiarIsbn(texto) {
  return texto.replace(/[^0-9Xx]/g, '').toUpperCase()
}

// Valida el dígito verificador de ISBN-10 e ISBN-13
export function esIsbnValido(isbn) {
  const d = [...isbn].map((c) => (c === 'X' ? 10 : Number(c)))

  if (/^\d{9}[\dX]$/.test(isbn)) {
    const suma = d.reduce((acc, n, i) => acc + n * (10 - i), 0)
    return suma % 11 === 0
  }

  if (/^\d{13}$/.test(isbn)) {
    const suma = d.reduce((acc, n, i) => acc + n * (i % 2 ? 3 : 1), 0)
    return suma % 10 === 0
  }

  return false
}
