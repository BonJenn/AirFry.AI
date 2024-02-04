import React, { useState } from 'react';
import './Header.css';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';

function Header({ isLoggedIn, onLogout, toggleSidebar, isSidebarVisible, app, updateLoginState }) {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogout = async () => {
    try {
      if (app.currentUser) {
        await app.currentUser.logOut();
        onLogout(); // Update the login state in App component
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSignUp = () => {
    setShowSignUp(true);
    setShowLogin(false);
  };

  const toggleLogin = () => {
    setShowLogin(true);
    setShowSignUp(false);
  };

  const closePopups = () => {
    setShowSignUp(false);
    setShowLogin(false);
  };

  return (
    <>
      {showSignUp || showLogin ? <div className="overlay showOverlay" onClick={closePopups}></div> : null}
      
      <div className="headerInfo">
        <h1>AirFry<span className="ai-color">.ai</span></h1>
        <h3>Fry Smarter.</h3>
      </div>
      <div className="user-info">
        {isLoggedIn && <span>{app.currentUser.profile.email}</span>}
      </div>
      <button className="hamburger-menu" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`sidebar ${isSidebarVisible ? 'visible' : ''}`}>
        <div className="navigation">
          {!isLoggedIn && <h4 onClick={toggleLogin}>Log In</h4>}
          {!isLoggedIn && <h4 onClick={toggleSignUp}>Sign up</h4>}
          {isLoggedIn && <h4>My account</h4>}
          {isLoggedIn && <h4 onClick={handleLogout}>Log Out</h4>}
        </div>
      </div>

      {showSignUp && (
        <div id="signupPopup" className={`popup ${showSignUp ? 'showPopup' : ''}`}>
          <div className="popupClose" onClick={closePopups}>X</div>
          <h2 className="popup-title">Sign Up</h2>
          <SignUpForm updateLoginState={updateLoginState} />
        </div>
      )}

      {showLogin && (
        <div id="loginPopup" className={`popup ${showLogin ? 'showPopup' : ''}`}>
          <div className="popupClose" onClick={closePopups}>X</div>
          <h2 className="popup-title">Log In</h2>
          <LoginForm updateLoginState={updateLoginState} />
        </div>
      )}
    </>
  );
}

export default Header;
