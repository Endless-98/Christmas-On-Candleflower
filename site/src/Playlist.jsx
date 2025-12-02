import React, { useEffect, useRef, useState } from 'react';
import { songDatabase, playlistOrder } from './songData';

function ProgressBar({ timestamp, songDuration, artist }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Don't show progress for Lanny and Wayne (empty artist)
    if (!artist || !timestamp || !songDuration) {
      setProgress(0);
      return;
    }

    const updateProgress = () => {
      const now = Date.now();
      const songStartedAt = new Date(timestamp).getTime();
      const elapsed = now - songStartedAt;
      // songDuration is in seconds, convert to milliseconds
      const durationMs = songDuration * 1000;
      const progressPercent = Math.min((elapsed / durationMs) * 100, 100);
      setProgress(progressPercent);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 500);

    return () => clearInterval(interval);
  }, [timestamp, songDuration, artist]);

  // Don't render for Lanny and Wayne
  if (!artist) return null;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

export default function Playlist({ nowPlaying }) {
  const nowPlayingRef = useRef(null);

  useEffect(() => {
    // Scroll to the currently playing song when the component mounts or nowPlaying changes
    if (nowPlayingRef.current) {
      setTimeout(() => {
        nowPlayingRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [nowPlaying?.songTitle]);
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
        albumArt: song.albumArt,
        spotifyUrl: song.spotifyUrl || "",
        youtubeMusicUrl: song.youtubeMusicUrl || ""
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
          <div 
            key={index} 
            className={`song-simple ${isCurrentlyPlaying ? 'now-playing-highlight' : ''}`}
            ref={isCurrentlyPlaying ? nowPlayingRef : null}
          >
            <div>
              {song.albumArt && (
                <img src={song.albumArt} alt={`${song.title} album art`} className="song-album-art" />
              )}
              <div className="song-details">
                {isCurrentlyPlaying && (
                  <div className="currently-playing-badge">Now Playing</div>
                )}
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
                {song.youtubeMusicUrl && (
                  <a 
                    href={song.youtubeMusicUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="action-btn youtube-btn"
                    title="Listen on YouTube Music"
                  >
                    📺
                  </a>
                )}
              </div>
            </div>
            {isCurrentlyPlaying && <ProgressBar timestamp={nowPlaying.timestamp} songDuration={nowPlaying.songDuration} artist={nowPlaying.artist} />}
          </div>
          );
        })}
      </div>
    </section>
  );
}