import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import logo from '../Assets/Img/logo.png';

function DefaultNav() {
  const { register, handleSubmit } = useForm({
    mode: 'onBlur',
  });

  const onSubmitForm = (data) => console.log(data);
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-2">
      <div className="container-fluid">
        <div className="left d-inline-flex">
          <div className="logo">
            <Link className="navbar-brand px-2" to="/">
              <img className="img img-fluid" src={logo} alt="logo" width="80" />
            </Link>
          </div>
          <div className="search-bar mt-1">
            <form className="d-flex" onSubmit={handleSubmit(onSubmitForm)}>
              <input
                {...register('search', { required: true })}
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
          </div>
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
