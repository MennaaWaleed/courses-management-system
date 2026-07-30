import "./Navbar.css";
import logo from "../../../assets/images/logo.png";

function  Navbar(){


    return(

         <nav className="navbar">
             <div className="navbar__container">
            <div className="navbar__logo">
                <img src={logo} alt="MTC Logo" />
{/* 
                    <span className="navbar__title">
                    Training Center
                    </span> */}
                </div>

                <ul className="navbar__links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/">Categories</a></li>
                    <li><a href="/">About</a></li>
                    <li><a href="/">Contact</a></li>
                </ul>

                <div className="navbar__actions">
                    <button className="navbar__login">Login</button>
                    <button className="navbar__register">Register</button>
                </div>
            </div>
        </nav>

    );
}
export default Navbar;