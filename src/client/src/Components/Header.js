import JobSeekerNav from './Jobseeker/Nav';
import CompanyNav from './Company/CompanyNav';
import DefaultNav from './DefaultNav';

import { useContext } from 'react';
import UserContext from '../Context/UserContext';

function Header() {
  const userCtx = useContext(UserContext);

  if (userCtx.type === 'Users') {
    return <JobSeekerNav />;
  } else if (userCtx.type === 'Organizations') {
    return <CompanyNav />;
  } else {
    return <DefaultNav />;
  }
}
export default Header;
