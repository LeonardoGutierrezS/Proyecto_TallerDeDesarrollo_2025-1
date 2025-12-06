import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import GestionUsuarios from '@pages/GestionUsuarios';
import GestionEquipos from '@pages/GestionEquipos';
import GestionSolicitudes from '@pages/GestionSolicitudes';
import GenerarSolicitud from '@pages/GenerarSolicitud';
import EstadoSolicitud from '@pages/EstadoSolicitud';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import '@styles/styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    errorElement: <Error404/>,
    children: [
      {
        path: '/home',
        element: <Home/>
      },
      {
        path: '/users',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Users />
        </ProtectedRoute>
        ),
      },
      {
        path: '/gestion-usuarios',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <GestionUsuarios />
        </ProtectedRoute>
        ),
      },
      {
        path: '/gestion-equipos',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <GestionEquipos />
        </ProtectedRoute>
        ),
      },
      {
        path: '/gestion-solicitudes',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <GestionSolicitudes />
        </ProtectedRoute>
        ),
      },
      {
        path: '/generar-solicitud',
        element: (
        <ProtectedRoute allowedRoles={['alumno', 'profesor']}>
          <GenerarSolicitud />
        </ProtectedRoute>
        ),
      },
      {
        path: '/estado-solicitud',
        element: (
        <ProtectedRoute allowedRoles={['alumno', 'profesor']}>
          <EstadoSolicitud />
        </ProtectedRoute>
        ),
      }
    ]
  },
  {
    path: '/auth',
    element: <Login/>
  },
  {
    path: '/register',
    element: <Register/>
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)