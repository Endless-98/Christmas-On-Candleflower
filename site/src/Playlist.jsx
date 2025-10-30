import React from 'react';

export default function Playlist() {
  const songs = [
    {
      title: "Even Better Christmas",
      artist: "Gracechase",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "All I Need For Christmas",
      artist: "Toby Mac",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Carol of the Bells",
      artist: "Lindsey Stirling",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Feels Like Joy",
      artist: "Micah Tyler",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Star Wars Medley",
      artist: "Various Artists",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "God Rest Ye Merry Gentlemen",
      artist: "Pentatonix",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Christmas Party (All the Way)",
      artist: "Gracechase",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Sounding Joy",
      artist: "Ellie Holcomb",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Light Of Christmas",
      artist: "TobyMac",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Ring the Bells",
      artist: "Big Daddy Weave ft. Meridith Andrews",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Christmas This Year",
      artist: "TobyMac ft. Leigh Nash",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Call of Duty Medley",
      artist: "Various Artists",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Joy! He Shall Reign",
      artist: "Big Daddy Weave",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "Christmas Every Day",
      artist: "Simple Plan",
      spotifyUrl: "",
      youtubeUrl: ""
    },
    {
      title: "To Hear the Angels Sing",
      artist: "Gracechase",
      spotifyUrl: "",
      youtubeUrl: ""
    }
  ];

  return (
    <section style={{marginTop: '1rem'}}>
      <h2>Our Christmas Playlist</h2>
      <div className="playlist-simple">
        {songs.map((song, index) => (
          <div key={index} className="song-simple">
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
        ))}
      </div>
      
      <div className="playlist-info">
        <div className="info-card">
          <h3>🕐 Show Schedule</h3>
          <p>Songs play in order throughout the evening, creating a seamless musical journey.</p>
        </div>
        
        <div className="info-card">
          <h3>🎶 Love a Song?</h3>
          <p>Click the icons to listen on your favorite platform. <a href="#/contact">Contact us</a> for song requests!</p>
        </div>
      </div>
    </section>
  );
}