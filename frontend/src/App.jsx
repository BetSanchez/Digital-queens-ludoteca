import { Suspense, lazy, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import SplashScreen from './components/SplashScreen';
import { Loading } from './components/Feedback';
import AddResource from './pages/AddResource';
import EditResource from './pages/EditResource';
import Explore from './pages/Explore';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ResourceDetail from './pages/ResourceDetail';

// Recharts solo se descarga cuando se visita el panel de estadísticas.
const Statistics = lazy(() => import('./pages/Statistics'));

export default function App() {
  const [mostrarPortada, setMostrarPortada] = useState(true);
  const [mostrarApp, setMostrarApp] = useState(false);

  return (
    <>
      {mostrarPortada && (
        <SplashScreen
          onExitStart={() => setMostrarApp(true)}
          onFinish={() => setMostrarPortada(false)}
        />
      )}

      {/* La ludoteca solo se monta al salir de la portada, para que Digital Queens sea lo primero. */}
      {mostrarApp && (
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="recursos" element={<Explore />} />
            <Route path="recursos/:id" element={<ResourceDetail />} />
            <Route path="recursos/:id/editar" element={<EditResource />} />
            <Route path="agregar" element={<AddResource />} />
            <Route
              path="estadisticas"
              element={
                <Suspense fallback={<Loading mensaje="Cargando panel de estadísticas…" />}>
                  <Statistics />
                </Suspense>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </>
  );
}
