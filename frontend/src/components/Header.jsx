import React from "react";

const Header = ({ showLogin, setShowLogin }) => {
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  return (
    <header className="h-14 fixed top-0 left-0 w-full text-white bg-black/30 px-6 py-4 z-10 border-b-2 border-zinc-900 ">
      <nav className="container mx-auto flex justify-between">
        <div className="flex-1 flex space-x-2">
          <div className="flex hover:opacity-50 space-x-2">
            <img className="h-6" src="basketball1.png" />
            <span className="cursor-pointer">3X3 Mini</span>
          </div>
        </div>
        <div className="flex justify-between min-w-96">
          <button className="flex justify-around w-32 hover:opacity-50 cursor-pointer">
            Tournaments
            <img className="h-6" src="trophy.png" />
          </button>
          <button
            onClick={handleLoginClick}
            className="flex justify-around w-20 cursor-pointer hover:opacity-50"
          >
            Log in
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>
          </button>
          <button className="cursor-pointer hover:opacity-50">Sign Up</button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
