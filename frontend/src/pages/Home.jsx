import '@styles/styles.css';

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
  const userName = user?.nombreCompleto || 'Usuario';
  const userRole = user?.rol || 'Sin rol';

  return (
    <div className="main-container">
      <h1>Bienvenido al Sistema SIREC</h1>
      <div style={{ marginTop: '30px' }}>
        <p style={{ fontSize: '1.1em', color: '#003366' }}>
          Hola <strong>{userName}</strong>
        </p>
        <p style={{ fontSize: '0.95em', color: '#666' }}>
          Rol: <strong style={{ textTransform: 'capitalize' }}>{userRole}</strong>
        </p>
      </div>
    </div>
  );
};

export default Home;