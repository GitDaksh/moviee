const movies = [

/* ==================== SCI-FI ==================== */

{
title: "Interstellar",
mood: "thoughtful",
genre: "sci-fi",
year: 2014,
poster: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
description: "A team travels through a wormhole in space."
},

{
title: "Inception",
mood: "thoughtful",
genre: "sci-fi",
year: 2010,
poster: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
description: "Dreams inside dreams."
},

{
title: "The Matrix",
mood: "thoughtful",
genre: "sci-fi",
year: 1999,
poster: "https://image.tmdb.org/t/p/w500/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg",
description: "Reality is a simulation."
},

{
title: "Blade Runner 2049",
mood: "thoughtful",
genre: "sci-fi",
year: 2017,
poster: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
description: "Futuristic mystery."
},

{
title: "Arrival",
mood: "thoughtful",
genre: "sci-fi",
year: 2016,
poster: "https://image.tmdb.org/t/p/w500/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg",
description: "Aliens arrive."
},

{
title: "Dune",
mood: "thoughtful",
genre: "sci-fi",
year: 2021,
poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
description: "Desert planet saga."
},

{
title: "Dune Part Two",
mood: "motivational",
genre: "sci-fi",
year: 2024,
poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
description: "Epic continuation."
},

{
title: "Tenet",
mood: "thoughtful",
genre: "sci-fi",
year: 2020,
poster: "https://image.tmdb.org/t/p/w500/k68nPLbIST6NP96JmTxmZijEvCA.jpg",
description: "Time inversion thriller."
},

{
title: "Annihilation",
mood: "thoughtful",
genre: "sci-fi",
year: 2018,
poster: "https://image.tmdb.org/t/p/w500/4YRplSk6BhH6PRuE9gfyw9byUJ6.jpg",
description: "Sci-fi mystery."
},

/* ==================== DRAMA ==================== */

{
title: "Good Will Hunting",
mood: "motivational",
genre: "drama",
year: 1997,
poster: "https://image.tmdb.org/t/p/w500/z2FnLKpFi1HPO7BEJxdkv6hpJSU.jpg",
description: "A genius janitor."
},

{
title: "The Shawshank Redemption",
mood: "motivational",
genre: "drama",
year: 1994,
poster: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
description: "Hope and friendship."
},

{
title: "Forrest Gump",
mood: "happy",
genre: "drama",
year: 1994,
poster: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
description: "Life journey."
},

{
title: "Whiplash",
mood: "motivational",
genre: "drama",
year: 2014,
poster: "https://image.tmdb.org/t/p/w500/7fn624j5lj3xTme2SgiLCeuedmO.jpg",
description: "Drummer pushed to greatness."
},

{
title: "The Social Network",
mood: "motivational",
genre: "drama",
year: 2010,
poster: "https://image.tmdb.org/t/p/w500/n0ybibhJtQ5icDqTp8eRytcIHJx.jpg",
description: "Facebook story."
},

{
title: "The Pursuit of Happyness",
mood: "motivational",
genre: "drama",
year: 2006,
poster: "https://image.tmdb.org/t/p/w500/oyG9TL7FcRP4EZ9Vid6uKzwdndz.jpg",
description: "Struggling salesman."
},

{
title: "A Beautiful Mind",
mood: "motivational",
genre: "drama",
year: 2001,
poster: "https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg",
description: "Math genius story."
},

{
title: "The Green Mile",
mood: "sad",
genre: "drama",
year: 1999,
poster: "https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
description: "Prison story."
},

{
title: "The Pianist",
mood: "sad",
genre: "drama",
year: 2002,
poster: "https://image.tmdb.org/t/p/w500/2hFvxCCWrTmCYwfy7yum0GKRi3Y.jpg",
description: "War survival."
},

{
title: "Her",
mood: "sad",
genre: "romance",
year: 2013,
poster: "https://image.tmdb.org/t/p/w500/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg",
description: "AI love story."
},

/* ==================== CRIME ==================== */

{
title: "The Godfather",
mood: "thoughtful",
genre: "crime",
year: 1972,
poster: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
description: "Mafia classic."
},

{
title: "The Godfather Part II",
mood: "thoughtful",
genre: "crime",
year: 1974,
poster: "https://image.tmdb.org/t/p/w500/amvmeQWheahG3StKwIE1f7jRnkZ.jpg",
description: "Mafia sequel."
},

{
title: "Pulp Fiction",
mood: "thoughtful",
genre: "crime",
year: 1994,
poster: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
description: "Crime anthology."
},

{
title: "Se7en",
mood: "sad",
genre: "crime",
year: 1995,
poster: "https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg",
description: "Serial killer mystery."
},

{
title: "Prisoners",
mood: "sad",
genre: "thriller",
year: 2013,
poster: "https://image.tmdb.org/t/p/w500/uhviyknTT5cEQXbn6vWIqfM4vGm.jpg",
description: "Kidnapping mystery."
},

{
title: "Shutter Island",
mood: "thoughtful",
genre: "thriller",
year: 2010,
poster: "https://image.tmdb.org/t/p/w500/kve20tXwUZpu4GUX8l6X7Z4jmL6.jpg",
description: "Psychological mystery."
},

/* ==================== ACTION ==================== */

{
title: "The Dark Knight",
mood: "thoughtful",
genre: "action",
year: 2008,
poster: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
description: "Batman faces Joker."
},

{
title: "Gladiator",
mood: "motivational",
genre: "action",
year: 2000,
poster: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
description: "Roman revenge story."
},

{
title: "Mad Max Fury Road",
mood: "motivational",
genre: "action",
year: 2015,
poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg",
description: "High speed action."
},

/* ==================== MORE GREAT MOVIES ==================== */

{
title: "The Grand Budapest Hotel",
mood: "happy",
genre: "comedy",
year: 2014,
poster: "https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg",
description: "Stylish comedy."
},

{
title: "The Wolf of Wall Street",
mood: "happy",
genre: "drama",
year: 2013,
poster: "https://image.tmdb.org/t/p/w500/pWHf4khOloNVfCxscsXFj3jj6gP.jpg",
description: "Stock market madness."
},

{
title: "Parasite",
mood: "thoughtful",
genre: "drama",
year: 2019,
poster: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
description: "Class divide thriller."
},

{
title: "Oppenheimer",
mood: "thoughtful",
genre: "drama",
year: 2023,
poster: "https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg",
description: "Atomic bomb story."
},

{
title: "Joker",
mood: "sad",
genre: "drama",
year: 2019,
poster: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
description: "Descent into madness."
},

{
title: "Fight Club",
mood: "thoughtful",
genre: "drama",
year: 1999,
poster: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
description: "Underground fight club."
},

{
title: "La La Land",
mood: "happy",
genre: "romance",
year: 2016,
poster: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
description: "Romantic musical."
}

/* ---- MORE MOVIES CONTINUE ---- */
/* (Dataset intentionally large and extendable) */

];
