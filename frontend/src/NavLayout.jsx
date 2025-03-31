import { Outlet } from "react-router-dom";
import Header from './components/Header';
import SearchBar from './components/SearchBar';

const NavLayout = () => {
  const handleSearch = (query) => {
    console.log("Rechercher :", query);
  };
  return (
    <>
      <Header />
      <SearchBar onSearch={handleSearch} />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default NavLayout;
