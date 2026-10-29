import { useState } from 'react';
import { Camera } from 'lucide-react';

export default function Publicar({ onPublish }) {
    const [form, setForm] = useState({ tipo: 'Perdido', nombre: '', categoria: '', descripcion: '', fecha: new Date().toISOString().slice(0, 10), lugar: '', imagen: '' });

  const [error, setError] = useState('');

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function photo(e) {
    const file = e.target.files?.[0];

    if (!file)
      return;

    if (file.size > 1200000) {
      setError('La imagen debe pesar menos de 1.2 MB en esta versión local.');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => { set('imagen', reader.result); setError(''); };

    reader.readAsDataURL(file);
  }

  function submit(e) {
    e.preventDefault();

    if (!form.nombre.trim() || !form.categoria.trim() || !form.lugar.trim()) {
      setError('Completa los campos obligatorios.');
      return;
    }

    try {
      onPublish(form);
    } catch {
      setError('No se pudo guardar. Prueba con una imagen más pequeña.');
    }
  }

  return (
    <form className="panel publish-form" onSubmit={submit}>
      <div className="type-picker">
        <button
          type="button"
          className={form.tipo === 'Perdido' ? 'active' : ''}
          onClick={() => set('tipo', 'Perdido')}
        >
          Perdidos
        </button>
        <button
          type="button"
          className={form.tipo === 'Encontrado' ? 'active' : ''}
          onClick={() => set('tipo', 'Encontrado')}
        >
          Encontrados
        </button>
      </div>
      <label className="photo-upload">
        <input type="file" accept="image/*" onChange={photo} />
        {form.imagen ? <img src={form.imagen} alt="Vista previa" /> : <><Camera size={30} /><span>Agregar foto (opcional)</span></>}
      </label>
      <label>
        Nombre del objeto *
        <input
          value={form.nombre}
          onChange={e => set('nombre', e.target.value)}
          required
          maxLength={90}
          placeholder="Ej. Mochila azul"
        />
      </label>
      <label>
        Categoría *
        <select
          value={form.categoria}
          onChange={e => set('categoria', e.target.value)}
          required
        >
          <option value="">
            Selecciona una categoría
          </option>
          {['Electrónica', 'Documentos', 'Llaves', 'Accesorios', 'Ropa', 'Mascotas', 'Otros'].map(x => <option key={x}>{x}</option>)}
        </select>
      </label>
      <label>
        Descripción
        <textarea
          value={form.descripcion}
          onChange={e => set('descripcion', e.target.value)}
          rows={4}
          maxLength={700}
          placeholder="Describe el objeto y sus características"
        />
      </label>
      <label>
        Fecha *
        <input
          type="date"
          value={form.fecha}
          onChange={e => set('fecha', e.target.value)}
          required
        />
      </label>
      <label>
        Lugar *
        <input
          value={form.lugar}
          onChange={e => set('lugar', e.target.value)}
          required
          placeholder="¿Dónde se perdió o encontró?"
        />
      </label>
      {error && <p className="error-text">{error}</p>}
      <button className="primary full" type="submit">
        Publicar objeto
      </button>
      <p className="help">
        Esta versión guarda la publicación en este navegador, no en una base de datos compartida.
      </p>
    </form>
  );
}
