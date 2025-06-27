import { useState } from "react";
import { Outlet } from "react-router";
import Header from '../components/Header/Header';
import BurgerMenue from '../components/BurgerMenue/burgerMenue';
import Footer from '../components/Footer/Footer';

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
      <Footer />
    </>
  );
};

export default NavLayout;
