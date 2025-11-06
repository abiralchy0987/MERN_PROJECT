// App entry component: sets up layout and routes
// - Manages a small local UI state (`showLogin`) to toggle the login modal
// - Renders the global `Navbar`, the `Routes` for pages, and the `Footer`
import React, { useState } from "react";

// UI components
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LoginPopup from "./components/LoginPopup/LoginPopup.jsx";

// Routing
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder.jsx";
import Verify from "./pages/Verify/Verify.jsx";
import MyOrders from "./pages/MyOrders/MyOrders.jsx";


const App = () => {
  // Local UI state to show/hide the login modal component
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* When `showLogin` is true the LoginPopup modal is rendered. */}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <> </>}

      {/* Main app wrapper: header/navbar + routed pages + footer */}
      <div className="app">
        {/* Navbar receives setShowLogin so it can open the login modal */}
        <Navbar setShowLogin={setShowLogin} />

        {/* Application routes. Add new pages here as needed. */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page */}
          <Route path="/cart" element={<Cart />} /> {/* Cart page */}
          <Route path="/order" element={<PlaceOrder />} /> {/* Checkout/place order */}
          <Route path="/verify" element={<Verify />} /> {/* Payment verification callback */}
          <Route path="/myorders" element={<MyOrders />} /> {/* User orders list */}
        </Routes>
      </div>

      {/* Persistent footer */}
      <Footer />
    </>
  );
};

export default App;
