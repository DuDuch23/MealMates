import { Outlet } from "react-router-dom";
import Header from './components/Header';

const NavLayout = () => {
  return (
    <>
      <Header />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default NavLayout;
