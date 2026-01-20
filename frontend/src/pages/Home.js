import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import petSupplies from '../utils/pet-supplies.png';
import petsLover from '../utils/petsLover.jpg';
import win from '../utils/win.jpg';


const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to PetSwap!</h1>
        <h2>A warm and supportive community for pet lovers</h2>
        <p>
          Discover a place where you can give new life to your gently used pet items
          and help fellow pet owners find what they need.
        </p>
        <Link to="/products" className="cta-button">View Products</Link>
      </div>

      {/* Feature Sections */}
      <div className="home-intro">
        <div className="intro-section">
          <img src={petSupplies} alt="Pet Supplies" className="intro-image" />
          <h3>Rehome Your Items</h3>
          <p>
            Have pet supplies at home that are no longer in use? Or maybe your furry friend has outgrown some items? 
            Give them a second life!
          </p>
        </div>

        <div className="intro-section">
          <img src={petsLover} alt="Happy Pets" className="intro-image" />
          <h3>Help Other Pet Lovers</h3>
          <p>
            Other pet owners may be looking for affordable, quality items for their furry, feathered, or scaly companions. 
            Your gently used items can make their lives easier.
          </p>
        </div>

        <div className="intro-section">
          <img src={win} alt="Community" className="intro-image" />
          <h3>Create a Win-Win</h3>
          <p>
            Our platform provides a convenient space to rehome items, connecting those who need them with those who have them.
            Everyone wins!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

