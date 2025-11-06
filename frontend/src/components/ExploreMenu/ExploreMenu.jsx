// Import React (required for JSX) 
import React from "react";
// Import component styles
import "./ExploreMenu.css";
// Import static menu data from assets
import { menu_list } from "../../assets/assets";

// Component: ExploreMenu
// Props:
// - category: currently selected menu category
// - setCategory: function to change selected category
const ExploreMenu = ({ category, setCategory }) => {
  // Render the explore menu section
  return (
    <div className="explore-menu" id="explore-menu">
      {/* Section title */}
      <h1>Explore Our Menu</h1>
      {/* Short description under the title */}
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a deletable array of dishes. Our
        mission is to satisfy cravings and elevate your dining experience, one
        delicious meal at a time.
      </p>
      {/* Container for the list of menu category items */}
      <div className="explore-menu-list">
        {/* Iterate over static menu_list and render each item */}
        {menu_list.map((item, index) => {
          return (
            <div
              // Toggle selected category when clicked: select the item or reset to ALL
              onClick={() =>
                setCategory((prev) =>
                  prev === item.menu_name ? "ALL" : item.menu_name
                )
              }
              key={index} // unique key for list rendering
              className="explore-menu-list-item"
            >
              {/* Category image; apply "active" class if selected */}
              <img
                className={category === item.menu_name ? "active" : ""}
                src={item.menu_image}
                alt=""
              />
              {/* Category name */}
              <p>{item.menu_name}</p>
            </div>
            // Alternate simpler markup (kept as comment in original):
            // <div key={index} className="explore-menu-list-item">
            //     <img src={item.menu_image} alt="" />
            //     <p>{item.menu_name}</p>
            // </div>
          );
        })}
      </div>
      {/* Horizontal rule separating section */}
      <hr />
    </div>
  );
};

// Export component
export default ExploreMenu;
