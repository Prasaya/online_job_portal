import JobSeekerNav from './Jobseeker/Nav';
import CompanyNav from './Company/CompanyNav';
import DefaultNav from './DefaultNav';

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
    } else if (
      !userCtx.authStatus &&
      (path.startsWith('/company') || path.startsWith('/jobseeker'))
    ) {
      navigate('/login', { replace: true });
    }
  }, []);

  if (userCtx.type === 'Users') {
    return <JobSeekerNav />;
  } else if (userCtx.type === 'Organizations') {
    return <CompanyNav />;
  } else {
    return <DefaultNav />;
  }
}
export default Header;
