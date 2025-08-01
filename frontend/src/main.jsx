import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Equipos from '@pages/Equipos';
import HorasDisponibles from '@pages/HorasDisponibles';
import Solicitudes from '@pages/Solicitudes';
import GestionSolicitudes from '@pages/GestionSolicitudes';
import MisSolicitudes from '@pages/MisSolicitudes';
import Register from '@pages/Register';
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
        path: '/equipos',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <Equipos />
        </ProtectedRoute>
        ),
      },
      {
        path: '/horas-disponibles',
        element: (
        <ProtectedRoute allowedRoles={['administrador']}>
          <HorasDisponibles />
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
        path: '/solicitudes',
        element: (
        <ProtectedRoute allowedRoles={['usuario']}>
          <Solicitudes />
        </ProtectedRoute>
        ),
      },
      {
        path: '/mis-solicitudes',
        element: (
        <ProtectedRoute allowedRoles={['usuario']}>
          <MisSolicitudes />
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