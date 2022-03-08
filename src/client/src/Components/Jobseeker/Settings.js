import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

function Settings() {
  const path = useLocation().pathname;
  const [navElements, setNavElements] = useState([
    {
      name: 'Basics',
      to: 'basics',
      status: '',
    },
    {
      name: 'Email',
      to: 'email',
      status: '',
    },
    {
      name: 'Password',
      to: 'password',
      status: '',
    },
  ]);
  function OnClick(e) {
    const id = e.target.id;
    const updatedNavElements = navElements.map((element) => {
      if (element.status === 'table-active') {
        element.status = '';
      }
      if (element.to === id) {
        element.status = 'table-active';
      }
      return element;
    });
    setNavElements(updatedNavElements);
  }
  //set active for initial render
  useEffect(() => {
    const updatedNavElements = navElements.map((element) => {
      if (element.status === 'table-active') {
        element.status = '';
      }
      if (path.includes(element.to)) {
        element.status = 'table-active';
      }
      return element;
    });
    setNavElements(updatedNavElements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="settings card my-5">
      <h1 className="card-header mb-0">Settings</h1>
      <div className="container-fluid m-0">
        <div className="row">
          <div className="col-12 col-lg-3 p-0 border-end">
            <table className="table table-hover mb-0">
              <tbody>
                {navElements.map((element) => {
                  return (
                    <tr className="" key={element.name}>
                      <td className={`${element.status}`}>
                        <Link
                          onClick={OnClick}
                          className={`nav-link link-dark`}
                          to={element.to}
                          id={`${element.to}`}
                        >
                          {element.name}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="col-12 col-lg-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
