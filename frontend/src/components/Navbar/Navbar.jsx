import React, { useContext, useState, useRef, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const Navbar = ({setShowLogin}) => {

  const [menu, setMenu] = useState("home");

  const { getTotalCartAmount, token, setToken, setSearchTerm, user } = useContext(StoreContext);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchRef = useRef(null);
const logout =() =>{
  localStorage.removeItem("token");
  setToken("");
  navigate("/");
}

useEffect(() => {
  if (showSearch && searchRef.current) searchRef.current.focus();
}, [showSearch]);

  return (
    <div className="navbar">
      <Link to='/'><img className="logo" src={assets.logo} alt="Logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""} >home</Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""} >menu</a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""} >mobile-app</a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""} >contact us</a>
      </ul>
      <div className="navbar-right">
        {/* Search icon toggles inline search input. When open, the icon appears inside the input. */}
        {!showSearch && (
          <img src={assets.search_icon} alt="Search" onClick={() => setShowSearch(true)} style={{cursor:'pointer'}} />
        )}
        {showSearch && (
          <div className="navbar-search-input">
            <input
              ref={searchRef}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setSearchTerm(e.target.value);
                navigate('/');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // ensure the latest value is applied and navigate to show results
                  setSearchTerm(searchInput);
                  navigate('/');
                  // after navigation, scroll to the food display section so results are visible
                  setTimeout(() => {
                    const el = document.getElementById('food-display');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 80);
                }
              }}
              placeholder="Search foods..."
            />
            {/* enter icon placed inside the input on the right; clicking submits the search */}
            <span
              className="enter-inside-right"
              role="button"
              aria-label="Submit search"
              onClick={() => {
                setSearchTerm(searchInput);
                navigate('/');
                // scroll to food display so the user sees the results
                setTimeout(() => {
                  const el = document.getElementById('food-display');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 80);
                if (searchRef.current) searchRef.current.focus();
              }}
            >
              ⏎
            </span>
            <button onClick={(e) => { e.preventDefault(); setSearchInput(''); setSearchTerm(''); setShowSearch(false); }}>✕</button>
          </div>
        )}
        <div className="navbar-search-icon">
        <Link to='/cart'> <img src={assets.basket_icon} alt="" /> </Link>  
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
         {!token ?<button onClick={() => setShowLogin(true)}>sign in</button>
        :<div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              {/* show user details when available */}
              {user ? (
                <li style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
                  <strong style={{ fontSize: 14 }}>{user.name}</strong>
                  <small style={{ fontSize: 12, color: '#666' }}>{user.email}</small>
                  {user.phone ? <small style={{ fontSize: 12, color: '#666' }}>{user.phone}</small> : null}
                </li>
              ) : null}
              <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
              <hr />
              <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
            </ul>
          </div>}
      </div>
    </div>
  );
};

export default Navbar;
