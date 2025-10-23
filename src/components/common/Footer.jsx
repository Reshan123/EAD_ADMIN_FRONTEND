import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-300 p-2 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-gray-600 text-sm">
          © 2024 EV Charge Point Admin. All rights reserved.
        </p>
        <div className="mt-2 flex justify-center space-x-4">
          <p className="text-xs text-gray-500">Privacy Policy</p>
          <p className="text-xs text-gray-500">Terms of Service</p>
          <p className="text-xs text-gray-500">Contact Support</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;