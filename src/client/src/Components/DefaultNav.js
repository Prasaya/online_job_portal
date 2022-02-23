import { Link } from 'react-router-dom';

function DefaultNav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
      <div className="container-fluid">
        <Link className="navbar-brand left" to="/">
          Job Portal
        </Link>
        
        <div className="buttons" id="nav-right">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className='nav-link'>
                <Link to="/register-jobseeker" className="btn">
              Sign Up
            </Link>
            </li>
            <li className='nav-link'>
                <Link to="/login" className="btn btn-success">
              Log In
            </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default DefaultNav;
