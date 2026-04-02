/* ═══════════════════════════════════════════════
   CINEMATCH — AI.JS
   Powered by Claude claude-sonnet-4-20250514
   Natural language → curated film picks
═══════════════════════════════════════════════ */

/* ── DOM ── */
const aiOverlay   = document.getElementById('aiOverlay');
const aiPanel     = document.getElementById('aiPanel');
const openAiBtn   = document.getElementById('openAiBtn');
const closeAiBtn  = document.getElementById('closeAiBtn');
const aiInput     = document.getElementById('aiInput');
const aiSendBtn   = document.getElementById('aiSendBtn');
const aiThread    = document.getElementById('aiThread');
const aiRecs      = document.getElementById('aiRecs');
const aiIdle      = document.getElementById('aiIdle');

/* ── STATE ── */
let aiHistory = [];     // {role, content}[]
let isStreaming = false;

/* ── OPEN / CLOSE ── */
openAiBtn.addEventListener('click', openAiPanel);
closeAiBtn.addEventListener('click', closeAiPanel);
aiOverlay.addEventListener('click', e => { if (e.target === aiOverlay) closeAiPanel(); });

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && aiOverlay.classList.contains('open')) closeAiPanel();
});

function openAiPanel() {
  aiOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => aiInput.focus(), 300);
}

function closeAiPanel() {
  aiOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── PROMPT CHIPS ── */
document.querySelectorAll('.ai-prompt-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    aiInput.value = chip.dataset.prompt;
    autoResizeTextarea();
    sendMessage();
  });
});

/* ── INPUT HANDLING ── */
aiInput.addEventListener('input', autoResizeTextarea);
aiInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
aiSendBtn.addEventListener('click', sendMessage);

function autoResizeTextarea() {
  aiInput.style.height = 'auto';
  aiInput.style.height = Math.min(aiInput.scrollHeight, 120) + 'px';
}

/* ══════════════════════════════════
   SEND MESSAGE → CLAUDE API
══════════════════════════════════ */

async function sendMessage() {
  const text = aiInput.value.trim();
  if (!text || isStreaming) return;

  isStreaming = true;
  aiInput.value = '';
  aiInput.style.height = 'auto';
  aiSendBtn.disabled = true;
  aiSendBtn.classList.add('loading');

  /* Hide idle, show thread */
  aiIdle.hidden = true;
  aiThread.hidden = false;
  aiRecs.hidden = true;
  aiRecs.innerHTML = '';

  /* Add user bubble */
  appendBubble('user', text);
  aiHistory.push({ role: 'user', content: text });

  /* Add AI typing bubble */
  const thinkingId = 'thinking-' + Date.now();
  appendThinking(thinkingId);
  scrollThread();

  try {
    const catalogue = movies.map(m =>
      `"${m.title}" (${m.year}) [${m.genre}, ${m.mood}] — ${m.description}`
    ).join('\n');

    const systemPrompt = `You are CineMatch AI, a sophisticated and enthusiastic film curator with deep knowledge of cinema. You help users find the perfect film from CineMatch's catalogue.

CATALOGUE (use ONLY films from this list):
${catalogue}

YOUR JOB:
1. Read the user's mood/vibe/request carefully.
2. Pick 3–5 films from the catalogue that best match.
3. Reply in a warm, cinephile voice — brief intro, then your picks.

FORMAT your response as valid JSON only, with this exact structure:
{
  "message": "Your warm 1–2 sentence intro here",
  "picks": [
    {
      "title": "Exact film title from catalogue",
      "reason": "1–2 sentences why this film matches their mood perfectly"
    }
  ]
}

RULES:
- Only recommend films that exist EXACTLY in the catalogue above.
- Match title spelling precisely.
- Be specific about why each film fits their request.
- Vary your picks — don't always pick the same films.
- JSON only, no markdown fences, no extra text outside the JSON.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: aiHistory,
      }),
    });

    const data = await response.json();

    /* Remove thinking bubble */
    document.getElementById(thinkingId)?.remove();

    if (!response.ok || !data.content?.[0]?.text) {
      throw new Error(data.error?.message || 'API error');
    }

    const rawText = data.content[0].text.trim();

    /* Parse JSON response */
    let parsed;
    try {
      const clean = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      throw new Error('Could not parse film recommendations.');
    }

    /* Save assistant message */
    aiHistory.push({ role: 'assistant', content: rawText });

    /* Render AI message bubble */
    appendBubble('assistant', parsed.message);

    /* Render recommendation cards */
    renderRecs(parsed.picks);

  } catch (err) {
    document.getElementById(thinkingId)?.remove();
    appendBubble('error', `Something went wrong: ${err.message}. Please try again.`);
  } finally {
    isStreaming = false;
    aiSendBtn.disabled = false;
    aiSendBtn.classList.remove('loading');
    scrollThread();
  }
}

/* ══════════════════════════════════
   RENDER HELPERS
══════════════════════════════════ */

function appendBubble(role, text) {
  const div = document.createElement('div');
  div.className = `ai-bubble ai-bubble--${role}`;
  div.innerHTML = `<p>${escHtml(text)}</p>`;
  aiThread.appendChild(div);
  scrollThread();
}

function appendThinking(id) {
  const div = document.createElement('div');
  div.className = 'ai-bubble ai-bubble--assistant ai-bubble--thinking';
  div.id = id;
  div.innerHTML = `<span class="thinking-dot"></span><span class="thinking-dot"></span><span class="thinking-dot"></span>`;
  aiThread.appendChild(div);
  scrollThread();
}

function renderRecs(picks) {
  if (!picks || picks.length === 0) return;

  aiRecs.hidden = false;
  aiRecs.innerHTML = '';

  const label = document.createElement('p');
  label.className = 'ai-recs-label';
  label.textContent = 'Your picks';
  aiRecs.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'ai-recs-grid';

  picks.forEach((pick, i) => {
    const movie = movies.find(m =>
      m.title.toLowerCase() === pick.title.toLowerCase() ||
      m.title.toLowerCase().includes(pick.title.toLowerCase().slice(0, 12))
    );
    if (!movie) return;

    const card = document.createElement('div');
    card.className = 'ai-rec-card';
    card.style.animationDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" crossorigin="anonymous"
           onload="this.classList.add('loaded')"
           onerror="this.src='https://placehold.co/160x240/0f1218/c9a84c?text=${encodeURIComponent(movie.title)}'" />
      <div class="ai-rec-info">
        <p class="ai-rec-meta">${movie.genre} · ${movie.year}</p>
        <h4 class="ai-rec-title">${movie.title}</h4>
        <p class="ai-rec-reason">${escHtml(pick.reason)}</p>
        <div class="ai-rec-actions">
          <button class="ai-rec-view" data-title="${movie.title}">View Film</button>
          <button class="ai-rec-wl" data-title="${movie.title}">${state.watchlist.includes(movie.title) ? '✓' : '+'}</button>
        </div>
      </div>
    `;

    /* View film opens the main modal */
    card.querySelector('.ai-rec-view').addEventListener('click', () => {
      closeAiPanel();
      setTimeout(() => openModal(movie), 200);
    });

    /* Watchlist toggle */
    card.querySelector('.ai-rec-wl').addEventListener('click', (e) => {
      toggleWatchlist(movie);
      e.currentTarget.textContent = state.watchlist.includes(movie.title) ? '✓' : '+';
    });

    grid.appendChild(card);
  });

  aiRecs.appendChild(grid);

  /* Ask again button */
  const askAgain = document.createElement('button');
  askAgain.className = 'ai-ask-again';
  askAgain.textContent = '↩ Ask something else';
  askAgain.addEventListener('click', () => {
    aiRecs.hidden = true;
    aiRecs.innerHTML = '';
    aiInput.focus();
  });
  aiRecs.appendChild(askAgain);

  scrollThread();
}

function scrollThread() {
  const body = document.getElementById('aiPanelBody');
  if (body) requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}