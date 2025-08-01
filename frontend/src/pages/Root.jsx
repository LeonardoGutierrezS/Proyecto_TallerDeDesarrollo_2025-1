import { Outlet } from 'react-router-dom';
import Layout from '@components/Layout';
import { AuthProvider } from '@context/AuthContext';

function Root()  {
return (
    <AuthProvider>
        <PageRoot/>
    </AuthProvider>
);
}

function PageRoot() {
return (
    <Layout>
        <Outlet />
    </Layout>
);
}

export default Root;