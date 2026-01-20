import React from "react";
import { Link } from "react-router-dom";
import "./ComingSoon.css";

const ComingSoon = () => {
  return (
    <div className="coming-soon-container">
      <div className="coming-soon-card">
        <h1>🚧 Coming Soon</h1>
        <p>
          This feature is currently under development.
          <br />
          We're working hard to bring it to you soon!
        </p>

        <Link to="/" className="back-home-btn">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
