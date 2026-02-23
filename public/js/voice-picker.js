/* ============================================
   Voice Picker — Multi-language TTS voice + speed
   Slide-in panel with language filters
   ============================================ */

// Language display names + flags
const LANG_MAP = {
  'ar': { name: 'Arabic', flag: '🇦🇪' },
  'en': { name: 'English', flag: '🇬🇧' },
  'fr': { name: 'French', flag: '🇫🇷' },
  'es': { name: 'Spanish', flag: '🇪🇸' },
  'de': { name: 'German', flag: '🇩🇪' },
  'it': { name: 'Italian', flag: '🇮🇹' },
  'pt': { name: 'Portuguese', flag: '🇵🇹' },
  'ru': { name: 'Russian', flag: '🇷🇺' },
  'zh': { name: 'Chinese', flag: '🇨🇳' },
  'ja': { name: 'Japanese', flag: '🇯🇵' },
  'ko': { name: 'Korean', flag: '🇰🇷' },
  'hi': { name: 'Hindi', flag: '🇮🇳' },
  'tr': { name: 'Turkish', flag: '🇹🇷' },
  'nl': { name: 'Dutch', flag: '🇳🇱' },
  'pl': { name: 'Polish', flag: '🇵🇱' },
  'sv': { name: 'Swedish', flag: '🇸🇪' },
  'da': { name: 'Danish', flag: '🇩🇰' },
  'fi': { name: 'Finnish', flag: '🇫🇮' },
  'nb': { name: 'Norwegian', flag: '🇳🇴' },
  'no': { name: 'Norwegian', flag: '🇳🇴' },
  'he': { name: 'Hebrew', flag: '🇮🇱' },
  'th': { name: 'Thai', flag: '🇹🇭' },
  'id': { name: 'Indonesian', flag: '🇮🇩' },
  'vi': { name: 'Vietnamese', flag: '🇻🇳' },
  'uk': { name: 'Ukrainian', flag: '🇺🇦' },
  'cs': { name: 'Czech', flag: '🇨🇿' },
  'el': { name: 'Greek', flag: '🇬🇷' },
  'ro': { name: 'Romanian', flag: '🇷🇴' },
  'hu': { name: 'Hungarian', flag: '🇭🇺' },
  'sk': { name: 'Slovak', flag: '🇸🇰' },
  'bg': { name: 'Bulgarian', flag: '🇧🇬' },
  'hr': { name: 'Croatian', flag: '🇭🇷' },
  'ur': { name: 'Urdu', flag: '🇵🇰' },
  'bn': { name: 'Bengali', flag: '🇧🇩' },
  'ta': { name: 'Tamil', flag: '🇮🇳' },
  'fil': { name: 'Filipino', flag: '🇵🇭' },
  'ms': { name: 'Malay', flag: '🇲🇾' },
};

// Preview phrases per language
const PREVIEW_PHRASES = {
  'ar': 'مرحبا! أهلا وسهلا بكم',
  'en': 'Welcome to UAE Culture Learning Kids!',
  'fr': 'Bienvenue! Explorons la culture des Émirats!',
  'es': '¡Bienvenidos! Exploremos la cultura de los Emiratos!',
  'de': 'Willkommen! Lasst uns die Kultur der Emirate erkunden!',
  'it': 'Benvenuti! Esploriamo la cultura degli Emirati!',
  'pt': 'Bem-vindos! Vamos explorar a cultura dos Emirados!',
  'ru': 'Добро пожаловать! Давайте изучим культуру ОАЭ!',
  'zh': '欢迎来到阿联酋文化学习！',
  'ja': 'UAEの文化を学びましょう！ようこそ！',
  'ko': 'UAE 문화를 배워봅시다! 환영합니다!',
  'hi': 'UAE की संस्कृति सीखें! स्वागत है!',
  'tr': 'BAE kültürünü keşfedelim! Hoş geldiniz!',
  'ur': '!UAE ثقافت سیکھیں۔ خوش آمدید',
  'nl': 'Welkom! Laten we de cultuur van de Emiraten verkennen!',
};

let currentFilter = 'all';

function getSavedVoiceName() {
  return localStorage.getItem('uaequest_voice') || null;
}

function getSavedSpeed() {
  return parseFloat(localStorage.getItem('uaequest_voice_speed') || '0.9');
}

function getSavedPitch() {
  return parseFloat(localStorage.getItem('uaequest_voice_pitch') || '1.05');
}

function getAllVoices() {
  if (!('speechSynthesis' in window)) return [];
  return speechSynthesis.getVoices();
}

function getLangCode(langTag) {
  return langTag.split('-')[0].toLowerCase();
}

function getLangInfo(langTag) {
  const code = getLangCode(langTag);
  return LANG_MAP[code] || { name: langTag, flag: '🌐' };
}

function getGroupedVoices() {
  const voices = getAllVoices();
  const groups = {};

  voices.forEach(v => {
    const code = getLangCode(v.lang);
    if (!groups[code]) {
      const info = getLangInfo(v.lang);
      groups[code] = { code, name: info.name, flag: info.flag, voices: [] };
    }
    groups[code].voices.push(v);
  });

  // Sort: Arabic first, English second, then alphabetical
  return Object.values(groups).sort((a, b) => {
    if (a.code === 'ar') return -1;
    if (b.code === 'ar') return 1;
    if (a.code === 'en') return -1;
    if (b.code === 'en') return 1;
    return a.name.localeCompare(b.name);
  });
}

function selectVoice(voiceName) {
  localStorage.setItem('uaequest_voice', voiceName);

  // Update voice items UI
  document.querySelectorAll('.voice-item').forEach(el => {
    el.classList.toggle('selected', el.dataset.voice === voiceName);
  });

  // Update current info
  const info = document.getElementById('voiceCurrentInfo');
  if (info) {
    info.innerHTML = `<span class="voice-current-label">Selected:</span> <strong>${voiceName}</strong>`;
  }
}

function previewVoice(voiceName, langCode) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();

  const text = PREVIEW_PHRASES[langCode] || PREVIEW_PHRASES['en'];

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = getSavedSpeed();
  utterance.pitch = getSavedPitch();

  const voice = getAllVoices().find(v => v.name === voiceName);
  if (voice) utterance.voice = voice;

  speechSynthesis.speak(utterance);
}

function filterVoices(langCode) {
  currentFilter = langCode;
  const panel = document.getElementById('voicePanel');
  if (!panel) return;

  panel.querySelectorAll('.voice-filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === langCode);
  });

  panel.querySelectorAll('.voice-group').forEach(group => {
    group.style.display = (langCode === 'all' || group.dataset.lang === langCode) ? 'block' : 'none';
  });
}

function updateSpeedDisplay(value) {
  localStorage.setItem('uaequest_voice_speed', value);
  const el = document.getElementById('speedValue');
  if (el) el.textContent = value + 'x';
}

function updatePitchDisplay(value) {
  localStorage.setItem('uaequest_voice_pitch', value);
  const el = document.getElementById('pitchValue');
  if (el) el.textContent = parseFloat(value).toFixed(2);
}

function buildVoicePanel() {
  const groups = getGroupedVoices();
  const saved = getSavedVoiceName();
  const speed = getSavedSpeed();
  const pitch = getSavedPitch();
  const totalVoices = groups.reduce((sum, g) => sum + g.voices.length, 0);

  // Language filter tabs
  let filtersHTML = `<button class="voice-filter-btn active" data-lang="all" onclick="filterVoices('all')">🌍 All (${totalVoices})</button>`;
  groups.forEach(g => {
    filtersHTML += `<button class="voice-filter-btn" data-lang="${g.code}" onclick="filterVoices('${g.code}')">${g.flag} ${g.name} (${g.voices.length})</button>`;
  });

  // Voice groups
  let groupsHTML = '';
  if (groups.length === 0) {
    groupsHTML = '<p class="voice-empty">No voices found. Try reopening this panel in a moment.</p>';
  } else {
    groups.forEach(g => {
      let voicesHTML = '';
      g.voices.forEach(v => {
        const shortName = v.name
          .replace('Microsoft ', '')
          .replace('Google ', '')
          .replace(' Online (Natural)', '')
          .replace(' Desktop', '');
        const isSelected = v.name === saved;
        const esc = v.name.replace(/'/g, "\\'");

        voicesHTML += `
          <div class="voice-item ${isSelected ? 'selected' : ''}" data-voice="${v.name}" onclick="selectVoice('${esc}')">
            <div class="voice-item-info">
              <div class="voice-item-name">${shortName}</div>
              <div class="voice-item-lang">${v.lang}${v.localService ? '' : ' · Cloud'}</div>
            </div>
            <button class="voice-item-preview" onclick="event.stopPropagation(); previewVoice('${esc}', '${g.code}')">▶ Test</button>
          </div>
        `;
      });

      groupsHTML += `
        <div class="voice-group" data-lang="${g.code}">
          <div class="voice-group-label">${g.flag} ${g.name} <span class="voice-group-count">(${g.voices.length})</span></div>
          <div class="voice-list">${voicesHTML}</div>
        </div>
      `;
    });
  }

  return `
    <button class="voice-panel-close" onclick="toggleVoicePanel()">✕</button>
    <h3>⚙️ Voice Settings</h3>
    <p class="voice-panel-desc">Pick a voice and language for narration</p>

    <div class="voice-speed-control">
      <label>Speed</label>
      <input type="range" min="0.5" max="1.5" step="0.1" value="${speed}"
             oninput="updateSpeedDisplay(this.value)">
      <div class="voice-speed-value" id="speedValue">${speed}x</div>
    </div>

    <div class="voice-speed-control">
      <label>Pitch</label>
      <input type="range" min="0.5" max="1.5" step="0.05" value="${pitch}"
             oninput="updatePitchDisplay(this.value)">
      <div class="voice-speed-value" id="pitchValue">${pitch.toFixed(2)}</div>
    </div>

    <div class="voice-current-info" id="voiceCurrentInfo">
      ${saved ? `<span class="voice-current-label">Selected:</span> <strong>${saved}</strong>` : '<span class="voice-current-label">Using default voice</span>'}
    </div>

    <div class="voice-filters" id="voiceFilters">${filtersHTML}</div>

    <div class="voice-groups">${groupsHTML}</div>
  `;
}

function toggleVoicePanel() {
  let panel = document.getElementById('voicePanel');

  if (panel) {
    panel.classList.remove('open');
    setTimeout(() => { if (panel.parentNode) panel.remove(); }, 350);
    return;
  }

  panel = document.createElement('div');
  panel.id = 'voicePanel';
  panel.className = 'voice-panel';
  panel.innerHTML = buildVoicePanel();
  document.body.appendChild(panel);

  // Trigger slide-in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => panel.classList.add('open'));
  });

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closePanelHandler(e) {
      const p = document.getElementById('voicePanel');
      const btn = document.getElementById('voiceSettingsBtn');
      if (p && !p.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        p.classList.remove('open');
        setTimeout(() => { if (p.parentNode) p.remove(); }, 350);
        document.removeEventListener('click', closePanelHandler);
      }
    });
  }, 200);
}

// Ensure voices are loaded
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
  speechSynthesis.getVoices();
}
