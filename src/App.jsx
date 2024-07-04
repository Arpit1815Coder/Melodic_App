import  { useEffect, useState } from "react";
import Login from "./Login";
import { getTokenFromUrl } from "./auth";
import SpotifyWebApi from "spotify-web-api-js";
import Dashboard from "./Dashboard";
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

      spotify.getMe().then(user => {
        console.log("User: ", user);
      });

      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;

      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const player = new window.Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(_token); },
            volume: 0.5
          });

          player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
          });

          player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
          });

          player.addListener('initialization_error', ({ message }) => {
            console.error('Failed to initialize', message);
          });

          player.addListener('authentication_error', ({ message }) => {
            console.error('Failed to authenticate', message);
          });

          player.addListener('account_error', ({ message }) => {
            console.error('Failed to validate Spotify account', message);
          });

          player.addListener('playback_error', ({ message }) => {
            console.error('Failed to perform playback', message);
          });

          player.connect();
        };
      };

      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="app">
      {!token ? <Login /> : <Dashboard spotify={spotify} />}
    </div>
  );
}

export default App;
