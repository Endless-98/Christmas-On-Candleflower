import React, { useEffect, useState } from 'react';
import Contact from './Contact';
import Playlist from './Playlist';
import { getNextSong, getSongMetadata, songDatabase } from './songData';

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

function Home({ mapSrc, nowPlaying, setNowPlaying, isLoading, showNowPlaying }) {

  return (
    <section style={{marginTop: '1rem'}}>

      {showNowPlaying && (
        <>
          <h2 id="playlist">Now Playing</h2>
          <a href="#/playlist" className="now-playing-link">
            <div className="now-playing">
              <div>
                {isLoading ? (
                  <>
                    <div className="np-art np-loading" aria-hidden>
                      <div className="loading-spinner"></div>
                    </div>
                    <div className="np-info">
                      <div className="np-track" style={{opacity: 0.5}}>Loading...</div>
                      <div className="np-artist muted" style={{opacity: 0.5}}>Checking what's playing</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="np-art" aria-hidden>
                      {nowPlaying.albumArt ? (
                        <img src={nowPlaying.albumArt} alt="Album art" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px'}} />
                      ) : (
                        '🎵'
                      )}
                    </div>
                    <div className="np-info">
                      <div className="np-track">{nowPlaying.songTitle}</div>
                      <div className="np-artist muted">{nowPlaying.artist}</div>
                      {nowPlaying.upNext && (
                        <div className="np-up-next muted" style={{fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.6}}>
                          Up Next: {nowPlaying.upNext.displayName}{nowPlaying.upNext.artist && ` · ${nowPlaying.upNext.artist}`}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              {!isLoading && <ProgressBar timestamp={nowPlaying.timestamp} songDuration={nowPlaying.songDuration} artist={nowPlaying.artist} />}
            </div>
          </a>
        </>
      )}

      <h2>Schedule</h2>
      <ul className="items">
        <li>Daily: 5:00 PM — 10:00 PM</li>
      </ul>

      <h2>Location</h2>
      <p className="muted">{import.meta.env.VITE_MAP_QUERY}</p>

      <div className="map-wrapper" aria-hidden={!mapSrc}>
        {mapSrc ? (
          <iframe
            title="Candleflower location"
            src={mapSrc}
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="muted" style={{marginTop: '0.5rem'}}>
            Map is not configured. Set one of VITE_MAP_EMBED_URL, VITE_GOOGLE_MAPS_IFRAME_URL, or VITE_MAP_QUERY in the build environment.
          </div>
        )}
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => {
    const hash = window.location.hash || '#/';
    return hash.replace(/^#/, '') || '/';
  });
  
  // Shared state for now playing across all components
  const [nowPlaying, setNowPlaying] = useState({
    songTitle: 'No track playing',
    artist: 'Not connected',
    albumArt: '',
    timestamp: null,
    showStatus: null,
    upNext: null
  });

  const [isLoading, setIsLoading] = useState(true);
  const [showNowPlaying, setShowNowPlaying] = useState(false); // Start hidden, will show if conditions are met

  useEffect(() => {
    let timeoutId = null;
    let retryCount = 0;
    let staleCount = 0; // Track consecutive stale data encounters
    let lastFetchedData = null;
    let debugMode = false;

    // Debug function accessible from console
    window.enableNowPlayingDebug = () => {
      debugMode = true;
      console.log('Now Playing Debug Mode Enabled - Will query even outside show hours');
      // Trigger an immediate fetch
      fetchNowPlaying();
    };

    const isShowTime = () => {
      // Get current time in Mountain Time
      const now = new Date();
      const mtTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Denver' }));
      const hour = mtTime.getHours();
      const month = mtTime.getMonth(); // 0-indexed: December = 11
      
      // Only run in December
      if (month !== 11) {
        return { active: false, message: 'Show runs in December only' };
      }
      
      // Show runs 5PM - 10PM
      if (hour < 17) {
        return { active: false, message: 'Show starts at 5:00 PM' };
      } else if (hour >= 22) {
        return { active: false, message: 'Show ended at 10:00 PM' };
      }
      
      return { active: true, message: null };
    };

    const fetchNowPlaying = async (isRetry = false) => {
      const s3Url = import.meta.env.VITE_NOW_PLAYING_S3_URL;
      
      if (!s3Url) {
        console.error('VITE_NOW_PLAYING_S3_URL not configured');
        setIsLoading(false);
        return;
      }

      // Check if show is active
      const showCheck = isShowTime();
      if (!debugMode && !showCheck.active) {
        console.log(`Show inactive: ${showCheck.message}`);
        setNowPlaying({
          songTitle: showCheck.message,
          artist: '',
          timestamp: null,
          showStatus: 'inactive',
          upNext: null
        });
        setIsLoading(false);
        setShowNowPlaying(false); // Hide Now Playing section when show is inactive
        
        // Check again in 5 minutes
        timeoutId = setTimeout(() => fetchNowPlaying(), 5 * 60 * 1000);
        return;
      }

      if (debugMode) {
        console.log('🎛️ Debug Mode: Bypassing show time check');
      }

      try {
        console.log(`Fetching now playing from S3... (retry: ${isRetry}, count: ${retryCount})`);
        const response = await fetch(s3Url, { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const lastModified = new Date(response.headers.get('Last-Modified'));
        
        console.log('Fetched data:', data);
        console.log('Last modified:', lastModified.toISOString());
        
        // Check if data is the same as last fetch (retry scenario)
        const dataString = JSON.stringify(data);
        const isSameData = lastFetchedData === dataString;
        
        if (isRetry && isSameData) {
          retryCount++;
          console.warn(`⚠️ RETRY ${retryCount}: Data unchanged since last fetch`);
          
          // Exponential backoff: 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s, then 15min
          let waitTime;
          if (retryCount >= 10) {
            waitTime = 15 * 60 * 1000; // 15 minutes
            console.warn(`🔴 Max retries reached (${retryCount}). Waiting 15 minutes before next attempt.`);
          } else {
            waitTime = Math.min(Math.pow(2, retryCount) * 1000, 512000); // Cap at ~8.5 minutes
            console.log(`⏱️ Exponential backoff: waiting ${waitTime / 1000}s before retry`);
          }
          
          timeoutId = setTimeout(() => fetchNowPlaying(true), waitTime);
          return;
        }
        
        // Calculate how long ago the song started
        const now = Date.now();
        const songStartedAt = lastModified.getTime();
        const secondsSinceStart = Math.floor((now - songStartedAt) / 1000);
        const songDuration = data.songDuration || 180; // Default 3 minutes if not provided
        const secondsRemaining = songDuration - secondsSinceStart;
        
        // Check if this is stale data (song ended more than grace period ago)
        const GRACE_PERIOD = 3.5;
        const isStaleData = secondsRemaining < -GRACE_PERIOD;
        
        // CRITICAL: Only reset retry counter if we have truly fresh data
        // If data is the same AND stale, we need to keep the retry counter
        if (!isSameData) {
          // Completely new data - reset everything
          if (retryCount > 0) {
            console.log(`✅ Fresh data received after ${retryCount} retries`);
          }
          retryCount = 0;
          staleCount = 0; // Reset stale counter on new data
          lastFetchedData = dataString;
        } else if (!isStaleData) {
          // Same data but still valid (within grace period) - reset retry counter
          retryCount = 0;
          staleCount = 0; // Reset stale counter
          lastFetchedData = dataString;
        }
        // If isSameData && isStaleData: keep retry counter, will use exponential backoff below
        
        console.log(`🎵 Song: "${data.songTitle}" by ${data.artist}`);
        console.log(`   Duration: ${songDuration}s, Elapsed: ${secondsSinceStart}s, Remaining: ${secondsRemaining}s`);
        
        // Look up metadata from local song database
        const metadata = getSongMetadata(data.songTitle);
        console.log(`📀 Metadata lookup for "${data.songTitle}":`, metadata);
        if (metadata.artist === "Unknown Artist") {
          console.warn(`⚠️ Song not found in database! Title from S3: "${data.songTitle}"`);
          console.log('Available database keys:', Object.keys(songDatabase));
        }
        
        // Get the next song in the playlist
        const upNext = getNextSong(data.songTitle);
        
        setNowPlaying({
          songTitle: metadata.displayName || 'No track playing',
          artist: metadata.artist || '',
          albumArt: metadata.albumArt || '',
          timestamp: lastModified.toISOString(),
          songDuration,
          showStatus: 'active',
          upNext
        });
        setIsLoading(false);
        
        // Show Now Playing if we haven't seen 3 consecutive stale data points
        setShowNowPlaying(staleCount < 3);
        
        // Schedule next check with intelligent retry logic
        let nextCheckIn;
        let shouldRetry = false;

        if (isStaleData) {
          // Data is stale - use exponential backoff
          retryCount++;
          staleCount++; // Increment stale counter
          
          // Hide Now Playing after 3 consecutive stale data encounters
          if (staleCount >= 3) {
            console.warn(`🚫 Hiding Now Playing section after ${staleCount} consecutive stale data encounters`);
            setShowNowPlaying(false);
          }
          
          let waitTime;
          if (retryCount >= 10) {
            waitTime = 15 * 60 * 1000; // 15 minutes
            console.warn(`🔴 STALE DATA: Retry ${retryCount}. Waiting 15 minutes before next attempt.`);
          } else {
            waitTime = Math.min(Math.pow(2, retryCount) * 1000, 512000); // Cap at ~8.5 minutes
            console.warn(`⚠️ STALE DATA: Song ended ${Math.abs(secondsRemaining)}s ago. Retry ${retryCount}, Stale count: ${staleCount}. Waiting ${waitTime / 1000}s`);
          }
          
          nextCheckIn = waitTime / 1000;
          shouldRetry = true;
        } else {
          // Data is fresh - schedule based on when song will end
          nextCheckIn = Math.max(secondsRemaining + GRACE_PERIOD, 1);
          shouldRetry = false;
          console.log(`⏰ Next check in ${nextCheckIn}s (when song should end + ${GRACE_PERIOD}s grace)`);
        }
        
        timeoutId = setTimeout(() => fetchNowPlaying(shouldRetry), nextCheckIn * 1000);
        
      } catch (error) {
        console.error('❌ Failed to fetch now playing:', error);
        setIsLoading(false);
        
        // Retry on error with exponential backoff
        retryCount++;
        const waitTime = Math.min(Math.pow(2, retryCount) * 1000, 60000); // Cap at 1 minute
        console.log(`🔄 Error retry ${retryCount}: waiting ${waitTime / 1000}s`);
        timeoutId = setTimeout(() => fetchNowPlaying(true), waitTime);
      }
    };

    // Start fetching
    fetchNowPlaying();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
  
  const rawQuery = import.meta.env.VITE_MAP_QUERY || '';
  const encodedQuery = rawQuery ? encodeURIComponent(rawQuery) : '';

  // Priority: full embed URL (two supported names) -> API key + Embed API -> public q= fallback
    const rawEmbed = import.meta.env.VITE_MAP_EMBED_URL || import.meta.env.VITE_GOOGLE_MAPS_IFRAME_URL || '';
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    // Normalize embed URL: if a non-absolute value is provided, treat it as a query string and construct a Google Maps embed
    const normalizeEmbed = (val) => {
      if (!val) return '';
      const trimmed = String(val).trim();
      if (/^https?:\/\//i.test(trimmed)) return trimmed; // absolute URL OK
      // Treat as a raw query (address or place) and build a public embed
      return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&output=embed`;
    };

    let mapSrc = '';
    if (rawEmbed) {
      mapSrc = normalizeEmbed(rawEmbed);
    } else if (apiKey && encodedQuery) {
      mapSrc = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedQuery}`;
    } else if (encodedQuery) {
      // Public (no API key) embed using maps?q=...&output=embed — less featured but works without API key
      mapSrc = `https://maps.google.com/maps?q=${encodedQuery}&output=embed`;
    } else {
      mapSrc = '';
    }
    useEffect(() => {
      const onHash = () => {
        const hash = window.location.hash || '#/';
        setRoute(hash.replace(/^#/, '') || '/');
      };
      window.addEventListener('hashchange', onHash);
      return () => window.removeEventListener('hashchange', onHash);
    }, []);

    // On mobile browsers (Chrome) the visual viewport can shift when the URL/search
    // chrome shows/hides, causing the page content to move relative to the fixed
    // background. Use the Visual Viewport API (when available) to nudge the
    // background pseudo-element so it stays visually aligned with the page content.
    useEffect(() => {
      const vv = window.visualViewport;
      if (!vv) return undefined;

      const applyOffset = () => {
        // Two ways mobile browsers report UI shifts:
        // 1) offsetTop changes (distance between layout and visual viewport top)
        // 2) pageTop diverges from window.scrollY while the chrome animates
        // We want the background to move in the SAME direction as the content shift.
        // That means applying a POSITIVE translateY equal to the visual viewport's
        // top offset relative to the layout viewport.
        let offsetPx = 0;
        if (typeof vv.offsetTop === 'number' && vv.offsetTop !== 0) {
          offsetPx = vv.offsetTop;
        } else if (typeof vv.pageTop === 'number') {
          offsetPx = vv.pageTop - window.scrollY;
        }
        document.documentElement.style.setProperty('--vv-offset', `${offsetPx || 0}px`);
      };

      applyOffset();
      vv.addEventListener('resize', applyOffset);
      vv.addEventListener('scroll', applyOffset);
      // As a fallback, update on page scroll too
      window.addEventListener('scroll', applyOffset, { passive: true });

      return () => {
        vv.removeEventListener('resize', applyOffset);
        vv.removeEventListener('scroll', applyOffset);
        window.removeEventListener('scroll', applyOffset);
        document.documentElement.style.removeProperty('--vv-offset');
      };
    }, []);

    return (
      <div className="container">
        <header>
          <div>
            <h1 className="site-title">
              <img src={`${import.meta.env.BASE_URL}assets/CoCLWLogo.png`} alt="Christmas On Candleflower" />
            </h1>
          </div>
          <nav aria-label="Primary">
            <a href="#/" className={route === '/' ? 'nav-link active' : 'nav-link'}>Home</a>
            <a href="#/playlist" className={route === '/playlist' ? 'nav-link active' : 'nav-link'}>Playlist</a>
            <a href="#/contact" className={route === '/contact' ? 'nav-link active' : 'nav-link'}>Contact</a>
          </nav>
        </header>

        {route === '/playlist' && <Playlist nowPlaying={nowPlaying} />}
        {route === '/contact' && <Contact />}
        {route === '/' && <Home mapSrc={mapSrc} nowPlaying={nowPlaying} setNowPlaying={setNowPlaying} isLoading={isLoading} showNowPlaying={showNowPlaying} />}
        {/* default fallback: home */}
        {(route !== '/' && route !== '/playlist' && route !== '/contact') && <Home mapSrc={mapSrc} nowPlaying={nowPlaying} setNowPlaying={setNowPlaying} isLoading={isLoading} showNowPlaying={showNowPlaying} />}
      </div>
    );
  }
