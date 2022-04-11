import { Link } from 'react-router-dom';
import logo from '../Assets/Img/logo.png';
import SearchBar from './SearchBar';

function DefaultNav() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
      <div className="container-fluid">
        <div className="left d-inline-flex">
          <div className="logo">
            <Link className="navbar-brand px-2" to="/">
              <img className="img img-fluid" src={logo} alt="logo" width="80" />
            </Link>
          </div>
          <SearchBar />
        </div>

        <div className="buttons" id="nav-right">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-link">
              <Link to="/register-jobseeker" className="btn">
                Sign Up
              </Link>
            </li>
            <li className="nav-link">
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
