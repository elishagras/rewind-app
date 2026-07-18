import { useState, useRef, useEffect } from "react";
import { getSongSuggestions, getYouTubeVideoId, getRecommendations, getSearchSuggestions, generateMoreSongs, MOOD_PRESETS, SIDEBAR_PLAYLISTS } from "./api";
import { logSession, logFamiliarSong, logUnfamiliarSong, logSearchedSong, buildPersonalizationContext, getJournalSummary, getUnfamiliarForMood } from "./journal";

function Sidebar({ page, setPage, isOpen, onClose }) {
  return (
    <>
      <div
        className={"sidebar-overlay" + (isOpen ? " open" : "")}
        onClick={onClose}
      />
      <div className={"sidebar" + (isOpen ? " open" : "")}>
        <div className="sidebar-top">
          <div className="sidebar-brand">Rewind</div>
          <button
            className={"sidebar-nav-item" + (page === "home" ? " active" : "")}
            onClick={function() { setPage("home"); onClose(); }}
          >
            <span className="sidebar-nav-icon">&#9632;</span>
            Home
          </button>
          <button
            className={"sidebar-nav-item" + (page === "taste" ? " active taste-active" : "")}
            onClick={function() { setPage("taste"); onClose(); }}
          >
            <span className="sidebar-nav-icon">&#9733;</span>
            My Taste
          </button>
        </div>
        <div className="sidebar-library">
          <div className="sidebar-library-header">
            <span>Your Library</span>
            <button className="sidebar-library-add">+</button>
          </div>
          <div className="sidebar-create-card">
            <div className="sidebar-create-title">Create your first playlist</div>
            <div className="sidebar-create-sub">It is easy, we will help you</div>
            <button className="sidebar-create-btn">Create playlist</button>
          </div>
          <div className="sidebar-playlists">
            {SIDEBAR_PLAYLISTS.map(function(pl) {
              return (
                <div key={pl.id} className="sidebar-playlist-item">
                  <div className="sidebar-playlist-thumb" style={{ background: pl.color }} />
                  <div>
                    <div className="sidebar-playlist-title">{pl.title}</div>
                    <div className="sidebar-playlist-meta">{pl.meta}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

function MiniPlayer({ nowPlaying, expanded, onExpand, onEnded, onPrevious }) {
  const containerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const popupRef = useRef(null);

  useEffect(function() {
    if (!window.YT) {
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(tag, firstScript);
    }
  }, []);

  useEffect(function() {
    if (!nowPlaying || !nowPlaying.videoId) return;
    setIsPlaying(true);

    function createPlayer() {
      if (playerInstanceRef.current) {
        try { playerInstanceRef.current.destroy(); } catch(e) {}
        playerInstanceRef.current = null;
      }
      if (!containerRef.current) return;

      var divId = "yt-player-" + nowPlaying.videoId;
      containerRef.current.innerHTML = "";
      var div = document.createElement("div");
      div.id = divId;
      containerRef.current.appendChild(div);

      playerInstanceRef.current = new window.YT.Player(divId, {
        height: "200",
        width: "100%",
        videoId: nowPlaying.videoId,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: function(event) {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (onEnded) onEnded();
            }
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            }
            if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
          onError: function() {
            if (onEnded) onEnded();
          }
        }
      });
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return function() {
      if (playerInstanceRef.current) {
        try { playerInstanceRef.current.destroy(); } catch(e) {}
        playerInstanceRef.current = null;
      }
    };
  }, [nowPlaying]);

  useEffect(function() {
    if (!expanded) return;
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        var miniBar = document.querySelector(".mini-player");
        if (miniBar && miniBar.contains(e.target)) return;
        onExpand();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return function() { document.removeEventListener("mousedown", handleClickOutside); };
  }, [expanded, onExpand]);

  function handlePlayPause() {
    if (!playerInstanceRef.current) return;
    try {
      var state = playerInstanceRef.current.getPlayerState();
      if (state === window.YT.PlayerState.PLAYING) {
        playerInstanceRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerInstanceRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch(e) {}
  }

  if (!nowPlaying) return null;

  var thumbUrl = "https://img.youtube.com/vi/" + nowPlaying.videoId + "/mqdefault.jpg";

  return (
    <>
      {expanded && (
        <div ref={popupRef} className="mini-player-iframe-container">
          <div className="mini-player-full-header">
            <img
              className="mini-player-full-art"
              src={thumbUrl}
              alt={nowPlaying.title}
            />
            <div>
              <div className="mini-player-full-title">{nowPlaying.title}</div>
              <div className="mini-player-full-artist">{nowPlaying.artist}</div>
            </div>
          </div>
          <div ref={containerRef} style={{ borderRadius: "8px", overflow: "hidden" }} />
        </div>
      )}

      <div className="mini-player">
        <img
          className="mini-player-art"
          src={thumbUrl}
          alt={nowPlaying.title}
        />
        <div className="mini-player-info-col">
          <div className="mini-player-title">{nowPlaying.title}</div>
          <div className="mini-player-artist">{nowPlaying.artist}</div>
        </div>
        <div className="mini-player-controls">
          {onPrevious && (
            <button className="mini-ctrl-btn" onClick={onPrevious} title="Previous">⏮</button>
          )}
          <button className="mini-ctrl-btn play" onClick={handlePlayPause}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          {onEnded && (
            <button className="mini-ctrl-btn" onClick={onEnded} title="Next">⏭</button>
          )}
          <button className="mini-ctrl-btn chevron" onClick={onExpand} title="Now Playing">
            {expanded ? "↓" : "↑"}
          </button>
        </div>
      </div>
    </>
  );
}

function MyTastePage() {
  var summary = getJournalSummary();
  var journal = null;
  try {
    var raw = localStorage.getItem("rewind_journal");
    journal = raw ? JSON.parse(raw) : null;
  } catch(e) {}

  var moodsChosen = journal ? journal.moodsChosen || {} : {};
  var familiarsongs = journal ? (journal.familiarsongs || []) : [];
  var unfamiliarsongs = journal ? (journal.unfamiliarsongs || []) : [];
  var searchedSongs = journal ? (journal.searchedSongs || []) : [];

  var sortedMoods = Object.entries(moodsChosen).sort(function(a, b) { return b[1] - a[1]; });
  var topFamiliar = familiarsongs.sort(function(a, b) { return (b.count || 1) - (a.count || 1); }).slice(0, 8);
  var recentSearches = searchedSongs.slice(-8).reverse();

  var moodLabels = {
    "missing-home": "Missing home",
    "late-night": "Late night drive",
    "stressed": "Stressed and overwhelmed",
    "college": "Nostalgic for college",
    "calm": "Need to feel calm",
    "far": "Far from loved ones",
    "homesick": "Homesick and alone",
    "remembering": "Remembering someone",
    "surprise": "Something different tonight"
  };

  return (
    <div className="taste-page">
      <div className="taste-nav">
        <div>
          <p className="taste-tag">Your listening profile</p>
          <h2 className="taste-headline">My Taste</h2>
          <p className="taste-sub">What Rewind has learned about you so far.</p>
        </div>
      </div>

      <div className="taste-stats-row">
        <div className="taste-stat-card">
          <div className="taste-stat-num">{summary.totalSessions}</div>
          <div className="taste-stat-label">Sessions</div>
        </div>
        <div className="taste-stat-card">
          <div className="taste-stat-num">{summary.familiarSongs}</div>
          <div className="taste-stat-label">Songs you love</div>
        </div>
        <div className="taste-stat-card">
          <div className="taste-stat-num">{summary.searchedSongs}</div>
          <div className="taste-stat-label">Songs searched</div>
        </div>
      </div>

      <div className="taste-section">
        <div className="taste-section-title">Your moods</div>
        {sortedMoods.length > 0 ? (
          <div className="taste-mood-grid">
            {sortedMoods.map(function(m, i) {
              return (
                <div key={i} className="taste-mood-chip">
                  <span className="taste-mood-name">{moodLabels[m[0]] || m[0]}</span>
                  <span className="taste-mood-count">{m[1]}x</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="taste-empty">No moods yet. Start listening to build your profile.</p>
        )}
      </div>

      <div className="taste-section">
        <div className="taste-section-title">Songs that feel familiar</div>
        {topFamiliar.length > 0 ? (
          <div className="taste-songs-list">
            {topFamiliar.map(function(s, i) {
              return (
                <div key={i} className="taste-song-item">
                  <div className="taste-song-left">
                    <div className="taste-song-num">{i + 1}</div>
                    <div>
                      <div className="taste-song-title">{s.title}</div>
                      <div className="taste-song-artist">{s.artist} · {s.year}</div>
                    </div>
                  </div>
                  {s.count > 1 && (
                    <span className="taste-song-count">{s.count}x familiar</span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="taste-empty">Mark songs as familiar while listening to build this list.</p>
        )}
      </div>

      {unfamiliarsongs.length > 0 && (
        <div className="taste-section">
          <div className="taste-section-title">Not your taste</div>
          <div className="taste-songs-list">
            {unfamiliarsongs.slice(0, 5).map(function(s, i) {
              return (
                <div key={i} className="taste-song-item">
                  <div className="taste-song-left">
                    <div className="taste-song-num" style={{ color: "#aa5a5a" }}>{i + 1}</div>
                    <div>
                      <div className="taste-song-title">{s.title}</div>
                      <div className="taste-song-artist">{s.artist}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="taste-section">
        <div className="taste-section-title">Recently searched</div>
        {recentSearches.length > 0 ? (
          <div className="taste-search-list">
            {recentSearches.map(function(s, i) {
              return (
                <div key={i} className="taste-search-item">
                  <span className="taste-search-icon">&#9654;</span>
                  {s.title}{s.artist && s.artist !== "Search result" ? " - " + s.artist : ""}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="taste-empty">Search for songs to see them here.</p>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [memory, setMemory] = useState("");
  const [favorites, setFavorites] = useState("");
  const [songs, setSongs] = useState([]);
  const [feedback, setFeedback] = useState({});
  const [recs, setRecs] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [playerExpanded, setPlayerExpanded] = useState(false);
  const [activeSongIndex, setActiveSongIndex] = useState(null);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const suggestTimer = useRef(null);
  const songRefs = useRef({});

  useEffect(function() {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
          setShowDropdown(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClick);
    return function() { document.removeEventListener("mousedown", handleClick); };
  }, []);

  function playSong(videoId, title, artist, index) {
    setNowPlaying(null);
    if (index !== undefined) {
      setActiveSongIndex(index);
      setTimeout(function() {
        if (songRefs.current[index]) {
          songRefs.current[index].scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
    setTimeout(function() {
      setNowPlaying({ videoId, title, artist, index });
      setPlayerExpanded(true);
    }, 50);
  }

  function playNext() {
    if (activeSongIndex === null || songs.length === 0) return;
    var nextIndex = activeSongIndex + 1;
    if (nextIndex >= songs.length) return;
    var nextSong = songs[nextIndex];
    if (nextSong && nextSong.videoId) {
      playSong(nextSong.videoId, nextSong.title, nextSong.artist, nextIndex);
    }
  }

  function playPrevious() {
    if (activeSongIndex === null || activeSongIndex === 0) return;
    var prevIndex = activeSongIndex - 1;
    var prevSong = songs[prevIndex];
    if (prevSong && prevSong.videoId) {
      playSong(prevSong.videoId, prevSong.title, prevSong.artist, prevIndex);
    }
  }

  async function handleSearchInput(e) {
    const val = e.target.value;
    setSearchQuery(val);
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    if (val.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    suggestTimer.current = setTimeout(async function() {
      try {
        const results = await getSearchSuggestions(val);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      }
    }, 400);
  }

  async function handleSearch(query) {
    const q = query || searchQuery;
    if (!q.trim()) return;
    setSearchQuery(q);
    setShowDropdown(false);
    setSearchLoading(true);
    try {
      const videoId = await getYouTubeVideoId(q, "");
      if (videoId) {
        logSearchedSong(q, "");
        playSong(videoId, q, "Search result", undefined);
      }
    } catch (err) {
      console.error(err);
    }
    setSearchLoading(false);
  }

  async function handleMoodClick(mood) {
    setSelectedMoodId(mood.id);
    setPage("loading");
    setFeedback({});
    setRecs(null);
    setActiveSongIndex(null);
    try {
      const unfamiliar = getUnfamiliarForMood(mood.id);
      const filteredSongs = mood.songs.filter(function(s) {
        return !unfamiliar.includes(s.title + " by " + s.artist);
      });

      const shuffledSongs = filteredSongs.slice().sort(function() {
        return Math.random() - 0.5;
      });

      var songsToLoad = shuffledSongs;

      if (unfamiliar.length > 0) {
        try {
          const context = buildPersonalizationContext();
          const replacements = await generateMoreSongs(
            mood.memory,
            mood.artists,
            context,
            shuffledSongs
          );
          var combined = shuffledSongs.concat(replacements).slice(0, 10);
          songsToLoad = combined;
        } catch(e) {
          songsToLoad = shuffledSongs;
        }
      }

      const songsWithVideos = await Promise.all(
        songsToLoad.map(async function(song) {
          const videoId = await getYouTubeVideoId(song.title, song.artist);
          return {
            title: song.title,
            artist: song.artist,
            year: song.year || "",
            videoId,
            reasoning: song.reasoning || (song.artist + " - fits perfectly with this feeling.")
          };
        })
      );

      setSongs(songsWithVideos);
      logSession(mood.id, mood.memory, songsWithVideos);
      setPage("player");
    } catch (err) {
      console.error(err);
      setPage("home");
    }
  }

  async function handleSubmit() {
    if (!memory.trim()) return;
    setPage("loading");
    setFeedback({});
    setRecs(null);
    setActiveSongIndex(null);
    setSelectedMoodId(null);
    try {
      const context = buildPersonalizationContext();
      const artistsContext = favorites.trim() ? favorites : "any genre based on the emotional memory described";
      const suggestions = await getSongSuggestions(memory, artistsContext, context);
      const songsWithVideos = await Promise.all(
        suggestions.map(async function(song) {
          const videoId = await getYouTubeVideoId(song.title, song.artist);
          return { ...song, videoId };
        })
      );
      setSongs(songsWithVideos);
      logSession(null, memory, songsWithVideos);
      setPage("player");
    } catch (err) {
      console.error(err);
      setPage("home");
    }
  }

  async function handleGenerateMore() {
    setGeneratingMore(true);
    try {
      const context = buildPersonalizationContext();
      const artistsContext = favorites.trim() ? favorites : "any genre based on the emotional memory described";
      const moreSongs = await generateMoreSongs(memory, artistsContext, context, songs);
      const moreSongsWithVideos = await Promise.all(
        moreSongs.map(async function(song) {
          const videoId = await getYouTubeVideoId(song.title, song.artist);
          return { ...song, videoId };
        })
      );
      setSongs(function(prev) { return prev.concat(moreSongsWithVideos); });
    } catch (err) {
      console.error(err);
    }
    setGeneratingMore(false);
  }

  async function goToRecs() {
    setPage("recs");
    setLoadingRecs(true);
    try {
      const data = await getRecommendations(memory, favorites || "varied genres");
      setRecs(data);
    } catch (err) {
      console.error(err);
    }
    setLoadingRecs(false);
  }

  function handleStartOver() {
    setPage("home");
    setSongs([]);
    setFeedback({});
    setRecs(null);
    setSelectedMoodId(null);
    setMemory("");
    setFavorites("");
    setSearchQuery("");
    setNowPlaying(null);
    setActiveSongIndex(null);
    setPlayerExpanded(false);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied. Share it with someone who needs this.");
  }

  var miniPlayer = (
    <MiniPlayer
      nowPlaying={nowPlaying}
      expanded={playerExpanded}
      onExpand={function() { setPlayerExpanded(!playerExpanded); }}
      onEnded={activeSongIndex !== null && activeSongIndex < songs.length - 1 ? playNext : null}
      onPrevious={activeSongIndex !== null && activeSongIndex > 0 ? playPrevious : null}
    />
  );

  function renderMobileTopBar(title) {
    return (
      <div className="mobile-top-bar">
        <button className="hamburger" onClick={function() { setSidebarOpen(!sidebarOpen); }}>
          <span /><span /><span />
        </button>
        <span className="mobile-top-bar-brand">{title}</span>
        <div style={{ width: "38px" }} />
      </div>
    );
  }

  function renderSongList() {
    return (
      <div className="songs-list">
        {songs.map(function(s, index) {
          var isActive = activeSongIndex === index;
          return (
            <div
              className="song-list-item"
              key={index}
              ref={function(el) { songRefs.current[index] = el; }}
              style={{
                border: isActive ? "1.5px solid #4f8ef7" : "1.5px solid transparent",
                borderRadius: "12px",
                transition: "border 0.3s"
              }}
            >
              <div className="song-list-header">
                <div
                  className="song-number-badge"
                  style={{ cursor: "pointer", background: isActive ? "#4f8ef7" : "#282828" }}
                  onClick={function() {
                    if (s.videoId) playSong(s.videoId, s.title, s.artist, index);
                  }}
                >
                  {isActive ? "▶" : index + 1}
                </div>
                <div className="song-info">
                  <div className="song-title">{s.title}</div>
                  <div className="song-meta">
                    {s.artist}
                    <span className="song-year-badge">{s.year}</span>
                  </div>
                </div>
              </div>

              {s.reasoning && (
                <p className="song-reasoning">{s.reasoning}</p>
              )}

              {s.videoId ? (
                <div
                  className="song-play-placeholder"
                  style={{
                    background: isActive ? "#1a2a4a" : undefined,
                    borderColor: isActive ? "#4f8ef7" : undefined
                  }}
                  onClick={function() { playSong(s.videoId, s.title, s.artist, index); }}
                >
                  <span>{isActive ? "▶ Now playing in mini player" : "▶ Click to play"}</span>
                </div>
              ) : (
                <div
                  className="song-play-placeholder"
                  style={{ color: "#4f8ef7" }}
                  onClick={function() {
                    window.open("https://www.youtube.com/results?search_query=" + encodeURIComponent(s.title), "_blank");
                  }}
                >
                  <span>Search on YouTube</span>
                </div>
              )}

              <div className="feedback-row">
                <button
                  className={"feedback-btn up" + (feedback[index] === "up" ? " active" : "")}
                  onClick={function() {
                    setFeedback(function(prev) { return { ...prev, [index]: "up" }; });
                    logFamiliarSong(s.title, s.artist, s.year, selectedMoodId);
                  }}
                >
                  Feels familiar
                </button>
                <button
                  className={"feedback-btn down" + (feedback[index] === "down" ? " active" : "")}
                  onClick={function() {
                    setFeedback(function(prev) { return { ...prev, [index]: "down" }; });
                    logUnfamiliarSong(s.title, s.artist, s.year, selectedMoodId);
                  }}
                >
                  Not quite
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (page === "loading") {
    return (
      <>
        <div className="app-layout">
          <Sidebar page={page} setPage={setPage} isOpen={sidebarOpen} onClose={function() { setSidebarOpen(false); }} />
          <div className="main-content">
            {renderMobileTopBar("Rewind")}
            <div className="loading-page">
              <h2 className="loading-headline">Reaching back into memory...</h2>
              <p className="loading-sub">Finding music that already knows you</p>
              <div className="loading-bar-wrapper">
                <div className="loading-bar" />
              </div>
            </div>
          </div>
        </div>
        {miniPlayer}
      </>
    );
  }

  if (page === "player") {
    var activeMoodForPlayer = MOOD_PRESETS.find(function(m) { return m.id === selectedMoodId; });
    return (
      <>
        <div className="app-layout">
          <Sidebar page={page} setPage={setPage} isOpen={sidebarOpen} onClose={function() { setSidebarOpen(false); }} />
          <div className="main-content">
            {renderMobileTopBar(activeMoodForPlayer ? activeMoodForPlayer.title : "Your songs")}
            <div className="player-page">
              <div className="player-nav">
                <div>
                  <span className="player-title">
                    {activeMoodForPlayer ? activeMoodForPlayer.title : "Your songs"}
                  </span>
                  <div style={{ fontSize: "13px", color: "#b3b3b3", marginTop: "4px" }}>
                    {songs.length} songs
                  </div>
                </div>
                <button className="back-btn" onClick={function() { setPage("home"); }}>Back</button>
              </div>

              {renderSongList()}

              <button
                className="generate-more-btn"
                onClick={handleGenerateMore}
                disabled={generatingMore}
              >
                {generatingMore ? "Finding more songs for you..." : "Generate more for me"}
              </button>

              <div className="player-footer">
                <button className="nav-btn next" onClick={goToRecs}>
                  See recommendations
                </button>
              </div>
            </div>
          </div>
        </div>
        {miniPlayer}
      </>
    );
  }

  if (page === "recs") {
    return (
      <>
        <div className="app-layout">
          <Sidebar page={page} setPage={setPage} isOpen={sidebarOpen} onClose={function() { setSidebarOpen(false); }} />
          <div className="main-content">
            {renderMobileTopBar("You may also like")}
            <div className="recs-page">
              <div className="recs-nav">
                <span className="player-title">You may also like</span>
                <button className="back-btn" onClick={function() { setPage("player"); }}>Back to songs</button>
              </div>

              <div className="recs-hero">
                <p className="recs-tag">Based on your taste</p>
                <h2 className="recs-headline">Artists and albums from the same world</h2>
                <p className="recs-sub">Music that lives in the same emotional space as what you just listened to.</p>
              </div>

              {loadingRecs && <p className="loading-recs">Finding similar artists and albums...</p>}

              {recs && (
                <div>
                  <div className="recs-section">
                    <h3 className="recs-section-title">Similar Artists</h3>
                    <div className="recs-grid">
                      {recs.artists.map(function(artist, i) {
                        var url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(artist.name);
                        return (
                          <a key={i} className="rec-card" href={url} target="_blank" rel="noopener noreferrer">
                            <div className="rec-icon">&#9834;</div>
                            <div className="rec-name">{artist.name}</div>
                            <div className="rec-desc">{artist.description}</div>
                            <span className="rec-link">Search on YouTube</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <div className="recs-section">
                    <h3 className="recs-section-title">Similar Albums</h3>
                    <div className="recs-grid">
                      {recs.albums.map(function(album, i) {
                        var url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(album.title + " " + album.artist + " full album");
                        return (
                          <a key={i} className="rec-card" href={url} target="_blank" rel="noopener noreferrer">
                            <div className="rec-icon">&#9733;</div>
                            <div className="rec-name">{album.title}</div>
                            <div className="rec-artist">{album.artist} · {album.year}</div>
                            <div className="rec-desc">{album.description}</div>
                            <span className="rec-link">Listen on YouTube</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="start-over-section">
                <p className="start-over-label">Want to explore a different memory?</p>
                <button className="start-over-btn" onClick={handleStartOver}>Start over</button>
                <div className="share-row">
                  <button className="share-btn" onClick={handleShare}>Share Rewind</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {miniPlayer}
      </>
    );
  }

  if (page === "taste") {
    return (
      <>
        <div className="app-layout">
          <Sidebar page={page} setPage={setPage} isOpen={sidebarOpen} onClose={function() { setSidebarOpen(false); }} />
          <div className="main-content">
            {renderMobileTopBar("My Taste")}
            <MyTastePage />
          </div>
        </div>
        {miniPlayer}
      </>
    );
  }

  return (
    <>
      <div className="app-layout">
        <Sidebar page={page} setPage={setPage} isOpen={sidebarOpen} onClose={function() { setSidebarOpen(false); }} />
        <div className="main-content">
          {renderMobileTopBar("Rewind")}

          <div className="top-bar">
            <div>
              <div className="top-bar-title">Good evening</div>
              <div className="top-bar-sub">Pick a mood or describe your own</div>
            </div>
            <div className="search-wrapper" ref={searchRef}>
              <form onSubmit={function(e) { e.preventDefault(); handleSearch(); }} className="search-form">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search a song or artist..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={function() { if (suggestions.length > 0) setShowDropdown(true); }}
                  autoComplete="off"
                />
                <button type="submit" className="search-submit" disabled={searchLoading}>
                  {searchLoading ? "..." : "Play"}
                </button>
              </form>
              {showDropdown && suggestions.length > 0 && (
                <div className="search-dropdown">
                  {suggestions.map(function(s, i) {
                    return (
                      <div key={i} className="search-dropdown-item" onClick={function() { handleSearch(s); }}>
                        {s}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mobile-search-section">
            <div ref={mobileSearchRef} style={{ position: "relative" }}>
              <form onSubmit={function(e) { e.preventDefault(); handleSearch(); }} className="search-form">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search a song or artist..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onFocus={function() { if (suggestions.length > 0) setShowDropdown(true); }}
                  autoComplete="off"
                />
                <button type="submit" className="search-submit" disabled={searchLoading}>
                  {searchLoading ? "..." : "Play"}
                </button>
              </form>
              {showDropdown && suggestions.length > 0 && (
                <div className="search-dropdown">
                  {suggestions.map(function(s, i) {
                    return (
                      <div key={i} className="search-dropdown-item" onClick={function() { handleSearch(s); }}>
                        {s}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="home-columns">
            <div className="form-panel">
              <div>
                <div className="form-section-title">Your memory</div>
                <div className="form-section-sub">Describe a feeling or memory for personalized suggestions.</div>
              </div>

              <div className="field-group">
                <label className="field-label">A memory or feeling</label>
                <textarea
                  value={memory}
                  onChange={function(e) { setMemory(e.target.value); }}
                  placeholder="Walking alone at night, stressed, wanting something that makes me feel like I belong..."
                  rows={4}
                />
              </div>

              <div className="field-group">
                <label className="field-label">
                  Artists or songs you love
                  <span style={{ color: "#555", fontSize: "10px", marginLeft: "8px", fontWeight: "400", letterSpacing: "0" }}>optional</span>
                </label>
                <textarea
                  value={favorites}
                  onChange={function(e) { setFavorites(e.target.value); }}
                  placeholder="Kirk Franklin, Donnie McClurkin, Tasha Cobbs..."
                  rows={3}
                />
              </div>

              <button
                className="rewind-btn"
                onClick={handleSubmit}
                disabled={!memory.trim()}
              >
                Rewind
              </button>
            </div>

            <div className="mood-panel">
              <p className="mood-panel-title">How are you feeling?</p>
              <div className="mood-grid">
                {MOOD_PRESETS.map(function(mood) {
                  return (
                    <div
                      key={mood.id}
                      className="mood-card"
                      onClick={function() { handleMoodClick(mood); }}
                    >
                      <img className="mood-card-img" src={mood.image} alt={mood.title} />
                      <div className="mood-card-overlay">
                        <div className="mood-card-title">{mood.title}</div>
                        <div className="mood-card-subtitle">{mood.subtitle}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      {miniPlayer}
    </>
  );
}