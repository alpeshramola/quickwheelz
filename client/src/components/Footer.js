import React from 'react';

const Footer = () => (
  <footer style={{ background: '#fff', color: '#000', textAlign: 'center', padding: '1.5rem 0', marginTop: 'auto', boxShadow: '0 -2px 4px rgba(0,0,0,0.04)' }}>
    <span>&copy; {new Date().getFullYear()} QuickWheelz. All rights reserved.</span>
  </footer>
);

export default Footer;
