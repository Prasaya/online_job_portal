import { useContext, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import UserContext from '../../Context/UserContext';

function Home() {
  const path = useLocation().pathname;
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (userCtx.authStatus) {
  //     if (userCtx.type === 'Organizations' && path.startsWith('/jobseeker')) {
  //       navigate('/company/overview', { replace: true });
  //     } else if (userCtx.type === 'Users' && path.startsWith('/company')) {
  //       navigate('/jobseeker/overview', { replace: true });
  //     }
  //   } else if (
  //     !userCtx.authStatus &&
  //     (path.startsWith('/company') || path.startsWith('/jobseeker'))
  //   ) {
  //     navigate('/login', { replace: true });
  //   }
  // }, []);

  return (
    <>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export default Home;
