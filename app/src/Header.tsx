import React, { useState } from 'react';
import './Header.css';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm'; // Assuming you have a LoginForm component


function Header() {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false); // New state for login popup

    const toggleSignUp = () => setShowSignUp(!showSignUp);
    const toggleLogin = () => setShowLogin(!showLogin); // New toggle function for login popup

    return (
        <div className="header">
            <div className="navigation">
                <h4> Log Out</h4>
                <h4 onClick={toggleLogin}>Log In</h4> {/* Bind the toggle function */}
                <h4 onClick={toggleSignUp}>Sign up</h4>
                <h4>My account</h4>
            </div>
            <div className="headerInfo">
                <h1><span>AirFry</span><span>.ai</span></h1>
                <h3>Fry Smarter.</h3>
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
            {showLogin && ( // New login popup JSX
                <>
                    <div className="overlay" onClick={toggleLogin}></div>
                    <div className="loginPopup">
                        <LoginForm />
                        <button onClick={toggleLogin}>Close</button>
                    </div>
                </>
            )}
        </div>    
    );
}

export default Header;