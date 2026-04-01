/* ═══════════════════════════════════════════════
   CINEMATCH — SCRIPT.JS
   Features: filtering, sorting, search, watchlist,
   modal, toast, keyboard nav, similar films, random
═══════════════════════════════════════════════ */

/* ── STATE ── */
const state = {
  mood: 'all',
  genre: 'all',
  sort: 'default',
  query: '',
  watchlist: JSON.parse(localStorage.getItem('cm_watchlist') || '[]'),
  history: [],
  historyIndex: -1,
};

/* ── DOM REFS ── */
const $ = id => document.getElementById(id);
const container   = $('moviesContainer');
const searchInput = $('search');
const searchClear = $('searchClear');
const sortSelect  = $('sortSelect');
const randomBtn   = $('randomBtn');
const clearBtn    = $('clearFilters');
const resultsCount= $('resultsCount');
const emptyState  = $('emptyState');
const modal       = $('modal');
const modalBody   = $('modalBody');
const closeModalBtn = $('closeModal');
const toastEl     = $('toast');

/* ══════════════════════════════════
   FILTERING & SORTING
══════════════════════════════════ */

function getFiltered() {
  let list = [...movies];

  if (state.mood  !== 'all') list = list.filter(m => m.mood  === state.mood);
  if (state.genre !== 'all') list = list.filter(m => m.genre === state.genre);

  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      m.genre.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      String(m.year).includes(q)
    );
  }

  switch (state.sort) {
    case 'year-desc': list.sort((a,b) => b.year - a.year); break;
    case 'year-asc':  list.sort((a,b) => a.year - b.year); break;
    case 'title-asc': list.sort((a,b) => a.title.localeCompare(b.title)); break;
  }

  return list;
}

/* ══════════════════════════════════
   RENDER
══════════════════════════════════ */

function render() {
  const list = getFiltered();

  /* results count */
  resultsCount.innerHTML = `<strong>${list.length}</strong> film${list.length !== 1 ? 's' : ''}`;

  /* empty state */
  if (list.length === 0) {
    container.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  container.innerHTML = '';

  list.forEach((movie, i) => {
    const inWL = state.watchlist.includes(movie.title);
    const card = document.createElement('div');
    card.className = 'movie-card' + (inWL ? ' in-watchlist' : '');
    card.dataset.title = movie.title;
    card.style.animationDelay = `${Math.min(i * 0.04, 0.32)}s`;

    card.innerHTML = `
      <div class="card-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
        <span class="mood-badge mood-${movie.mood}">${moodEmoji(movie.mood)} ${movie.mood}</span>
      </div>
      <div class="movie-info">
        <p class="movie-meta">${movie.genre} &middot; ${movie.year}</p>
        <h3 class="movie-title">${movie.title}</h3>
        <p class="movie-desc">${movie.description}</p>
      </div>
    `;

    card.addEventListener('click', () => openModal(movie));
    container.appendChild(card);
  });
}

function moodEmoji(mood) {
  return { happy:'😄', sad:'😢', motivational:'🔥', thoughtful:'🤔' }[mood] || '';
}

/* ══════════════════════════════════
   MODAL
══════════════════════════════════ */

let currentMovie = null;

function openModal(movie) {
  currentMovie = movie;
  const inWL = state.watchlist.includes(movie.title);
  const similar = getSimilar(movie);

  modalBody.innerHTML = `
    <div class="modal-inner">
      <img class="modal-poster" src="${movie.poster}" alt="${movie.title}" />
      <div class="modal-details">
        <div class="modal-genre-row">
          <span class="modal-genre-tag">${movie.genre}</span>
          <span class="modal-year-tag">${movie.year}</span>
          <span class="modal-genre-tag" style="background:transparent;color:var(--c-text-2);border-color:var(--c-border);">${moodEmoji(movie.mood)} ${movie.mood}</span>
        </div>
        <h2 class="modal-title">${movie.title}</h2>
        <div class="modal-divider"></div>
        <p class="modal-desc">${movie.description}</p>
        <div class="modal-actions">
          <button class="btn-watchlist" id="wlBtn">${inWL ? '✓ In Watchlist' : '+ Watchlist'}</button>
          <button class="btn-similar" id="similarBtn">Find Similar</button>
        </div>

        ${similar.length ? `
          <div class="modal-similar">
            <p class="similar-label">You might also like</p>
            <div class="similar-row">
              ${similar.map(m => `
                <div class="similar-card" data-title="${m.title}">
                  <img src="${m.poster}" alt="${m.title}" loading="lazy" />
                  <span>${m.title}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  /* watchlist toggle */
  $('wlBtn').addEventListener('click', () => toggleWatchlist(movie));

  /* similar filter */
  $('similarBtn').addEventListener('click', () => {
    closeModal();
    state.genre = movie.genre;
    state.mood  = movie.mood;
    updatePills();
    render();
    showToast(`Showing ${movie.genre} · ${movie.mood} films`);
  });

  /* similar card clicks */
  modalBody.querySelectorAll('.similar-card').forEach(sc => {
    sc.addEventListener('click', () => {
      const m = movies.find(x => x.title === sc.dataset.title);
      if (m) openModal(m);
    });
  });

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
  currentMovie = null;
}

function getSimilar(movie) {
  return movies
    .filter(m => m.title !== movie.title && (m.genre === movie.genre || m.mood === movie.mood))
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}

/* ══════════════════════════════════
   WATCHLIST
══════════════════════════════════ */

function toggleWatchlist(movie) {
  const idx = state.watchlist.indexOf(movie.title);
  if (idx === -1) {
    state.watchlist.push(movie.title);
    showToast(`Added "${movie.title}" to watchlist`);
  } else {
    state.watchlist.splice(idx, 1);
    showToast(`Removed "${movie.title}" from watchlist`);
  }
  localStorage.setItem('cm_watchlist', JSON.stringify(state.watchlist));

  /* update button */
  const btn = $('wlBtn');
  if (btn) {
    const inWL = state.watchlist.includes(movie.title);
    btn.textContent = inWL ? '✓ In Watchlist' : '+ Watchlist';
    btn.style.background = inWL ? '#3a8f5e' : '';
  }

  /* update card border */
  const card = container.querySelector(`[data-title="${CSS.escape(movie.title)}"]`);
  if (card) {
    card.classList.toggle('in-watchlist', state.watchlist.includes(movie.title));
  }
}

/* ══════════════════════════════════
   TOAST
══════════════════════════════════ */

let toastTimer;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
}

/* ══════════════════════════════════
   PILL SYNC
══════════════════════════════════ */

function updatePills() {
  document.querySelectorAll('[data-mood]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mood === state.mood);
  });
  document.querySelectorAll('[data-genre]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.genre === state.genre);
  });
  sortSelect.value = state.sort;
}

/* ══════════════════════════════════
   EVENTS
══════════════════════════════════ */

/* Mood pills */
document.querySelectorAll('[data-mood]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.mood = btn.dataset.mood;
    updatePills();
    render();
  });
});

/* Genre pills */
document.querySelectorAll('[data-genre]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.genre = btn.dataset.genre;
    updatePills();
    render();
  });
});

/* Sort */
sortSelect.addEventListener('change', () => {
  state.sort = sortSelect.value;
  render();
});

/* Search */
searchInput.addEventListener('input', () => {
  state.query = searchInput.value.trim();
  searchClear.classList.toggle('visible', state.query.length > 0);
  render();
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  state.query = '';
  searchClear.classList.remove('visible');
  searchInput.focus();
  render();
});

/* Random */
randomBtn.addEventListener('click', () => {
  const pool = getFiltered().length > 1 ? getFiltered() : movies;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  openModal(pick);
});

/* Clear all */
clearBtn.addEventListener('click', () => {
  state.mood  = 'all';
  state.genre = 'all';
  state.sort  = 'default';
  state.query = '';
  searchInput.value = '';
  searchClear.classList.remove('visible');
  sortSelect.value = 'default';
  updatePills();
  render();
  showToast('Filters cleared');
});

/* Modal close */
closeModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

/* Keyboard */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (modal.classList.contains('open')) closeModal();
  }
  /* Cmd/Ctrl+K focuses search */
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  /* Arrow keys navigate cards when modal is closed */
  if (!modal.classList.contains('open')) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const cards = [...container.querySelectorAll('.movie-card')];
      const focused = document.activeElement;
      const idx = cards.indexOf(focused);
      if (idx !== -1) {
        const next = e.key === 'ArrowRight' ? cards[idx+1] : cards[idx-1];
        if (next) next.focus();
      }
    }
    if (e.key === 'Enter' && document.activeElement.classList.contains('movie-card')) {
      const title = document.activeElement.dataset.title;
      const movie = movies.find(m => m.title === title);
      if (movie) openModal(movie);
    }
  }
});

/* Make cards focusable for keyboard nav */
container.addEventListener('DOMNodeInserted', () => {
  container.querySelectorAll('.movie-card').forEach(c => {
    if (!c.hasAttribute('tabindex')) c.setAttribute('tabindex', '0');
  });
});

/* ══════════════════════════════════
   INJECT SIMILAR STYLES
══════════════════════════════════ */

const extraStyles = document.createElement('style');
extraStyles.textContent = `
  .modal-similar {
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.07);
  }
  .similar-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--c-text-3);
    margin-bottom: 12px;
  }
  .similar-row {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 4px;
    scrollbar-width: thin;
  }
  .similar-row::-webkit-scrollbar { height: 3px; }
  .similar-row::-webkit-scrollbar-thumb { background: var(--c-surface-3); border-radius: 2px; }
  .similar-card {
    flex: 0 0 80px;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--c-border);
    transition: transform 0.2s ease, border-color 0.2s ease;
    position: relative;
  }
  .similar-card:hover {
    transform: translateY(-3px);
    border-color: var(--c-gold);
  }
  .similar-card img {
    width: 80px;
    height: 110px;
    object-fit: cover;
    display: block;
  }
  .similar-card span {
    display: block;
    font-size: 9px;
    color: var(--c-text-2);
    padding: 4px 5px;
    line-height: 1.3;
    background: var(--c-surface);
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
`;
document.head.appendChild(extraStyles);

/* ══════════════════════════════════
   INIT
══════════════════════════════════ */

render();

/* Tip toast on load */
setTimeout(() => showToast('Tip: Press ⌘K to search'), 1800);