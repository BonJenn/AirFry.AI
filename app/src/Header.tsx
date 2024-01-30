import React, { useState } from 'react';
import './Header.css';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';

function Header({ toggleMainContent }) {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSignUp = () => {
        setShowSignUp(true);
        setShowLogin(false);
    };

    const toggleLogin = () => {
        setShowLogin(true);
        setShowSignUp(false);
    };

    const toggleHamburgerMenu = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const closePopups = () => {
        setShowSignUp(false);
        setShowLogin(false);
    };

    const handleLogout = async () => {
        if (app.currentUser) {
            await app.currentUser.logOut();
            console.log('Successfully logged out');
            // Hide any open popups
            setShowSignUp(false);
            setShowLogin(false);
            // Additional logic after logout if needed
            // For example, removing user data from the state or database
        }
    };

    return (
        <>
            <div className="headerInfo">
                <h1>AirFry<span className="ai-color">.ai</span></h1>
                <h3>Fry Smarter.</h3>
            </div>
            <button className={`hamburger-menu ${sidebarVisible ? 'toggled' : ''}`} onClick={toggleHamburgerMenu}>
                ☰
            </button>
            <div className={`sidebar ${sidebarVisible ? 'visible' : ''}`}>
                <div className="navigation">
                    <h4 onClick={toggleLogin}>Log In</h4>
                    <h4 onClick={toggleSignUp}>Sign up</h4>
                    <h4>My account</h4>
                    <h4 onClick={handleLogout}>Log Out</h4>
                </div>
            </div>

            <div className={`overlay ${showSignUp || showLogin ? 'showOverlay' : ''}`} onClick={closePopups}></div>

            <div id="signupPopup" className={`popup ${showSignUp ? 'showPopup' : ''}`}>
                <div className="popupClose" onClick={closePopups}>X</div>
                <h2 className="popup-title">Sign Up</h2>
                <SignUpForm />
            </div>

            <div id="loginPopup" className={`popup ${showLogin ? 'showPopup' : ''}`}>
                <div className="popupClose" onClick={closePopups}>X</div>
                <h2 className="popup-title">Log In</h2>
                <LoginForm />
            </div>
        </>
    );
}

export default Header;
