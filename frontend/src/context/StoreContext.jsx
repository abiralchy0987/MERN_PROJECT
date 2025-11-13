import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");

 const [food_list, setFoodlist] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
      
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
    }
  };
  // useEffect(() => {
  //     console.log(cartItems);
  // }, [cartItems])

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
     }
  }
  ,[])

  //fetch food list from backend
  const fetchFoodList = async() => {
    const response = await axios.get(url+"/api/food/list");
    setFoodlist(response.data.data);
  }
  const loadCartData = async(token) => {
    const response = await axios.post(url+"/api/cart/get",{},{ headers: { token } });
    setCartItems(response.data.cartData);
  }

  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get(url + "/api/user/profile", { headers: { token } });
      if (res.data && res.data.success) setUser(res.data.data);
    } catch (err) {
      console.log("Failed to fetch profile", err?.response?.data || err.message);
    }
  }

    useEffect(() => {
 // reload the page and keep the user logged in
     async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
      const t = localStorage.getItem("token");
      await loadCartData(t);
      await fetchUserProfile(t);
     }
    } loadData();
  },[])

    // When token changes (e.g., user logs in or registers), fetch profile and cart
    useEffect(() => {
      if (token) {
        fetchUserProfile(token);
        loadCartData(token).catch(() => {});
      } else {
        setUser(null);
        setCartItems({});
      }
    }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    user,
    setUser,
    searchTerm,
    setSearchTerm
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
