import React, { useState } from "react";
import { Link } from "react-router-dom";

const HamburgerMenu = ({ accessToken, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="sm:hidden">
      <button
        onClick={toggleMenu}
        className="flex flex-col justify-center items-center w-10 h-10 p-2 border-none focus:outline-none z-50 relative"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ease-out 
          ${isOpen ? "rotate-45 translate-y-2" : ""}`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white mt-1.5 transition-all duration-300 ease-out 
          ${isOpen ? "opacity-0" : "opacity-100"}`}
        ></span>
        <span
          className={`block w-6 h-0.5 bg-white mt-1.5 transition-all duration-300 ease-out 
          ${isOpen ? "-rotate-45 -translate-y-2" : ""}`}
        ></span>
      </button>
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-zinc-950 shadow-lg transform transition-transform duration-300 ease-in-out z-40 
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="pt-16 px-4">
          <nav>
            <Link
              to="/profile"
              className="cursor-pointer hover:opacity-50 flex gap-1 text-xl mb-1 border-l pl-2"
            >
              Profile
              <img className="h-6" src="/profile.svg" alt="Profile" />
            </Link>
            <Link
              to="/tournaments"
              className="flex w-32 hover:opacity-50 cursor-pointer text-xl mb-1 border-l pl-2"
            >
              Tournaments
              <img className="h-6" src="/trophy.png" alt="Trophy" />
            </Link>
            {accessToken ? (
              <Link
                to="/logout"
                onClick={handleLogout}
                className="cursor-pointer hover:opacity-50 text-xl mb-1 border-l pl-2"
              >
                Logout
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex cursor-pointer hover:opacity-50 text-xl mb-1 border-l pl-2"
                >
                  Log in
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6 ml-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                    />
                  </svg>
                </Link>

                <Link
                  to="/register"
                  className="cursor-pointer hover:opacity-50 text-xl mb-1 border-l pl-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30"
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default HamburgerMenu;
