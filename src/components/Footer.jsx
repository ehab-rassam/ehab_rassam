import React from "react";

const Footer = () => {
  return (
    <footer className="py-6 border-t border-red-600/20 bg-darkBg/90">
      <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
        <p>All Rights Reserved &copy; Hind Mamdouh {new Date().getFullYear()}</p>
        <p className="mt-1">Powered by Mediahelst Marketing Agency</p>
      </div>
    </footer>
  );
};

export default Footer;