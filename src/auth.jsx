export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

// Set redirect URI based on NODE_ENV
let redirectUri = '';
if (process.env.NODE_ENV === 'production') {
  redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
} else {
  redirectUri = 'http://localhost:3000/callback';
}

const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-top-read', // Scope for top tracks and albums
  'user-library-read', // Scope for accessing user's saved tracks and albums
  // add any other scopes you need
];

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split('&')
    .reduce((initial, item) => {
      let parts = item.split('=');
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

export const loginUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes.join(
  '%20'
)}&response_type=token&show_dialog=true`;

// Debugging logs
console.log('Client ID:', clientId);
console.log('Redirect URI:', redirectUri);
console.log('Login URL:', loginUrl);
