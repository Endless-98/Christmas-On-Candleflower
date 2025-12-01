// Song data for the Christmas light show
// Maps song titles to their metadata (artist, album art, display name, etc.)

export const songDatabase = {
  "01 - Intro": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/intro.jpg"
  },
  "Gracechase - EventBetterChristmas": {
    displayName: "Even Better Christmas",
    artist: "Gracechase",
    albumArt: "/assets/album-art/gracechase.jpg"
  },
  "03 - Transition 1": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "All I Need For Christmas": {
    displayName: "All I Need For Christmas",
    artist: "Various Artists",
    albumArt: "/assets/album-art/all-i-need.jpg"
  },
  "05 - Transition 2": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Carol of the Bells": {
    displayName: "Carol of the Bells",
    artist: "Various Artists",
    albumArt: "/assets/album-art/carol-bells.jpg"
  },
  "07 - Transition 3": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Feels Like Joy": {
    displayName: "Feels Like Joy",
    artist: "Various Artists",
    albumArt: "/assets/album-art/feels-like-joy.jpg"
  },
  "09 - Transition 4": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Star Wars Medley": {
    displayName: "Star Wars Medley",
    artist: "John Williams",
    albumArt: "/assets/album-art/star-wars.jpg"
  },
  "11 - Transition 5": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "God Rest Ye Merry Gentlemen": {
    displayName: "God Rest Ye Merry Gentlemen",
    artist: "Traditional",
    albumArt: "/assets/album-art/god-rest.jpg"
  },
  "13 - Transition 6": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Christmas Party (All the Way)": {
    displayName: "Christmas Party (All the Way)",
    artist: "Various Artists",
    albumArt: "/assets/album-art/christmas-party.jpg"
  },
  "15 - Transition 7": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Sounding Joy": {
    displayName: "Sounding Joy",
    artist: "Various Artists",
    albumArt: "/assets/album-art/sounding-joy.jpg"
  },
  "17 - Transition 8": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Light of Christmas": {
    displayName: "Light of Christmas",
    artist: "Various Artists",
    albumArt: "/assets/album-art/light-of-christmas.jpg"
  },
  "19 - Transition 9": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Ring the Bells": {
    displayName: "Ring the Bells",
    artist: "Various Artists",
    albumArt: "/assets/album-art/ring-bells.jpg"
  },
  "23 - Transition 11": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Call of Duty": {
    displayName: "Call of Duty",
    artist: "Game Soundtrack",
    albumArt: "/assets/album-art/call-of-duty.jpg"
  },
  "25 - Transition 12": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Joy He Shall Reign": {
    displayName: "Joy He Shall Reign",
    artist: "Various Artists",
    albumArt: "/assets/album-art/joy-reign.jpg"
  },
  "27 - Transition 13": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "Christmas Every Day": {
    displayName: "Christmas Every Day",
    artist: "Various Artists",
    albumArt: "/assets/album-art/christmas-every-day.jpg"
  },
  "29 - Transition 14": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/transition.jpg"
  },
  "To Hear the Angels Sing": {
    displayName: "To Hear the Angels Sing",
    artist: "Various Artists",
    albumArt: "/assets/album-art/angels-sing.jpg"
  },
  "31 - Outro": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/outro.jpg"
  },
  "Countdown": {
    displayName: "Lanny and Wayne",
    artist: "",
    albumArt: "/assets/album-art/system.jpg"
  }
};

/**
 * Get metadata for a song by title
 * @param {string} songTitle - The title of the song
 * @returns {Object} Object with displayName, artist and albumArt, or defaults if not found
 */
export function getSongMetadata(songTitle) {
  const metadata = songDatabase[songTitle];
  
  if (metadata) {
    return metadata;
  }
  
  // Return defaults if song not found in database
  return {
    displayName: songTitle,
    artist: "Unknown Artist",
    albumArt: "/assets/album-art/default.jpg"
  };
}

/**
 * Get all song titles from the database
 * @returns {string[]} Array of all song titles
 */
export function getAllSongTitles() {
  return Object.keys(songDatabase);
}
