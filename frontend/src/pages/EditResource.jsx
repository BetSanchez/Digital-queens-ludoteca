import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import ResourceForm from '../components/ResourceForm';
import { ErrorState, Loading } from '../components/Feedback';
import { IconArrowLeft } from '../components/Icons';
import useFetch from '../hooks/useFetch';
import { getResource, updateResource } from '../services/api';

export default function EditResource() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const consulta = useCallback((signal) => getResource(id, signal), [id]);
  const { datos: recurso, cargando, error: errorCarga, recargar } = useFetch(consulta, [id]);

  // Referencia estable: ResourceForm sincroniza su estado cuando cambia `inicial`.
  const inicial = useMemo(
    () =>
      recurso && {
        nombre: recurso.nombre ?? '',
        enlace: recurso.enlace ?? '',
        tipo: recurso.tipo ?? '',
        categoria: recurso.categoria ?? '',
        idioma: recurso.idioma ?? '',
        participante: recurso.participante ?? '',
        descubrimiento: recurso.descubrimiento ?? '',
        contribucion: recurso.contribucion ?? '',
        recomendacion: recurso.recomendacion ?? '',
        archivo: recurso.archivo,
        imagen: recurso.imagen,
      },
    [recurso],
  );

  const guardar = async (formData) => {
    setEnviando(true);
    setError(null);
    try {
      await updateResource(id, formData);
      navigate(`/recursos/${id}`);
    } catch (err) {
      setError(err);
      setEnviando(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (cargando) return <Loading mensaje="Cargando recurso…" />;

  if (errorCarga) {
    return (
      <div className="container-page py-12">
        <ErrorState
          mensaje={errorCarga.status === 404 ? 'Este recurso no existe o fue eliminado.' : errorCarga.message}
          onRetry={errorCarga.status === 404 ? undefined : recargar}
        />
        <div className="mt-6 text-center">
          <Button to="/recursos" variant="secondary">
            <IconArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Edición"
        titulo="Editar recurso"
        descripcion={`Actualiza la información de “${recurso.nombre}”.`}
        acciones={
          <Button to={`/recursos/${id}`} variant="secondary">
            <IconArrowLeft className="h-4 w-4" />
            Cancelar
          </Button>
        }
      />

      <div className="container-page py-8">
        <div className="mx-auto max-w-3xl">
          <ResourceForm
            inicial={inicial}
            onSubmit={guardar}
            enviando={enviando}
            errorServidor={error}
            textoEnvio="Guardar cambios"
          />
        </div>
      </div>
    </>
  );
}
