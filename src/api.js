const CLAUDE_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

export const MOOD_PRESETS = [
  {
    id: "missing-home",
    title: "Missing home",
    subtitle: "Gospel & Soul",
    image: "https://picsum.photos/seed/missinghome/400/250",
    memory: "Far from home, missing the familiar sounds and comfort of the people and places I grew up with.",
    artists: "Kirk Franklin, Donnie McClurkin, Tasha Cobbs, Marvin Sapp, CeCe Winans, Fred Hammond, Yolanda Adams, Richard Smallwood, Andrae Crouch, Walter Hawkins",
    songs: [
      { title: "Smile", artist: "Kirk Franklin", year: "2011" },
      { title: "Stand", artist: "Donnie McClurkin", year: "1996" },
      { title: "Break Every Chain", artist: "Tasha Cobbs", year: "2013" },
      { title: "Never Would Have Made It", artist: "Marvin Sapp", year: "2007" },
      { title: "Alabaster Box", artist: "CeCe Winans", year: "1999" },
      { title: "I Need You Now", artist: "Smokie Norful", year: "2003" },
      { title: "The Battle Is the Lord's", artist: "Yolanda Adams", year: "1999" },
      { title: "Total Praise", artist: "Richard Smallwood", year: "1996" },
      { title: "Take Me Back", artist: "Andrae Crouch", year: "1975" },
      { title: "Marvelous", artist: "Walter Hawkins", year: "1978" }
    ]
  },
  {
    id: "late-night",
    title: "Late night drive",
    subtitle: "R&B & Soul",
    image: "https://picsum.photos/seed/nightdrive/400/250",
    memory: "Driving alone late at night, city lights passing by, feeling reflective and at peace with the world.",
    artists: "Luther Vandross, Anita Baker, Sade, Brian McKnight, Maxwell, Babyface, Boyz II Men, Dru Hill, Joe, Musiq Soulchild",
    songs: [
      { title: "Here and Now", artist: "Luther Vandross", year: "1990" },
      { title: "Sweet Love", artist: "Anita Baker", year: "1986" },
      { title: "No Ordinary Love", artist: "Sade", year: "1992" },
      { title: "One Last Cry", artist: "Brian McKnight", year: "1993" },
      { title: "Fortunate", artist: "Maxwell", year: "1999" },
      { title: "Every Time I Close My Eyes", artist: "Babyface", year: "1996" },
      { title: "End of the Road", artist: "Boyz II Men", year: "1992" },
      { title: "In My Bed", artist: "Dru Hill", year: "1996" },
      { title: "All That I Am", artist: "Joe", year: "1997" },
      { title: "Just Friends", artist: "Musiq Soulchild", year: "2000" }
    ]
  },
  {
    id: "stressed",
    title: "Stressed and overwhelmed",
    subtitle: "Worship & Gospel",
    image: "https://picsum.photos/seed/oceanwaves/400/250",
    memory: "Feeling the weight of everything at once, needing something that lifts me up and reminds me I can get through this.",
    artists: "Israel Houghton, William McDowell, Bethel Music, Hillsong United, Maverick City Music, Travis Greene, Jonathan McReynolds, Todd Dulaney, Chandler Moore, Naomi Raine",
    songs: [
      { title: "You Are My Strength", artist: "Israel Houghton", year: "2004" },
      { title: "I Won't Go Back", artist: "William McDowell", year: "2012" },
      { title: "Goodness of God", artist: "Bethel Music", year: "2019" },
      { title: "Oceans", artist: "Hillsong United", year: "2013" },
      { title: "Promises", artist: "Maverick City Music", year: "2021" },
      { title: "Intentional", artist: "Travis Greene", year: "2016" },
      { title: "Maintain", artist: "Jonathan McReynolds", year: "2016" },
      { title: "Victory Belongs to Jesus", artist: "Todd Dulaney", year: "2016" },
      { title: "Jireh", artist: "Chandler Moore", year: "2021" },
      { title: "Remember Me", artist: "Naomi Raine", year: "2021" }
    ]
  },
  {
    id: "college",
    title: "Nostalgic for college",
    subtitle: "2000s Pop & R&B",
    image: "https://picsum.photos/seed/collegedays/400/250",
    memory: "Thinking back to college, the freedom, the friendships, the music that played in the background of some of the best years of my life.",
    artists: "Usher, Alicia Keys, Beyonce, Chris Brown, Ne-Yo, Mary J Blige, John Legend, Rihanna, T-Pain, Kanye West",
    songs: [
      { title: "Yeah!", artist: "Usher", year: "2004" },
      { title: "No One", artist: "Alicia Keys", year: "2007" },
      { title: "Crazy in Love", artist: "Beyonce", year: "2003" },
      { title: "With You", artist: "Chris Brown", year: "2007" },
      { title: "So Sick", artist: "Ne-Yo", year: "2006" },
      { title: "Be Without You", artist: "Mary J Blige", year: "2005" },
      { title: "Ordinary People", artist: "John Legend", year: "2004" },
      { title: "Umbrella", artist: "Rihanna", year: "2007" },
      { title: "Buy U a Drank", artist: "T-Pain", year: "2007" },
      { title: "Gold Digger", artist: "Kanye West", year: "2005" }
    ]
  },
  {
    id: "calm",
    title: "Need to feel calm",
    subtitle: "Indie & Acoustic",
    image: "https://picsum.photos/seed/calmforest/400/250",
    memory: "Everything feels too loud and too fast. I need something soft and slow that brings me back to myself.",
    artists: "Enya, Norah Jones, Jack Johnson, Jason Mraz, John Mayer, Colbie Caillat, Ingrid Michaelson, Sara Bareilles, Adele, Ed Sheeran",
    songs: [
      { title: "Only Time", artist: "Enya", year: "2000" },
      { title: "Come Away With Me", artist: "Norah Jones", year: "2002" },
      { title: "Better Together", artist: "Jack Johnson", year: "2005" },
      { title: "I'm Yours", artist: "Jason Mraz", year: "2008" },
      { title: "Gravity", artist: "John Mayer", year: "2003" },
      { title: "Bubbly", artist: "Colbie Caillat", year: "2007" },
      { title: "The Way I Am", artist: "Ingrid Michaelson", year: "2006" },
      { title: "Gravity", artist: "Sara Bareilles", year: "2007" },
      { title: "Someone Like You", artist: "Adele", year: "2011" },
      { title: "The A Team", artist: "Ed Sheeran", year: "2011" }
    ]
  },
  {
    id: "far",
    title: "Far from loved ones",
    subtitle: "Folk & Indie",
    image: "https://picsum.photos/seed/mountain/400/250",
    memory: "Miles away from the people who matter most, missing connection and warmth, wanting music that feels like a long hug.",
    artists: "Passenger, Damien Rice, Bon Iver, Iron and Wine, The Lumineers, Mumford and Sons, Fleet Foxes, Gregory Alan Isakov, City and Colour, Noah Kahan",
    songs: [
      { title: "Let Her Go", artist: "Passenger", year: "2012" },
      { title: "The Blower's Daughter", artist: "Damien Rice", year: "2002" },
      { title: "Skinny Love", artist: "Bon Iver", year: "2008" },
      { title: "Flightless Bird", artist: "Iron and Wine", year: "2004" },
      { title: "Ho Hey", artist: "The Lumineers", year: "2012" },
      { title: "The Cave", artist: "Mumford and Sons", year: "2009" },
      { title: "White Winter Hymnal", artist: "Fleet Foxes", year: "2008" },
      { title: "The Universe", artist: "Gregory Alan Isakov", year: "2009" },
      { title: "Sleeping Sickness", artist: "City and Colour", year: "2008" },
      { title: "Stick Season", artist: "Noah Kahan", year: "2022" }
    ]
  },
  {
    id: "homesick",
    title: "Homesick and alone",
    subtitle: "Indie Pop",
    image: "https://picsum.photos/seed/solotraveler/400/250",
    memory: "In a new place, surrounded by strangers, missing the sounds and warmth of home more than words can say.",
    artists: "James Bay, Sam Smith, Lewis Capaldi, Tom Odell, Dermot Kennedy, Hozier, JP Cooper, Tom Walker, James Arthur, George Ezra",
    songs: [
      { title: "Hold Back the River", artist: "James Bay", year: "2014" },
      { title: "Stay With Me", artist: "Sam Smith", year: "2014" },
      { title: "Someone You Loved", artist: "Lewis Capaldi", year: "2018" },
      { title: "Another Love", artist: "Tom Odell", year: "2013" },
      { title: "Giants", artist: "Dermot Kennedy", year: "2019" },
      { title: "Take Me to Church", artist: "Hozier", year: "2013" },
      { title: "September Song", artist: "JP Cooper", year: "2017" },
      { title: "Leave a Light On", artist: "Tom Walker", year: "2017" },
      { title: "Say You Won't Let Go", artist: "James Arthur", year: "2016" },
      { title: "Barcelona", artist: "George Ezra", year: "2014" }
    ]
  },
  {
    id: "remembering",
    title: "Remembering someone",
    subtitle: "Classics & Soul",
    image: "https://picsum.photos/seed/vintage/400/250",
    memory: "Thinking of someone I love, grateful for the memories, wanting music that honors what they meant to me.",
    artists: "Whitney Houston, Celine Dion, Mariah Carey, Michael Jackson, Stevie Wonder, Diana Ross, Lionel Richie, Nat King Cole, Ella Fitzgerald, Billie Holiday",
    songs: [
      { title: "I Will Always Love You", artist: "Whitney Houston", year: "1992" },
      { title: "My Heart Will Go On", artist: "Celine Dion", year: "1997" },
      { title: "Hero", artist: "Mariah Carey", year: "1993" },
      { title: "Man in the Mirror", artist: "Michael Jackson", year: "1988" },
      { title: "Isn't She Lovely", artist: "Stevie Wonder", year: "1976" },
      { title: "Endless Love", artist: "Diana Ross", year: "1981" },
      { title: "Hello", artist: "Lionel Richie", year: "1984" },
      { title: "Unforgettable", artist: "Nat King Cole", year: "1951" },
      { title: "Somewhere Over the Rainbow", artist: "Ella Fitzgerald", year: "1960" },
      { title: "The Very Thought of You", artist: "Billie Holiday", year: "1938" }
    ]
  },
  {
    id: "surprise",
    title: "Something different tonight",
    subtitle: "Surprise me",
    image: "https://picsum.photos/seed/surprise2026/400/250",
    memory: "I want to be surprised tonight. No patterns, no expectations. Just music I would never have chosen myself but might end up loving.",
    artists: "Random mix across all genres and eras",
    songs: [
      { title: "Mr. Brightside", artist: "The Killers", year: "2003" },
      { title: "Bohemian Rhapsody", artist: "Queen", year: "1975" },
      { title: "Blinding Lights", artist: "The Weeknd", year: "2019" },
      { title: "Africa", artist: "Toto", year: "1982" },
      { title: "Lose Yourself", artist: "Eminem", year: "2002" },
      { title: "Dancing Queen", artist: "ABBA", year: "1976" },
      { title: "Hotel California", artist: "Eagles", year: "1977" },
      { title: "Shake It Off", artist: "Taylor Swift", year: "2014" },
      { title: "Smells Like Teen Spirit", artist: "Nirvana", year: "1991" },
      { title: "Hey Jude", artist: "The Beatles", year: "1968" }
    ]
  }
];

export const SIDEBAR_PLAYLISTS = [
  { id: 1, title: "Evening Worship", meta: "Playlist", color: "#1a3a6e" },
  { id: 2, title: "Midnight R&B", meta: "Playlist", color: "#3a1a4e" },
  { id: 3, title: "Sunday Morning", meta: "Playlist", color: "#1a4e2a" },
  { id: 4, title: "2000s Throwback", meta: "Playlist", color: "#4e3a1a" },
  { id: 5, title: "Late Night Drives", meta: "Playlist", color: "#4e1a1a" },
  { id: 6, title: "Soul Classics", meta: "Playlist", color: "#1a4e4e" },
  { id: 7, title: "Acoustic Sunday", meta: "Playlist", color: "#2a1a4e" },
  { id: 8, title: "Gospel Greats", meta: "Playlist", color: "#1a2a3e" },
];

export async function getSongSuggestions(memory, favorites, personalizationContext) {
  var personalNote = personalizationContext
    ? "\n\nIMPORTANT — here is what you know about this user from their listening history:\n" + personalizationContext + "\nUse this to make suggestions feel more personal and tailored to their proven taste."
    : "";

  const prompt = "You are a music memory specialist. Your job is NOT to suggest new music. Your job is to help people rediscover music they already love but have forgotten.\n\nThe user has described this memory or feeling:\n\"" + memory + "\"\n\nThese are songs or artists they already know and love:\n\"" + favorites + "\"" + personalNote + "\n\nSuggest exactly 10 songs that come from the same era and genre as their favorites, match the emotional tone of their memory, are highly likely to already be familiar to them.\n\nReturn ONLY a JSON array:\n[\n  {\n    \"title\": \"song title\",\n    \"artist\": \"artist name\",\n    \"year\": \"approximate year\",\n    \"reasoning\": \"one sentence why this fits\"\n  }\n]\n\nOnly JSON. No text before or after.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function generateMoreSongs(memory, artists, personalizationContext, existingSongs) {
  var existingTitles = existingSongs.map(function(s) { return s.title + " by " + s.artist; }).join(", ");
  var personalNote = personalizationContext
    ? "\n\nUser listening history:\n" + personalizationContext
    : "";

  const prompt = "You are a music memory specialist helping a user discover more songs they already love.\n\nTheir memory or feeling:\n\"" + memory + "\"\n\nTheir favorite artists:\n\"" + artists + "\"" + personalNote + "\n\nThey have already seen these songs, do NOT repeat them:\n" + existingTitles + "\n\nSuggest 10 MORE songs that fit their taste and memory but are different from what they have already seen. Prioritize songs the user is likely to already know and love.\n\nReturn ONLY a JSON array:\n[\n  {\n    \"title\": \"song title\",\n    \"artist\": \"artist name\",\n    \"year\": \"approximate year\",\n    \"reasoning\": \"one sentence why this fits\"\n  }\n]\n\nOnly JSON. No text before or after.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function getRecommendations(memory, favorites) {
  const prompt = "Based on this emotional memory: \"" + memory + "\"\nAnd these favorite artists: \"" + favorites + "\"\n\nSuggest 4 similar artists and 4 similar albums.\n\nReturn ONLY this JSON:\n{\n  \"artists\": [\n    { \"name\": \"Artist Name\", \"description\": \"one sentence\" }\n  ],\n  \"albums\": [\n    { \"title\": \"Album Title\", \"artist\": \"Artist Name\", \"year\": \"year\", \"description\": \"one sentence\" }\n  ]\n}\n\nOnly JSON. No text before or after.";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export async function getSearchSuggestions(query) {
  const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + encodeURIComponent(query) + "&type=video&maxResults=5&key=" + YOUTUBE_API_KEY;
  const response = await fetch(url);
  const data = await response.json();
  if (data.items) {
    return data.items.map(function(item) {
      return item.snippet.title;
    });
  }
  return [];
}

export async function getYouTubeVideoId(title, artist) {
  const queries = [
    title + " " + artist + " official",
    title + " " + artist + " lyrics",
    title + " " + artist + " audio"
  ];

  for (var i = 0; i < queries.length; i++) {
    try {
      const query = encodeURIComponent(queries[i]);
      const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + query + "&type=video&maxResults=1&key=" + YOUTUBE_API_KEY;
      const response = await fetch(url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].id.videoId;
      }
    } catch (err) {
      console.error(err);
    }
  }
  return null;
}