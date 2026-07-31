import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ResourceForm from '../components/ResourceForm';
import { createResource } from '../services/api';

export default function AddResource() {
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const guardar = async (formData) => {
    setEnviando(true);
    setError(null);
    try {
      const creado = await createResource(formData);
      navigate(`/recursos/${creado.id}`, { state: { creado: true } });
    } catch (err) {
      setError(err);
      setEnviando(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Nuevo aporte"
        titulo="Agregar un recurso"
        descripcion="Comparte un curso, libro, herramienta o comunidad que te haya servido. Tus respuestas ayudan a otras participantes a decidir si les conviene."
      />

      <div className="container-page py-8">
        <div className="mx-auto max-w-3xl">
          <ResourceForm onSubmit={guardar} enviando={enviando} errorServidor={error} />
        </div>
      </div>
    </>
  );
}
