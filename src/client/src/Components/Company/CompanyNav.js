import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import UserContext from '../../Context/UserContext';
import defaultAvatar from '../../Assets/Img/defaultAvatar.png';
import logo from '../../Assets/Img/logo.png';
import './nav.css';

function CompanyNav() {
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    mode: 'onBlur',
  });

  const onSubmitForm = (data) => console.log(data);

  const logOut = async () => {
    const res = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    const jsonVal = await res.json();
    if (jsonVal.success) {
      console.log(jsonVal);
      userCtx.updateUserStatus({
        authStatus: false,
        id: '',
        type: '',
      });
      navigate('/login', { replace: true });
    }
  };

  const path = useLocation().pathname;
  const [navElements, setNavElements] = useState([
    {
      name: 'Overview',
      to: 'company/overview',
      status: '',
    },
    {
      name: 'Profile',
      to: 'company/profile',
      status: '',
    },
    {
      name: 'Settings',
      to: 'company/settings',
      status: '',
    },
  ]);

  //set active for initial render
  useEffect(() => {
    const updatedNavElements = navElements.map((element) => {
      if (element.status === 'active') {
        element.status = '';
      }
      if (path.includes(element.to)) {
        element.status = 'active';
      } else if (path.includes('login')) {
        if (element.to.includes('overview')) {
          element.status = 'active';
        }
      }
      return element;
    });
    setNavElements(updatedNavElements);
  }, []);

  function OnClick(e) {
    const id = e.target.id;
    const updatedNavElements = navElements.map((element) => {
      if (element.status === 'active') {
        element.status = '';
      }
      if (element.to === id) {
        element.status = 'active';
      }
      return element;
    });
    setNavElements(updatedNavElements);
  }

  const [avatar, setAvatar] = useState('');
  const [userName, setName] = useState('');

  const fetchInfo = async () => {
    const res = await fetch('/api/user');
    const data = await res.json();
    return data;
  };

  useEffect(() => {
    (async () => {
      const data = await fetchInfo();
      setAvatar(
        data.user.basics.logo ? '/api/organization/logo' : defaultAvatar,
      );
      setName(data.user.basics.name);
    })();
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-2 shaadow-sm">
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
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#nav-right"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav-right">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {navElements.map((element) => {
              return (
                <li className="nav-link" key={element.name}>
                  <Link
                    onClick={OnClick}
                    className={`nav-link ${element.status}`}
                    to={element.to}
                    id={`${element.to}`}
                  >
                    {element.name}
                  </Link>
                </li>
              );
            })}
            <li className="dropdown mt-1">
              <img
                src={avatar}
                alt="avatar"
                className="rounded-circle mx-auto img img-thumbnail dropdown-toggle"
                id="dropdownMenuImage"
                data-bs-toggle="dropdown"
              />
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuImage"
              >
                <li className="dropdown-item-text">Signed in as</li>
                <li className="dropdown-item-text">{userName}</li>
                <li>
                  <button className="dropdown-item" onClick={logOut}>
                    Log Out
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default CompanyNav;
