import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { AuthContext } from "../AuthContext";
import HamburgerMenu from "./HamburgerMenu";

const Header = () => {
  const [accessToken, setAccessToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    setAccessToken(localStorage.getItem(ACCESS_TOKEN));
  }, [location]);

  function handleLogout() {
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
      localStorage.clear();
      setUser(null);
    }, [setUser]);

    return <Navigate to="/login/" />;
  }
  return (
    <header className="h-14 fixed top-0 left-0 w-full text-white bg-black/30 px-6 py-4 z-10 border-b-2 border-zinc-900 ">
      <nav className="container mx-auto flex justify-between">
        <div className="flex-1 flex justify-between">
          <Link
            to="/"
            className="flex hover:opacity-50 space-x-2 cursor-pointer"
          >
            <img className="h-6" src="/basketball1.png" alt="Logo" />
            <span>3X3 Mini</span>
          </Link>
          <HamburgerMenu
            accessToken={accessToken}
            handleLogout={handleLogout}
          />
        </div>
        <div className="sm:flex justify-between space-x-4 hidden">
          <Link
            to="/profile"
            className="cursor-pointer hover:opacity-50 flex gap-1"
          >
            Profile
            <img className="h-6" src="/profile.svg" alt="Profile" />
          </Link>
          <Link
            to="/tournaments"
            className="flex justify-around w-32 hover:opacity-50 cursor-pointer"
          >
            Tournaments
            <img className="h-6" src="/trophy.png" alt="Trophy" />
          </Link>
          {accessToken ? (
            <Link
              to="/logout"
              onClick={handleLogout}
              className="cursor-pointer hover:opacity-50"
            >
              Logout
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="flex cursor-pointer hover:opacity-50"
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

              <Link to="/register" className="cursor-pointer hover:opacity-50">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
