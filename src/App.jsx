import  { useEffect, useState } from "react";
import Login from "./Login";
import { getTokenFromUrl } from "./auth";
import SpotifyWebApi from "spotify-web-api-js";

import Dashboard from "./Dashboard.jsx";
import "./App.css";

const spotify = new SpotifyWebApi();

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = getTokenFromUrl();
    window.location.hash = "";
    const _token = hash.access_token;

    if (_token) {
      setToken(_token);
      spotify.setAccessToken(_token);

      spotify.getMe().then((user) => {
        console.log("User: ", user);
      });
    }
  }, []);

  return (
    <div className="app">
      {!token ? (
        <Login />
      ) : (
        <Dashboard spotify={spotify} />
        // Replace <Player spotify={spotify} /> with <Dashboard spotify={spotify} />
      )}
    </div>
  );
}

export default App;
