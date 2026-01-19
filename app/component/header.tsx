"use client";

import { useState } from "react";

export default function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const menuItems = [
    { label: "Home", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "About Us", href: "#" },
  ];

  return (
    <>
      <header className="bg-indigo-700 text-white p-4">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-xl font-bold">
            <img src="/logo.jpg" alt="VGroupApp Logo" className="h-8" />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="hover:text-gray-200 transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleDrawer}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isDrawerOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </header>

      {/* Backdrop Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30 md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Side Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-indigo-700 text-white shadow-lg transform transition-transform duration-300 z-40 md:hidden ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-indigo-600 flex justify-between items-center">
          <h2 className="text-lg font-bold">Menu</h2>
        
        </div>

        {/* Drawer Menu Items */}
        <ul className="py-4">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="block px-6 py-3 hover:bg-indigo-600 transition-colors border-l-4 border-transparent hover:border-white"
                onClick={() => setIsDrawerOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}