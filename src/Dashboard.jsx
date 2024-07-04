import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';

function Dashboard({ spotify }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audio = useMemo(() => new Audio(), []);

  useEffect(() => {
    // Fetch user's playlists on component mount
    const fetchPlaylists = async () => {
      try {
        const response = await spotify.getUserPlaylists();
        setPlaylists(response.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, [spotify]);

  // Function to fetch tracks for a selected playlist
  const fetchPlaylistTracks = async (playlistId) => {
    try {
      const response = await spotify.getPlaylistTracks(playlistId);
      setPlaylistTracks(response.items);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      setPlaylistTracks([]);
    }
  };

  // Function to handle playlist click
  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
    fetchPlaylistTracks(playlist.id);
  };

  // Function to handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle search form submit
  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (searchQuery.trim() !== '') {
      try {
        const response = await spotify.searchTracks(searchQuery);
        setSearchResults(response.tracks.items);
      } catch (error) {
        console.error('Error searching tracks:', error);
        setSearchResults([]);
      }
    }
  };

  // Function to play a track
  const playTrack = (track) => {
    if (currentTrack) {
      // Pause the current track if playing
      audio.pause();
      setCurrentTrack(null);
    }

    // Set new track to play
    setCurrentTrack(track);
    audio.src = track.preview_url;
    audio.play().catch((error) => {
      console.error('Failed to play track:', error);
    });
  };

  // Event listener to handle track end
  useEffect(() => {
    const handleTrackEnd = () => {
      setCurrentTrack(null);
    };

    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [audio]);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo-section">
          <img src="melodic.png" alt="Logo" className="logo" />
          <h2>Melodic</h2>
        </div>
        <div className="search-section">
          
          <form onSubmit={handleSearchSubmit}>
           
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder='Search for Tracks...'
            />
            <button type="submit"><i className="fas fa-search"></i></button>
          </form>
        </div>
        <div className="playlist-section">
          <h2>Playlists</h2>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist.id} onClick={() => handlePlaylistClick(playlist)}>
                {playlist.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="main-content">
        {selectedPlaylist && (
          <div className="playlist-tracks">
            <h2>{selectedPlaylist.name}</h2>
            <div className="grid-container">
              {playlistTracks.map((track) => (
                <div key={track.track.id} className="track">
                  <img
                    src={track.track.album.images[0]?.url || 'placeholder-url'}
                    alt={track.track.name}
                  />
                  <div className="track-overlay">
                    <button
                      className="play-button"
                      onClick={() => playTrack(track.track)}
                    >
                      <i className="fas fa-play-circle"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="search-results">
            <h2>Search Results</h2>
            <ul>
              {searchResults.map((track) => (
                <li key={track.id}>
                  {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
                  <button onClick={() => playTrack(track)}>Play</button>
                </li>
              ))}
            </ul>
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
