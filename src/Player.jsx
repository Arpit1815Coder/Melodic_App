import  { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Player.css';

function Player({ spotify }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // Function to play a selected track
  const playSong = (trackUri) => {
    spotify.play({ uris: [trackUri] }).then(() => {
      spotify.getMyCurrentPlayingTrack().then((r) => {
        setCurrentTrack(r.item);
        setIsPlaying(true);
      });
    }).catch(error => {
      console.error('Error playing song:', error);
    });
  };

  // Function to handle play/pause button click
  const handlePlayPause = () => {
    if (isPlaying) {
      spotify.pause();
      setIsPlaying(false);
    } else {
      spotify.play();
      setIsPlaying(true);
    }
  };

  // Function to skip to the next track
  const skipNext = () => {
    spotify.skipToNext();
  };

  // Function to skip to the previous track
  const skipPrevious = () => {
    spotify.skipToPrevious();
  };

  return (
    <div className="player">
      <h1>Welcome to Spotify Clone</h1>
      <div className="playlists">
        {playlists.map(playlist => (
          <div key={playlist.id} className="playlist" onClick={() => {
            setSelectedPlaylist(playlist);
            fetchPlaylistTracks(playlist.id); // Fetch tracks when playlist is clicked
          }}>
            <h2>{playlist.name}</h2>
          </div>
        ))}
      </div>
      {selectedPlaylist && (
        <div className="playlist-tracks">
          <h2>{selectedPlaylist.name}</h2>
          {playlistTracks.map(track => (
            <div key={track.track.id} className="track">
              <img src={track.track.album.images[0].url} alt={track.track.name} />
              <div>
                <h3>{track.track.name}</h3>
                <p>{track.track.artists.map(artist => artist.name).join(', ')}</p>
                <button onClick={() => playSong(track.track.uri)}>Play</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {currentTrack && (
        <div className="now-playing">
          <h2>Now Playing</h2>
          <img src={currentTrack.album.images[0].url} alt={currentTrack.name} />
          <div>
            <h3>{currentTrack.name}</h3>
            <p>{currentTrack.artists.map(artist => artist.name).join(', ')}</p>
          </div>
          <div className="controls">
            <button onClick={skipPrevious}>Previous</button>
            <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
            <button onClick={skipNext}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}

Player.propTypes = {
  spotify: PropTypes.object.isRequired,
};

export default Player;
