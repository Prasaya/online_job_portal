import { Outlet } from 'react-router-dom';
import Nav from './Nav';

function Home() {
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
