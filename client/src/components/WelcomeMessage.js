import React from 'react';
import { motion } from 'framer-motion';
import '../styles/WelcomeMessage.css';

const WelcomeMessage = ({ role }) => {
  const message = role === 'owner' 
    ? "Welcome to QuickWheelz.shop! Start listing your bike now"
    : "Welcome to QuickWheelz.shop! Start booking now";

  return (
    <motion.div 
      className="welcome-message"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="welcome-title">{message}</h1>
      {role === 'customer' && (
        <motion.div 
          className="booking-calendar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="booking-text">Choose your preferred dates:</p>
          <div className="calendar-container">
            <input type="date" className="date-input" />
            <span className="date-separator">to</span>
            <input type="date" className="date-input" />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WelcomeMessage; 