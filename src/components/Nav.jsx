import React from "react";
import { useNavigate } from "react-router-dom";

const Nav = ({ triggerTransition }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (triggerTransition) {
      triggerTransition(() => navigate(path)); // Trigger animation and navigate
    } else {
      navigate(path); // Fallback for direct navigation
    }
  };

  return (
    <nav>
      <div className="nav-logo">
        <div className="nav-link" onClick={() => handleNavigation("/")}>
          J.
        </div>
      </div>
      <div className="nav-links">
        <div className="nav-link" onClick={() => handleNavigation("/learning-outcomes")}>
          Learning Outcomes
        </div>
        <div className="nav-link" onClick={() => handleNavigation("/about")}>
          About
        </div>
      </div>
    </nav>
  );
};

export default Nav;