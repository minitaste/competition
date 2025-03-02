import { useContext, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Loading from "./Loading";
import { AuthContext } from "../AuthContext";

function Form({ route, method }) {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const isLogin = method === "login";
  const name = isLogin ? "Log in" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { username, password };
      if (!isLogin) payload.email = email;
      const response = await api.post(route, payload);
      
      let accessToken;
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
      } else {
        const loginResponse = await api.post("/api/token/", payload);
        localStorage.setItem(ACCESS_TOKEN, loginResponse.data.access);
        localStorage.setItem(REFRESH_TOKEN, loginResponse.data.refresh);
      }

      const userResponse = await api.get("/api/user/me/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(userResponse.data);
      navigate("/profile");
    } catch (error) {
      console.error(error);
      setError(error.response.data.username || "Invalid username/password.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-30 flex min-h-full max-w-lg flex-1 flex-col justify-center items-center sm:mx-auto px-6 py-12 lg:px-8 text-white bg-zinc-900/70 rounded-2xl mx-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-2 text-center text-2xl/9 font-bold tracking-tight ">
          {name}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="text-red-500 text-center mb-2">{error}</p>
        <form onSubmit={handleSubmit} className="">
          <div>
            <label htmlFor="username" className="block text-sm/6 font-medium ">
              {name}
            </label>
            <div className="mt-2">
              <input
                className="block w-full rounded-md px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium ">
                Email
              </label>
              <div className="mt-2">
                <input
                  className="block w-full rounded-md px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
            </div>
          )}

          <div className="mt-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium "
              >
                Password
              </label>
            </div>

            <div className="mt-2">
              <input
                className="block w-full rounded-md  px-3 py-1.5 text-base  outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
          </div>
          {loading && <Loading />}
          <div className="mt-3 ml-1">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              {name}
            </button>
          </div>
          {isLogin ? (
            <div className="mt-2">
              Don`t have a profile,{" "}
              <Link to="/register" className="underline hover:opacity-70">
                Sign Up
              </Link>
            </div>
          ) : (
            <div>
              Have profile?{" "}
              <Link to="/login" className="underline hover:opacity-70">
                Log In
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Form;
