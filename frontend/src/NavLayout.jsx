import { Outlet } from "react-router-dom";
import Header from './components/Header';

const NavLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default NavLayout;
