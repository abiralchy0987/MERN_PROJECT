// Import React and the useContext hook
import React, { useContext } from "react";
// Import component-specific stylesheet
import "./FoodItem.css";
// Import shared image assets used in this component
import { assets } from "../../assets/assets";
// Import global store context for cart state/actions
import { StoreContext } from "../../context/StoreContext";

// Functional component declaration. Accepts props for item details.
const FoodItem = ({ id, name, price, description, image }) => {

  // Read cart state and action functions from context
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // Render the food item card
  return (
    <div className="food-item">
      {/* Container for image and add/remove controls */}
      <div className="food-item-img-container">
        {/* Show food image using backend URL + image filename */}
        <img className="food-item-image" src={url + "/images/" + image} alt="" />

        {/* Conditional: if not in cart show single add button */}
        {!cartItems[id] ? (
          <img
            className="add"
            // clicking adds the item to cart
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          /* If present in cart, show counter with remove/add controls */
          <div className="food-item-counter">
            {/* Remove one unit when clicked */}
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            {/* Current quantity */}
            <p>{cartItems[id]}</p>
            {/* Add one unit when clicked */}
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        )}

        {/*
          Alternate/local counter implementation commented out in original file.
          Kept here as a comment for reference.
        */}
      </div>

      {/* Info section: name, rating, description, and price */}
      <div className="food-item-info">
        <div className="food-item-name-rating">
          {/* Display item name */}
          <p>{name}</p>
          {/* Rating icon */}
          <img src={assets.rating_starts} alt="" />
        </div>

        {/* Item description */}
        <p className="food-item-desc">{description}</p>
        {/* Item price */}
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
