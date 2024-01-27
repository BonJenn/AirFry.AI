import './Header.css';

function Header() {
    return (
        <div className="header">
            <div className="navigation">
                <h4>Login</h4>
                <h4>Sign up</h4>
                <h4>My account</h4>
            </div>
            <div className="headerInfo">
                <h1><span>AirFry</span><span>.ai</span></h1>
                <h3>Fry Smarter.</h3>
            </div>
        </div>    
    );
}

export default Header;