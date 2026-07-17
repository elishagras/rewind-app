const JOURNAL_KEY = "rewind_journal";

function getJournal() {
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    return data ? JSON.parse(data) : {
      sessions: [],
      familiarsongs: [],
      unfamiliarsongs: [],
      searchedSongs: [],
      moodsChosen: {}
    };
  } catch (e) {
    return {
      sessions: [],
      familiarsongs: [],
      unfamiliarsongs: [],
      searchedSongs: [],
      moodsChosen: {}
    };
  }
}

function saveJournal(journal) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(journal));
}

export function logSession(mood, memory, songs) {
  const journal = getJournal();
  journal.sessions.push({
    date: new Date().toISOString(),
    mood: mood,
    memory: memory,
    songs: songs.map(function(s) { return s.title + " by " + s.artist; })
  });
  if (mood) {
    journal.moodsChosen[mood] = (journal.moodsChosen[mood] || 0) + 1;
  }
  if (journal.sessions.length > 50) {
    journal.sessions = journal.sessions.slice(-50);
  }
  saveJournal(journal);
}

export function logFamiliarSong(title, artist, year, mood) {
  const journal = getJournal();
  if (!journal.familiarsongs) journal.familiarsongs = [];
  const existing = journal.familiarsongs.find(function(s) {
    return s.title === title && s.artist === artist;
  });
  if (existing) {
    existing.count = (existing.count || 1) + 1;
  } else {
    journal.familiarsongs.push({
      title: title,
      artist: artist,
      year: year,
      mood: mood,
      count: 1,
      date: new Date().toISOString()
    });
  }
  saveJournal(journal);
}

export function logUnfamiliarSong(title, artist, year, mood) {
  const journal = getJournal();
  if (!journal.unfamiliarsongs) journal.unfamiliarsongs = [];
  const existing = journal.unfamiliarsongs.find(function(s) {
    return s.title === title && s.artist === artist;
  });
  if (existing) {
    existing.count = (existing.count || 1) + 1;
  } else {
    journal.unfamiliarsongs.push({
      title: title,
      artist: artist,
      year: year,
      mood: mood,
      count: 1,
      date: new Date().toISOString()
    });
  }
  if (journal.unfamiliarsongs.length > 100) {
    journal.unfamiliarsongs = journal.unfamiliarsongs.slice(-100);
  }
  saveJournal(journal);
}

export function logSearchedSong(title, artist) {
  const journal = getJournal();
  if (!journal.searchedSongs) journal.searchedSongs = [];
  journal.searchedSongs.push({
    title: title,
    artist: artist,
    date: new Date().toISOString()
  });
  if (journal.searchedSongs.length > 100) {
    journal.searchedSongs = journal.searchedSongs.slice(-100);
  }
  saveJournal(journal);
}

export function buildPersonalizationContext() {
  const journal = getJournal();
  if (journal.sessions.length === 0) return "";

  var topMoods = Object.entries(journal.moodsChosen)
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 3)
    .map(function(m) { return m[0]; });

  var topFamiliar = (journal.familiarsongs || [])
    .sort(function(a, b) { return (b.count || 1) - (a.count || 1); })
    .slice(0, 10)
    .map(function(s) { return s.title + " by " + s.artist; });

  var topUnfamiliar = (journal.unfamiliarsongs || [])
    .sort(function(a, b) { return (b.count || 1) - (a.count || 1); })
    .slice(0, 10)
    .map(function(s) { return s.title + " by " + s.artist; });

  var recentSearches = (journal.searchedSongs || [])
    .slice(-10)
    .map(function(s) { return s.title + " by " + s.artist; });

  var recentMemories = journal.sessions
    .slice(-5)
    .map(function(s) { return s.memory; })
    .filter(Boolean);

  var context = "";

  if (topMoods.length > 0) {
    context += "This user most frequently chooses these moods: " + topMoods.join(", ") + ". ";
  }
  if (topFamiliar.length > 0) {
    context += "Songs they have marked as familiar and loved: " + topFamiliar.join(", ") + ". ";
  }
  if (topUnfamiliar.length > 0) {
    context += "Songs they marked as NOT their taste — avoid suggesting similar artists or styles: " + topUnfamiliar.join(", ") + ". ";
  }
  if (recentSearches.length > 0) {
    context += "Songs they have recently searched for: " + recentSearches.join(", ") + ". ";
  }
  if (recentMemories.length > 0) {
    context += "Recent emotional memories they have described: " + recentMemories.join(" | ") + ". ";
  }

  return context;
}

export function getJournalSummary() {
  const journal = getJournal();
  return {
    totalSessions: journal.sessions.length,
    familiarSongs: (journal.familiarsongs || []).length,
    unfamiliarSongs: (journal.unfamiliarsongs || []).length,
    searchedSongs: (journal.searchedSongs || []).length,
    topMood: Object.entries(journal.moodsChosen).sort(function(a, b) { return b[1] - a[1]; })[0] || null
  };
}

export function getUnfamiliarForMood(moodId) {
  const journal = getJournal();
  return (journal.unfamiliarsongs || [])
    .filter(function(s) { return s.mood === moodId; })
    .map(function(s) { return s.title + " by " + s.artist; });
}