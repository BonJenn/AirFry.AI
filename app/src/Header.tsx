import React, { useState } from 'react';
import './Header.css';
import SignUpForm from './SignUpForm';
import { API_KEY } from './config';


function Header() {
    const [showSignUp, setShowSignUp] = useState(false);

    const toggleSignUp = () => setShowSignUp(!showSignUp);

    return (
        <div className="header">
            <div className="navigation">
                <h4 onClick={() => console.log(API_KEY)}>Login</h4>
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
        </div>    
    );
}

export default Header;