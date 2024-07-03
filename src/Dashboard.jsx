// Dashboard.jsx
import  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';

function Dashboard({ spotify }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);

  // Fetch user's playlists on component mount
  useEffect(() => {
    spotify.getUserPlaylists().then(response => {
      setPlaylists(response.items);
    }).catch(error => {
      console.error('Error fetching playlists:', error);
    });
  }, [spotify]);

  // Function to fetch tracks for a selected playlist
  const fetchPlaylistTracks = (playlistId) => {
    spotify.getPlaylistTracks(playlistId).then(response => {
      setPlaylistTracks(response.items);
    }).catch(error => {
      console.error('Error fetching playlist tracks:', error);
      setPlaylistTracks([]); // Set empty array in case of error
    });
  };

  // Function to handle playlist click
  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    fetchPlaylistTracks(playlist.id);
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Playlists</h2>
        <ul>
          {playlists.map(playlist => (
            <li key={playlist.id} onClick={() => handlePlaylistClick(playlist)}>
              {playlist.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        {selectedPlaylist && (
          <div className="playlist-tracks">
            <h2>{selectedPlaylist.name}</h2>
            <div className="grid-container">
              {playlistTracks.map(track => (
                <div key={track.track.id} className="track">
                  <img src={track.track.album.images[0].url} alt={track.track.name} />
                  <div>
                    {/* <h3>{track.track.name}</h3> */}
                    {/* <p>{track.track.artists.map(artist => artist.name).join(', ')}</p> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  spotify: PropTypes.object.isRequired,
};

export default Dashboard;
