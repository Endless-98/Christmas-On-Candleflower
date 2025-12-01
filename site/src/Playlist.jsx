import React from 'react';
import { songDatabase, playlistOrder } from './songData';

export default function Playlist({ nowPlaying }) {
  // Build songs array from the songDatabase, excluding system/transition tracks
  if (!playlistOrder || !songDatabase) {
    console.error('songData not loaded properly');
    return <section style={{marginTop: '1rem'}}><h2>Our Christmas Playlist</h2><p>Loading...</p></section>;
  }

  const songs = playlistOrder
    .map(songKey => {
      const song = songDatabase[songKey];
      if (!song) {
        console.warn(`Song not found in database: ${songKey}`);
        return null;
      }
      return {
        title: song.displayName,
        artist: song.artist,
        spotifyUrl: "",
        youtubeUrl: ""
      };
    })
    .filter(song => song && song.artist !== ""); // Exclude null entries and Lanny and Wayne entries

  return (
    <section style={{marginTop: '1rem'}}>
      <h2>Our Christmas Playlist</h2>
      <div className="playlist-simple">
        {songs.map((song, index) => {
          const isCurrentlyPlaying = nowPlaying?.songTitle === song.title;
          return (
          <div key={index} className={`song-simple ${isCurrentlyPlaying ? 'now-playing-highlight' : ''}`}>
            <div className="song-number">{index + 1}</div>
            <div className="song-details">
              <div className="song-title-simple">{song.title}</div>
              <div className="song-artist-simple">{song.artist}</div>
            </div>
            <div className="song-actions">
              {song.spotifyUrl && (
                <a 
                  href={song.spotifyUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn spotify-btn"
                  title="Listen on Spotify"
                >
                  🎵
                </a>
              )}
              {song.youtubeUrl && (
                <a 
                  href={song.youtubeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="action-btn youtube-btn"
                  title="Watch on YouTube"
                >
                  📺
                </a>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </section>
  );
}