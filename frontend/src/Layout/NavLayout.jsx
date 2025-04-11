import { Outlet } from "react-router";
import Header from '../components/Header/Header';

const NavLayout = () => {
  const handleSearch = (query) => {
    console.log("Rechercher :", query);
  };
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
