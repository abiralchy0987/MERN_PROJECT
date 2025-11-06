import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, searchTerm } = useContext(StoreContext);
  const selectedCategory = (category || "ALL").toString().trim().toLowerCase();
  const q = (searchTerm || "").toString().trim().toLowerCase();
  // The search now uses a simple case-insensitive substring match only.
  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          const itemCategory = (item.category || "").toString().trim().toLowerCase();
          const name = (item.name || "").toString().toLowerCase();
          const desc = (item.description || "").toString().toLowerCase();

          // If there's a search query, show items that match (case-insensitive substring)
          if (q) {
            const directMatch = name.includes(q) || itemCategory.includes(q) || desc.includes(q);
            // fuzzy matching removed — use direct substring match only
            if (directMatch) {
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
            }
            return null;
          }

          // Otherwise use category filtering
          if (selectedCategory === "all" || selectedCategory === itemCategory) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
