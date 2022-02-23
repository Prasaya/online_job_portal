import { useContext, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserContext from '../Context/UserContext';

function Header() {
  const path = useLocation().pathname;
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userCtx.authStatus) {
      if (userCtx.type === 'Organizations' && path.startsWith('/jobseeker')) {
        navigate('/company/overview', { replace: true });
      } else if (userCtx.type === 'Users' && path.startsWith('/company')) {
        navigate('/jobseeker/overview', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, []);

  if (path.startsWith('/jobseeker') || path.startsWith('/company')) {
    return <></>;
  } else {
    return (
      <header className="header text-center container my-5">
        <h3>
          <Link to="/" id="header">
            Job Portal
          </Link>
        </h3>
      </header>
    );
  }
}
export default Header;
