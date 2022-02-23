import { Outlet, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Nav from './CompanyNav';
import UserContext from '../../Context/UserContext';

function Home() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userCtx.authStatus) {
      if (userCtx.type === 'Users') {
        navigate('/jobseeker/overview', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  });

  return (
    <>
      <Nav />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export default Home;
