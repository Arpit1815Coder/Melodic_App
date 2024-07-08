import  { useEffect, useState } from "react";
import Login from "./Login";
import { getTokenFromUrl } from "./auth";
import SpotifyWebApi from "spotify-web-api-js";
import Dashboard from "./Dashboard";
import "./App.css";
import "./Loading.css"

const spotify = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('spotifyAccessToken');
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token || storedToken;

    if (_token) {
      localStorage.setItem('spotifyAccessToken', _token);
      setToken(_token);
      spotify.setAccessToken(_token);

      // Additional initialization logic if needed
      spotify.getMe().then(user => {
        console.log("User: ", user);
        setLoading(false);
      });
    } else {
      // Handle case when no token is found
      window.location.href = '/login'; // Redirect to a login page or handle login flow
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="app">
      {token ? <Dashboard spotify={spotify} /> : <Login />}
    </div>
  );
}

export default App;
