import { useState } from "react";
import { Outlet } from "react-router";
import Header from '../components/Header/Header';
import BurgerMenue from '../components/BurgerMenue/burgerMenue';

const NavLayout = () => {
  const storedUser = sessionStorage.getItem("user");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleMenuToggle = () => {
    setIsMenuOpen(prev => !prev);
  };

  const renderHeader = () => {
    return (
      <>
        <Header onProfileClick={handleMenuToggle}/>
      </>
    );
  };

  const renderBurgerMenu = () => {
    if (storedUser != null && isMenuOpen) {
      return (
        <>
          <BurgerMenue onProfileClick={handleMenuToggle}/>
        </>
      );
    }
  };
  
  return (
    <>
      {renderHeader()}
      {renderBurgerMenu()}
      <div className="container">
        <Outlet />
      </div>
    </>
  );
};

export default NavLayout;
