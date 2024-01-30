import React, { useState } from 'react';
import './Header.css';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import * as Realm from "realm-web";
import { REALM_APP_ID } from './config';

function Header({ toggleMainContent }) {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const app = new Realm.App({ id: REALM_APP_ID });



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
        try {
            if (app.currentUser) {
                await app.currentUser.logOut();
                console.log('Successfully logged out');
                // Additional cleanup logic (e.g., clearing global state, redirecting)
            }
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle logout failure (e.g., show error message)
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
