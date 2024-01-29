import React, { useState } from 'react';
import './Header.css';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';

function Header({ toggleMainContent }) {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSignUp = () => setShowSignUp(!showSignUp);
    const toggleLogin = () => setShowLogin(!showLogin);
    const toggleHamburgerMenu = () => {
        setSidebarVisible(!sidebarVisible);
        toggleMainContent(!sidebarVisible);
    };

    return (
        <>
            <div className="headerInfo">
                <h1><span>AirFry</span><span>.ai</span></h1>
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
                    <h4>Log Out</h4>
                </div>
            </div>
            {showSignUp && (
                <>
                    <div className="overlay" onClick={toggleSignUp}></div>
                    <div className="signupPopup">
                        <SignUpForm />
                        <button onClick={toggleSignUp}>Close</button>
                    </div>
                </>
            )}
            {showLogin && (
                <>
                    <div className="overlay" onClick={toggleLogin}></div>
                    <div className="loginPopup">
                        <LoginForm />
                        <button onClick={toggleLogin}>Close</button>
                    </div>
                </>
            )}
        </>
    );
}

export default Header;
