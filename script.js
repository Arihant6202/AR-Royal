/* =========================================================
   AR ROYAL — 2D Landscape Battle Royale (5-Level Campaign)
   Pure HTML5 Canvas + Web Audio API (Zero External Deps)
   ========================================================= */

(() => {
  'use strict';

  // ---------- CONSTANTS & LEVEL CONFIGS ----------
  const WORLD_SIZE = 2000;
  const SPEED_MULTIPLIERS = { slow: 0.82, tactical: 1.0, fast: 1.25 };

  const LEVELS = [
    {
      id: 1,
      name: 'Bermuda Outpost',
      theme: 'grass',
      enemies: 6,
      botTier: 'easy',
      zoneSpeed: 0.75,
      trees: 42,
      rocks: 24,
      buildings: 7,
      crates: 18,
      airdropInterval: 34,
      startArmor: 0,
      hasBoss: false,
      desc: '6 Easy Bots • Lush Outpost • Slow Zone',
      colors: { bg: '#2f5a32', grid: 'rgba(255,255,255,0.04)', tree: '#1d4623', treeTop: '#2d6a34', rock: '#64748b', wall: '#57534e', floor: '#44403c' }
    },
    {
      id: 2,
      name: 'Kalahari Sandstorm',
      theme: 'desert',
      enemies: 8,
      botTier: 'normal',
      zoneSpeed: 0.9,
      trees: 18,
      rocks: 42,
      buildings: 8,
      crates: 20,
      airdropInterval: 30,
      startArmor: 1,
      hasBoss: false,
      desc: '8 Normal Bots • Desert Rocks • Lv.1 Vest',
      colors: { bg: '#b48a54', grid: 'rgba(60,35,10,0.06)', tree: '#4d6b2e', treeTop: '#65853b', rock: '#785a40', wall: '#7c5c3e', floor: '#9c7852' }
    },
    {
      id: 3,
      name: 'Purgatory Bridge',
      theme: 'autumn',
      enemies: 10,
      botTier: 'normal',
      zoneSpeed: 1.0,
      trees: 36,
      rocks: 30,
      buildings: 10,
      crates: 22,
      airdropInterval: 24,
      startArmor: 2,
      hasBoss: false,
      desc: '10 Tactical Bots • Heavy Airdrops • Lv.2 Vest',
      colors: { bg: '#475438', grid: 'rgba(255,255,255,0.045)', tree: '#7c3f1d', treeTop: '#a15326', rock: '#52525b', wall: '#4b5563', floor: '#374151' }
    },
    {
      id: 4,
      name: 'Alpine Snowbase',
      theme: 'snow',
      enemies: 12,
      botTier: 'sharp',
      zoneSpeed: 1.15,
      trees: 32,
      rocks: 32,
      buildings: 9,
      crates: 24,
      airdropInterval: 24,
      startArmor: 2,
      hasBoss: false,
      desc: '12 Sharp Bots • AWM Snipers • Fast Zone',
      colors: { bg: '#cbd5e1', grid: 'rgba(15,23,42,0.06)', tree: '#1e3a4c', treeTop: '#335c67', rock: '#64748b', wall: '#334155', floor: '#94a3b8' }
    },
    {
      id: 5,
      name: 'Neon Citadel Finale',
      theme: 'neon',
      enemies: 14,
      botTier: 'pro',
      zoneSpeed: 1.25,
      trees: 20,
      rocks: 30,
      buildings: 11,
      crates: 26,
      airdropInterval: 20,
      startArmor: 3,
      hasBoss: true,
      desc: '14 Pro Bots + BOSS_CITADEL • Championship',
      colors: { bg: '#111827', grid: 'rgba(56,189,248,0.09)', tree: '#1e293b', treeTop: '#0f766e', rock: '#334155', wall: '#1f2937', floor: '#172033' }
    }
  ];

  const LEVEL_EXTRAS = {
    1: { icon: '🌴', desc: '6 Easy Bots • Lakes (slow) • Lush Outpost', intro: 'Jheel me speed kam hoti hai — kinare se loot karo' },
    2: { icon: '🏜', desc: '8 Normal Bots • Quicksand • Sandstorms', intro: 'Sandstorm me visibility kam hogi, quicksand se bacho' },
    3: { icon: '🌉', desc: '10 Bots • River + 3 Bridges • Airdrops', intro: 'Nadi sirf pul (bridge) se tez cross hoti hai' },
    4: { icon: '❄', desc: '12 Sharp Bots • Slippery Ice • Snowfall', intro: 'Ice par fisalte ho — snipers se door raho' },
    5: { icon: '🌆', desc: '14 Pro Bots + BOSS • Citadel • Boost Pads', intro: 'Citadel ke andar BOSS_CITADEL hai — neon boost pads use karo' }
  };
  LEVELS.forEach(l => Object.assign(l, LEVEL_EXTRAS[l.id]));

  const WEAPONS = {
    M4A1: {
      id: 'M4A1', name: 'M4A1', slotType: 'primary',
      damage: 21, fireRate: 0.125, reloadTime: 1.6, magSize: 30, maxReserve: 120,
      bulletSpeed: 980, range: 640, spread: 0.045, pellets: 1, pierce: false,
      color: '#facc15', barrelLen: 22, bodyW: 5, recoil: 4.5, sound: 'm4a1'
    },
    MP40: {
      id: 'MP40', name: 'MP40', slotType: 'primary',
      damage: 14, fireRate: 0.075, reloadTime: 1.35, magSize: 28, maxReserve: 140,
      bulletSpeed: 880, range: 430, spread: 0.085, pellets: 1, pierce: false,
      color: '#38bdf8', barrelLen: 18, bodyW: 4.5, recoil: 3.0, sound: 'mp40'
    },
    M1887: {
      id: 'M1887', name: 'M1887', slotType: 'primary',
      damage: 18, fireRate: 0.85, reloadTime: 1.9, magSize: 4, maxReserve: 24,
      bulletSpeed: 820, range: 290, spread: 0.22, pellets: 5, pierce: false,
      color: '#fb923c', barrelLen: 21, bodyW: 6, recoil: 9.0, sound: 'm1887'
    },
    AWM: {
      id: 'AWM', name: 'AWM', slotType: 'primary',
      damage: 78, fireRate: 1.25, reloadTime: 2.2, magSize: 5, maxReserve: 20,
      bulletSpeed: 1480, range: 960, spread: 0.008, pellets: 1, pierce: true, laser: true,
      color: '#f43f5e', barrelLen: 29, bodyW: 5.5, recoil: 10.5, sound: 'awm'
    },
    G18: {
      id: 'G18', name: 'G18', slotType: 'sidearm',
      damage: 15, fireRate: 0.22, reloadTime: 1.15, magSize: 15, maxReserve: Infinity,
      bulletSpeed: 840, range: 400, spread: 0.06, pellets: 1, pierce: false,
      color: '#e2e8f0', barrelLen: 13, bodyW: 4, recoil: 3.5, sound: 'g18'
    }
  };

  const BOT_NAMES = [
    'SHADOW_99', 'VIPER_X', 'RAIDER_IN', 'GHOST_OP', 'TITAN_AR', 'BLAZE_K',
    'SNIPER_PRO', 'COBRA_7', 'FURY_MAX', 'RONIN_X', 'STORM_88', 'APEX_Z',
    'NOVA_KILL', 'REAPER_01', 'KRONOS_V'
  ];

  // ---------- WEB AUDIO SYNTHESIZER (5 DISTINCT GUN SOUNDS) ----------
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.noiseBuf = null;
    }
    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) {
          this.ctx = new AC();
          const len = this.ctx.sampleRate * 1.2;
          this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
          const data = this.noiseBuf.getChannelData(0);
          for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }
    playNoise(duration, filterType, freq, q, vol, delay = 0) {
      if (this.muted || !this.ctx || !this.noiseBuf) return;
      const now = this.ctx.currentTime + delay;
      const src = this.ctx.createBufferSource();
      src.buffer = this.noiseBuf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, now);
      filter.Q.setValueAtTime(q, now);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      src.connect(filter).connect(gain).connect(this.ctx.destination);
      src.start(now);
      src.stop(now + duration + 0.02);
    }
    playTone(type, fStart, fEnd, duration, vol, delay = 0) {
      if (this.muted || !this.ctx) return;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(fStart, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, fEnd), now + duration);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    }
    playGun(weaponSound, distFactor = 1) {
      if (this.muted || !this.ctx || distFactor <= 0.04) return;
      const v = Math.min(1, distFactor) * 0.42;
      if (weaponSound === 'm4a1') {
        // Crisp mid-range AR rifle crack
        this.playNoise(0.11, 'bandpass', 1400, 1.1, v * 0.9);
        this.playTone('sawtooth', 240, 70, 0.08, v * 0.55);
        this.playNoise(0.16, 'lowpass', 600, 0.8, v * 0.22, 0.05);
      } else if (weaponSound === 'mp40') {
        // Fast high-pitch SMG pop
        this.playNoise(0.065, 'highpass', 1900, 1.4, v * 0.75);
        this.playTone('square', 380, 140, 0.05, v * 0.35);
        this.playNoise(0.03, 'bandpass', 3400, 2.0, v * 0.25, 0.035);
      } else if (weaponSound === 'm1887') {
        // Deep booming shotgun blast + mechanical pump rack
        this.playNoise(0.24, 'lowpass', 950, 0.7, v * 1.25);
        this.playTone('triangle', 155, 36, 0.2, v * 1.0);
        // Pump rack click-clack
        this.playNoise(0.05, 'bandpass', 2400, 3.0, v * 0.35, 0.26);
        this.playNoise(0.05, 'bandpass', 3000, 3.5, v * 0.35, 0.36);
      } else if (weaponSound === 'awm') {
        // Thunderous high-caliber sniper crack + metallic bolt cycle
        this.playNoise(0.32, 'bandpass', 1100, 0.6, v * 1.35);
        this.playTone('sawtooth', 210, 32, 0.28, v * 1.1);
        this.playNoise(0.12, 'highpass', 3200, 1.0, v * 0.7, 0.02);
        // Bolt cycle
        this.playTone('square', 1350, 900, 0.04, v * 0.22, 0.42);
        this.playTone('square', 1750, 1200, 0.04, v * 0.22, 0.56);
        // Long valley echo
        this.playNoise(0.55, 'lowpass', 520, 0.6, v * 0.3, 0.14);
      } else {
        // G18 sharp pistol snap
        this.playNoise(0.08, 'bandpass', 2200, 1.5, v * 0.7);
        this.playTone('triangle', 320, 110, 0.065, v * 0.42);
      }
    }
    playHit() { this.playTone('triangle', 920, 420, 0.05, 0.14); }
    playKill() {
      this.playTone('sine', 520, 780, 0.1, 0.18, 0);
      this.playTone('sine', 780, 1040, 0.14, 0.2, 0.09);
    }
    playReload(kind) {
      if (kind === 'm1887') {
        // Shells pushed in one by one + pump
        [0, 0.22, 0.44].forEach(d => this.playTone('square', 900, 560, 0.045, 0.1, d));
        this.playNoise(0.05, 'bandpass', 2400, 3.0, 0.12, 0.7);
        this.playNoise(0.05, 'bandpass', 3000, 3.5, 0.12, 0.8);
      } else if (kind === 'awm') {
        // Bolt up / back / forward / down
        this.playTone('square', 1100, 700, 0.05, 0.12, 0);
        this.playTone('square', 1500, 900, 0.05, 0.12, 0.35);
        this.playTone('square', 900, 1400, 0.05, 0.12, 0.85);
        this.playTone('square', 700, 380, 0.06, 0.14, 1.15);
      } else if (kind === 'mp40') {
        this.playNoise(0.07, 'lowpass', 650, 1, 0.14, 0);
        this.playNoise(0.04, 'bandpass', 2600, 3, 0.13, 0.5);
        this.playTone('square', 520, 760, 0.05, 0.08, 0.62);
      } else if (kind === 'g18') {
        this.playTone('square', 760, 520, 0.04, 0.1, 0);
        this.playTone('square', 980, 1200, 0.04, 0.1, 0.3);
      } else {
        // M4A1: mag out, mag in, charging handle
        this.playTone('square', 640, 420, 0.05, 0.1, 0);
        this.playTone('square', 840, 1020, 0.06, 0.1, 0.55);
        this.playNoise(0.06, 'bandpass', 2000, 2.5, 0.12, 0.95);
      }
    }
    playSplash() { this.playNoise(0.12, 'lowpass', 720, 0.8, 0.09); }
    playPickup() { this.playTone('sine', 620, 980, 0.09, 0.14); }
    playHeal() { this.playTone('sine', 420, 680, 0.18, 0.12); }
    playStep(running) {
      this.playNoise(0.035, 'lowpass', running ? 420 : 280, 1, running ? 0.065 : 0.035);
    }
  }

  const audio = new SoundEngine();

  // ---------- DOM REFERENCES ----------
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const miniCanvas = document.getElementById('minimapCanvas');
  const miniCtx = miniCanvas.getContext('2d');

  const ui = {
    rotateOverlay: document.getElementById('rotateOverlay'),
    rotateFullscreenBtn: document.getElementById('rotateFullscreenBtn'),
    continuePortraitBtn: document.getElementById('continuePortraitBtn'),
    hud: document.getElementById('hud'),
    hudLevelTag: document.getElementById('hudLevelTag'),
    zoneTimerText: document.getElementById('zoneTimerText'),
    aliveText: document.getElementById('aliveText'),
    killsText: document.getElementById('killsText'),
    bossPill: document.getElementById('bossPill'),
    alertBanner: document.getElementById('alertBanner'),
    killFeed: document.getElementById('killFeed'),
    armorLabel: document.getElementById('armorLabel'),
    armorFill: document.getElementById('armorFill'),
    hpLabel: document.getElementById('hpLabel'),
    hpFill: document.getElementById('hpFill'),
    lootPromptBtn: document.getElementById('lootPromptBtn'),
    damageVignette: document.getElementById('damageVignette'),
    zoneVignette: document.getElementById('zoneVignette'),
    touchControls: document.getElementById('touchControls'),
    moveStickBase: document.getElementById('moveStickBase'),
    moveStickKnob: document.getElementById('moveStickKnob'),
    aimStickBase: document.getElementById('aimStickBase'),
    aimStickKnob: document.getElementById('aimStickKnob'),
    touchSprintBtn: document.getElementById('touchSprintBtn'),
    touchMedkitBtn: document.getElementById('touchMedkitBtn'),
    healRingProgress: document.getElementById('healRingProgress'),
    medkitCount: document.getElementById('medkitCount'),
    touchScopeBtn: document.getElementById('touchScopeBtn'),
    touchReloadBtn: document.getElementById('touchReloadBtn'),
    touchFireBtn: document.getElementById('touchFireBtn'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    touchToggleBtn: document.getElementById('touchToggleBtn'),
    hudFullscreenBtn: document.getElementById('hudFullscreenBtn'),
    pauseBtn: document.getElementById('pauseBtn'),
    lobbyOverlay: document.getElementById('lobbyOverlay'),
    levelList: document.getElementById('levelList'),
    progressSummary: document.getElementById('progressSummary'),
    playBtn: document.getElementById('playBtn'),
    lobbyFullscreenBtn: document.getElementById('lobbyFullscreenBtn'),
    pauseOverlay: document.getElementById('pauseOverlay'),
    resumeBtn: document.getElementById('resumeBtn'),
    restartBtn: document.getElementById('restartBtn'),
    quitLobbyBtn: document.getElementById('quitLobbyBtn'),
    endOverlay: document.getElementById('endOverlay'),
    endBadge: document.getElementById('endBadge'),
    endTitle: document.getElementById('endTitle'),
    endSubtitle: document.getElementById('endSubtitle'),
    statRank: document.getElementById('statRank'),
    statKills: document.getElementById('statKills'),
    statDamage: document.getElementById('statDamage'),
    statTime: document.getElementById('statTime'),
    nextLevelBtn: document.getElementById('nextLevelBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    endLobbyBtn: document.getElementById('endLobbyBtn')
  };

  // ---------- PERSISTENT STATE & SETTINGS ----------
  let clearedLevels = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem('ar_royal_cleared') || '[]');
    saved.forEach(id => clearedLevels.add(id));
  } catch (e) {}

  function saveProgress() {
    try { localStorage.setItem('ar_royal_cleared', JSON.stringify([...clearedLevels])); } catch (e) {}
  }

  let selectedLevelId = 1;
  let gameSpeedMode = 'tactical';
  let hudSizeMode = 'compact';
  let ignorePortraitGuard = false;
  let touchControlsEnabled = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  // ---------- GAME STATE ----------
  let state = 'lobby'; // 'lobby' | 'playing' | 'paused' | 'ended'
  let currentLevel = LEVELS[0];
  let matchTime = 0;
  let player = null;
  let bots = [];
  let bullets = [];
  let particles = [];
  let lootItems = [];
  let trees = [];
  let rocks = [];
  let walls = [];
  let floors = [];
  let terrain = [], bridges = [], decor = [], weather = [];
  let citadel = null;
  let stormTimer = 20, stormActive = 0, stormFx = 0;
  let gunfireBlips = [];
  let airdrops = [];
  let airdropTimer = 30;
  let alertTimeout = 0;
  let screenShake = 0;
  let damageFlash = 0;
  let cam = { x: 1000, y: 1000, zoom: 1 };

  let zone = {
    x: 1000, y: 1000, radius: 1380,
    targetX: 1000, targetY: 1000, targetRadius: 900,
    phase: 1, timer: 26, shrinking: false, dps: 3.5
  };

  // ---------- INPUT STATE ----------
  const keys = {};
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, down: false, worldX: 1000, worldY: 1000 };
  const touch = {
    moveId: null, moveX: 0, moveY: 0,
    aimId: null, aimX: 0, aimY: 0, aimActive: false,
    firing: false, sprinting: false
  };

  // ---------- HELPER FUNCTIONS ----------
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const dist = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
  const rand = (min, max) => min + Math.random() * (max - min);
  const angleDiff = (a, b) => {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  };

  function makeWeaponInstance(id) {
    const def = WEAPONS[id];
    return {
      id: def.id,
      ammo: def.magSize,
      reserve: def.maxReserve === Infinity ? Infinity : Math.round(def.maxReserve * 0.65),
      reloading: 0
    };
  }

  function showAlert(msg, duration = 2.6) {
    ui.alertBanner.textContent = msg;
    ui.alertBanner.classList.remove('hidden');
    alertTimeout = duration;
  }

  function addKillFeed(killer, victim, weaponName) {
    const el = document.createElement('div');
    el.className = 'kill-item';
    el.textContent = `${killer} [${weaponName}] ${victim}`;
    ui.killFeed.prepend(el);
    while (ui.killFeed.children.length > 3) ui.killFeed.lastChild.remove();
    setTimeout(() => { if (el.parentNode) el.remove(); }, 4500);
  }

  // ---------- ORIENTATION & FULLSCREEN ----------
  function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth * 1.05;
    if (isPortrait && !ignorePortraitGuard) {
      ui.rotateOverlay.classList.remove('hidden');
    } else {
      ui.rotateOverlay.classList.add('hidden');
    }
  }

  async function enterFullscreenLandscape() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      if (screen.orientation && screen.orientation.lock) {
        await screen.orientation.lock('landscape').catch(() => {});
      }
    } catch (e) {}
    resizeCanvas();
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    checkOrientation();
  }

  // ---------- LOBBY UI BUILDER ----------
  function renderLevelCards() {
    ui.levelList.innerHTML = '';
    ui.progressSummary.textContent = `${clearedLevels.size}/5 Cleared`;
    LEVELS.forEach(lvl => {
      const card = document.createElement('div');
      card.className = 'level-card' + (lvl.id === selectedLevelId ? ' selected' : '');
      const isCleared = clearedLevels.has(lvl.id);
      card.innerHTML = `
        <div class="lvl-info">
          <div class="lvl-title">${lvl.icon || ''} Level ${lvl.id} — ${lvl.name}</div>
          <div class="lvl-meta">${lvl.desc}</div>
        </div>
        <span class="lvl-badge ${isCleared ? 'cleared' : ''}">${isCleared ? '★ CLEARED' : (lvl.hasBoss ? '👑 BOSS' : 'READY')}</span>
      `;
      card.addEventListener('click', () => {
        selectedLevelId = lvl.id;
        renderLevelCards();
      });
      ui.levelList.appendChild(card);
    });
    updateModeCard();
  }

  function syncSettingsUI() {
    document.body.classList.remove('hud-mini', 'hud-compact', 'hud-normal');
    document.body.classList.add(`hud-${hudSizeMode}`);
    document.querySelectorAll('[data-speed]').forEach(b => b.classList.toggle('active', b.dataset.speed === gameSpeedMode));
    document.querySelectorAll('[data-hud]').forEach(b => b.classList.toggle('active', b.dataset.hud === hudSizeMode));
    ui.touchControls.classList.toggle('hidden', !touchControlsEnabled || state !== 'playing');
  }

  // ---------- MAP GENERATION ----------
  function generateMap(lvl) {
    trees = [];
    rocks = [];
    walls = [];
    floors = [];
    lootItems = [];
    airdrops = [];
    terrain = [];
    bridges = [];
    decor = [];
    citadel = null;
    buildLevelFeatures(lvl);

    // Buildings (compounds with doorway openings)
    for (let i = 0; i < lvl.buildings; i++) {
      const bw = rand(150, 220);
      const bh = rand(130, 190);
      const bx = rand(220, WORLD_SIZE - bw - 220);
      const by = rand(220, WORLD_SIZE - bh - 220);
      if (rectHitsTerrain(bx, by, bw, bh) || floors.some(f => bx < f.x + f.w + 90 && bx + bw + 90 > f.x && by < f.y + f.h + 90 && by + bh + 90 > f.y)) continue;
      floors.push({ x: bx, y: by, w: bw, h: bh });
      const t = 12;
      const door = 48;
      // Top wall (split with door)
      walls.push({ x: bx, y: by, w: (bw - door) / 2, h: t });
      walls.push({ x: bx + (bw + door) / 2, y: by, w: (bw - door) / 2, h: t });
      // Bottom wall (split with door)
      walls.push({ x: bx, y: by + bh - t, w: (bw - door) / 2, h: t });
      walls.push({ x: bx + (bw + door) / 2, y: by + bh - t, w: (bw - door) / 2, h: t });
      // Left & Right walls
      walls.push({ x: bx, y: by, w: t, h: bh });
      walls.push({ x: bx + bw - t, y: by, w: t, h: bh });

      // Spawn loot inside compound
      spawnLoot(bx + bw / 2 + rand(-30, 30), by + bh / 2 + rand(-25, 25), 'random');
    }

    // Solid Rocks
    for (let i = 0; i < lvl.rocks; i++) {
      const r = rand(18, 34);
      const x = rand(110, WORLD_SIZE - 110);
      const y = rand(110, WORLD_SIZE - 110);
      if (floors.some(f => x > f.x - r && x < f.x + f.w + r && y > f.y - r && y < f.y + f.h + r)) continue;
      if (inWater(x, y)) continue;
      rocks.push({ x, y, r });
    }

    // Trees (trunk solid, canopy turns semi-transparent when player is under)
    for (let i = 0; i < lvl.trees; i++) {
      const r = rand(36, 52);
      const x = rand(90, WORLD_SIZE - 90);
      const y = rand(90, WORLD_SIZE - 90);
      if (floors.some(f => x > f.x - r && x < f.x + f.w + r && y > f.y - r && y < f.y + f.h + r)) continue;
      if (inWater(x, y)) continue;
      trees.push({ x, y, trunkR: 10, canopyR: r, alpha: 1 });
    }

    // Crates / Ground Loot
    for (let i = 0; i < lvl.crates; i++) {
      const x = rand(140, WORLD_SIZE - 140);
      const y = rand(140, WORLD_SIZE - 140);
      if (inWater(x, y)) continue;
      spawnLoot(x, y, 'random');
    }
  }


  // ---------- PER-LEVEL DESIGN ----------
  function buildLevelFeatures(lvl) {
    const W = WORLD_SIZE;
    const pick = arr => arr[Math.floor(Math.random() * arr.length)];
    if (lvl.id === 1) {
      terrain.push({ kind: 'water', round: true, x: 520, y: 1160, w: 560, h: 400 });
      terrain.push({ kind: 'water', round: true, x: 1460, y: 280, w: 320, h: 230 });
      for (let i = 0; i < 70; i++) decor.push({ t: 'flower', x: rand(80, W - 80), y: rand(80, W - 80), c: pick(['#f9a8d4', '#fde68a', '#ffffff']) });
    } else if (lvl.id === 2) {
      for (let i = 0; i < 5; i++) terrain.push({ kind: 'quicksand', round: true, x: rand(200, W - 500), y: rand(200, W - 500), w: rand(180, 280), h: rand(130, 200) });
      for (let i = 0; i < 26; i++) decor.push({ t: 'dune', x: rand(60, W - 60), y: rand(60, W - 60), r: rand(70, 150), a: rand(-0.4, 0.4) });
      for (let i = 0; i < 20; i++) decor.push({ t: 'cactus', x: rand(80, W - 80), y: rand(80, W - 80) });
    } else if (lvl.id === 3) {
      terrain.push({ kind: 'water', x: 0, y: 930, w: W, h: 150 });
      [[250, 120], [880, 130], [1560, 120]].forEach(([bx, bw]) => bridges.push({ x: bx, y: 915, w: bw, h: 180 }));
    } else if (lvl.id === 4) {
      for (let i = 0; i < 6; i++) terrain.push({ kind: 'ice', round: true, x: rand(160, W - 520), y: rand(160, W - 460), w: rand(220, 340), h: rand(160, 260) });
      for (let i = 0; i < 6; i++) terrain.push({ kind: 'drift', round: true, x: rand(160, W - 400), y: rand(160, W - 400), w: rand(120, 200), h: rand(100, 160) });
      for (let i = 0; i < 30; i++) decor.push({ t: 'mound', x: rand(60, W - 60), y: rand(60, W - 60), r: rand(18, 46) });
    } else if (lvl.id === 5) {
      const cs = 560, c0 = (W - cs) / 2, t = 16, gate = 96, hw = (cs - gate) / 2;
      citadel = { x: c0, y: c0, w: cs, h: cs };
      floors.push({ x: c0, y: c0, w: cs, h: cs });
      walls.push({ x: c0, y: c0, w: hw, h: t }, { x: c0 + hw + gate, y: c0, w: hw, h: t });
      walls.push({ x: c0, y: c0 + cs - t, w: hw, h: t }, { x: c0 + hw + gate, y: c0 + cs - t, w: hw, h: t });
      walls.push({ x: c0, y: c0, w: t, h: hw }, { x: c0, y: c0 + hw + gate, w: t, h: hw });
      walls.push({ x: c0 + cs - t, y: c0, w: t, h: hw }, { x: c0 + cs - t, y: c0 + hw + gate, w: t, h: hw });
      [[90, 90], [cs - 150, 90], [90, cs - 150], [cs - 150, cs - 150]].forEach(([ox, oy]) => walls.push({ x: c0 + ox, y: c0 + oy, w: 60, h: 60 }));
      for (let i = 0; i < 7; i++) spawnLoot(W / 2 + rand(-200, 200), W / 2 + rand(-200, 200), 'random');
      for (let i = 0; i < 9; i++) {
        const bx = rand(160, W - 240), by = rand(160, W - 240);
        if (bx > c0 - 120 && bx < c0 + cs + 60 && by > c0 - 120 && by < c0 + cs + 60) continue;
        terrain.push({ kind: 'boost', x: bx, y: by, w: 80, h: 80 });
      }
      for (let i = 0; i < 24; i++) decor.push({ t: 'ring', x: rand(60, W - 60), y: rand(60, W - 60), r: rand(20, 60) });
    }
  }

  function drawTerrain() {
    const tNow = performance.now() / 1000;
    const th = currentLevel.theme;
    ctx.lineCap = 'round';
    for (let i = 0; i < decor.length; i++) {
      const d = decor[i];
      if (d.t === 'flower') {
        ctx.fillStyle = d.c; ctx.beginPath(); ctx.arc(d.x, d.y, 2.6, 0, Math.PI * 2); ctx.fill();
      } else if (d.t === 'dune') {
        ctx.fillStyle = 'rgba(255,235,190,0.13)';
        ctx.beginPath(); ctx.ellipse(d.x, d.y, d.r, d.r * 0.38, d.a, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = 'rgba(120,80,30,0.12)'; ctx.lineWidth = 2; ctx.stroke();
      } else if (d.t === 'cactus') {
        ctx.strokeStyle = '#3f7d3a'; ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y + 10); ctx.lineTo(d.x, d.y - 12);
        ctx.moveTo(d.x, d.y - 2); ctx.lineTo(d.x + 9, d.y - 2); ctx.lineTo(d.x + 9, d.y - 10);
        ctx.moveTo(d.x, d.y + 3); ctx.lineTo(d.x - 8, d.y + 3); ctx.lineTo(d.x - 8, d.y - 5);
        ctx.stroke();
      } else if (d.t === 'mound') {
        ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.fill();
      } else if (d.t === 'ring') {
        ctx.strokeStyle = `rgba(56,189,248,${0.12 + 0.08 * Math.sin(tNow * 2 + d.x)})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2); ctx.stroke();
      }
    }
    for (let i = 0; i < terrain.length; i++) {
      const t = terrain[i];
      const cx = t.x + t.w / 2, cy = t.y + t.h / 2;
      const path = () => { ctx.beginPath(); if (t.round) ctx.ellipse(cx, cy, t.w / 2, t.h / 2, 0, 0, Math.PI * 2); else ctx.rect(t.x, t.y, t.w, t.h); };
      if (t.kind === 'water') {
        ctx.fillStyle = th === 'autumn' ? '#1e5a8a' : '#2b7bb9';
        path(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = 2;
        if (t.round) {
          for (let k = 0; k < 2; k++) {
            const sc = 0.82 - k * 0.27 + Math.sin(tNow * 1.6 + k) * 0.03;
            ctx.beginPath(); ctx.ellipse(cx, cy, t.w / 2 * sc, t.h / 2 * sc, 0, 0, Math.PI * 2); ctx.stroke();
          }
        } else {
          for (let k = 0; k < 5; k++) {
            const yy = t.y + (k + 0.5) * t.h / 5;
            ctx.beginPath();
            for (let x = 0; x <= t.w; x += 40) {
              const y2 = yy + Math.sin(tNow * 1.8 + x * 0.02 + k) * 4;
              if (x === 0) ctx.moveTo(t.x + x, y2); else ctx.lineTo(t.x + x, y2);
            }
            ctx.stroke();
          }
        }
        ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(15,40,70,0.35)'; path(); ctx.stroke();
      } else if (t.kind === 'quicksand') {
        ctx.fillStyle = 'rgba(140,95,40,0.55)'; path(); ctx.fill();
        ctx.strokeStyle = 'rgba(70,40,10,0.35)'; ctx.lineWidth = 2;
        for (let k = 1; k <= 2; k++) { ctx.beginPath(); ctx.ellipse(cx, cy, t.w / 2 * (k * 0.3), t.h / 2 * (k * 0.3), tNow * (k % 2 ? 1 : -1) * 0.4, 0, Math.PI * 1.6); ctx.stroke(); }
      } else if (t.kind === 'ice') {
        ctx.fillStyle = 'rgba(191,233,255,0.62)'; path(); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 2; path(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - t.w * 0.3, cy - t.h * 0.1); ctx.lineTo(cx, cy + t.h * 0.05); ctx.lineTo(cx + t.w * 0.25, cy - t.h * 0.2);
        ctx.moveTo(cx, cy + t.h * 0.05); ctx.lineTo(cx + t.w * 0.1, cy + t.h * 0.3); ctx.stroke();
      } else if (t.kind === 'drift') {
        ctx.fillStyle = 'rgba(255,255,255,0.78)'; path(); ctx.fill();
      } else if (t.kind === 'boost') {
        ctx.fillStyle = 'rgba(34,211,238,0.22)'; path(); ctx.fill();
        ctx.strokeStyle = `rgba(34,211,238,${0.5 + 0.4 * Math.sin(tNow * 4)})`; ctx.lineWidth = 3; path(); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('»»', cx, cy + 9);
      }
    }
    for (let i = 0; i < bridges.length; i++) {
      const b = bridges[i];
      ctx.fillStyle = '#7c5a3a'; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeStyle = 'rgba(0,0,0,0.28)'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = b.y; y <= b.y + b.h; y += 18) { ctx.moveTo(b.x, y); ctx.lineTo(b.x + b.w, y); }
      ctx.stroke();
      ctx.strokeStyle = '#4a3520'; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x, b.y + b.h); ctx.moveTo(b.x + b.w, b.y); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.stroke();
    }
    ctx.lineCap = 'butt';
  }

  function drawCitadelDecor() {
    if (!citadel) return;
    const tNow = performance.now() / 1000;
    const cx = citadel.x + citadel.w / 2, cy = citadel.y + citadel.h / 2;
    ctx.strokeStyle = `rgba(232,121,249,${0.35 + 0.25 * Math.sin(tNow * 2)})`;
    ctx.lineWidth = 3;
    [70, 115].forEach(r => { ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke(); });
    ctx.strokeStyle = 'rgba(56,189,248,0.25)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(citadel.x, cy); ctx.lineTo(citadel.x + citadel.w, cy);
    ctx.moveTo(cx, citadel.y); ctx.lineTo(cx, citadel.y + citadel.h);
    ctx.stroke();
    ctx.fillStyle = 'rgba(232,121,249,0.3)'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('CITADEL', cx, cy + 8);
  }

  // ---------- WEATHER / ATMOSPHERE ----------
  function initWeather() {
    weather = [];
    stormTimer = 18; stormActive = 0; stormFx = 0;
    const th = currentLevel.theme;
    const vw = window.innerWidth, vh = window.innerHeight;
    const make = (n, f) => { for (let i = 0; i < n; i++) weather.push(Object.assign({ x: rand(0, vw), y: rand(0, vh), rot: rand(0, 6.28) }, f())); };
    if (th === 'grass') make(16, () => ({ kind: 'leaf', c: '#86efac', vx: rand(15, 35), vy: rand(20, 45), r: rand(2.5, 4) }));
    if (th === 'autumn') make(46, () => ({ kind: 'leaf', c: ['#f97316', '#facc15', '#b45309'][Math.floor(rand(0, 3))], vx: rand(25, 60), vy: rand(30, 70), r: rand(3, 5) }));
    if (th === 'snow') make(110, () => ({ kind: 'snow', vx: rand(-15, 15), vy: rand(40, 95), r: rand(1.2, 3) }));
    if (th === 'neon') make(40, () => ({ kind: 'spark', c: ['#22d3ee', '#e879f9'][Math.floor(rand(0, 2))], vx: rand(-10, 10), vy: rand(-60, -20), r: rand(1.2, 2.6) }));
    if (th === 'desert') make(70, () => ({ kind: 'dust', vx: rand(500, 900), vy: rand(-30, 30), r: 1 }));
  }
  function updateWeather(dt) {
    const vw = window.innerWidth, vh = window.innerHeight;
    for (let i = 0; i < weather.length; i++) {
      const w = weather[i];
      w.x += w.vx * dt; w.y += w.vy * dt; w.rot += dt * 2;
      if (w.x > vw + 20) w.x = -20;
      if (w.x < -20) w.x = vw + 20;
      if (w.y > vh + 20) w.y = -20;
      if (w.y < -20) w.y = vh + 20;
    }
    if (currentLevel.theme === 'desert') {
      if (stormActive > 0) {
        stormActive -= dt;
        if (stormActive <= 0) { stormTimer = rand(26, 36); showAlert('☀ Sandstorm khatam', 2.2); }
      } else {
        stormTimer -= dt;
        if (stormTimer <= 0) { stormActive = 9; showAlert('🌪 SANDSTORM! Visibility kam — bots bhi kam dekhte hain', 3.2); }
      }
      stormFx += ((stormActive > 0 ? 1 : 0) - stormFx) * Math.min(1, dt * 1.5);
    }
  }
  function drawWeather(vw, vh) {
    for (let i = 0; i < weather.length; i++) {
      const w = weather[i];
      if (w.kind === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.fill();
      } else if (w.kind === 'leaf') {
        ctx.save(); ctx.translate(w.x, w.y); ctx.rotate(w.rot); ctx.fillStyle = w.c;
        ctx.beginPath(); ctx.ellipse(0, 0, w.r * 1.6, w.r * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      } else if (w.kind === 'spark') {
        ctx.globalAlpha = 0.8; ctx.fillStyle = w.c; ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      } else if (w.kind === 'dust' && stormFx > 0.05) {
        ctx.strokeStyle = `rgba(235,195,125,${0.5 * stormFx})`; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(w.x, w.y); ctx.lineTo(w.x - w.vx * 0.04, w.y - w.vy * 0.04); ctx.stroke();
      }
    }
    if (stormFx > 0.02) {
      const g = ctx.createRadialGradient(vw / 2, vh / 2, 90, vw / 2, vh / 2, Math.max(vw, vh) * 0.6);
      g.addColorStop(0, 'rgba(200,150,80,0)');
      g.addColorStop(1, `rgba(200,150,80,${0.6 * stormFx})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, vw, vh);
    }
  }

  function spawnLoot(x, y, type, specific = null) {
    if (type === 'random') {
      const roll = Math.random();
      if (roll < 0.42) {
        const pool = currentLevel.id >= 4 ? ['M4A1', 'MP40', 'M1887', 'AWM'] : ['M4A1', 'MP40', 'M1887', 'M4A1'];
        const wid = pool[Math.floor(Math.random() * pool.length)];
        lootItems.push({ x, y, kind: 'weapon', weaponId: wid, label: wid, color: WEAPONS[wid].color, bob: Math.random() * 6 });
      } else if (roll < 0.72) {
        lootItems.push({ x, y, kind: 'medkit', label: 'MEDKIT', color: '#4ade80', bob: Math.random() * 6 });
      } else {
        const lv = Math.min(3, Math.max(1, Math.floor(Math.random() * 3) + 1));
        lootItems.push({ x, y, kind: 'armor', level: lv, label: `VEST Lv.${lv}`, color: '#38bdf8', bob: Math.random() * 6 });
      }
    } else if (type === 'deathbox') {
      lootItems.push({ x, y, kind: 'deathbox', weaponId: specific.weaponId, label: `LOOT (${specific.weaponId})`, color: '#fbbf24', bob: 0 });
    } else if (type === 'airdrop') {
      lootItems.push({ x, y, kind: 'airdrop', weaponId: 'AWM', label: 'AIRDROP: AWM + LV.3', color: '#f43f5e', bob: 0 });
    }
  }

  // ---------- ENTITY CREATION ----------
  function createUnit(isPlayer, name, x, y, tier = 'normal', isBoss = false) {
    const startWep = isPlayer
      ? makeWeaponInstance(WEAPONS[profile.weapon] ? profile.weapon : 'M4A1')
      : makeWeaponInstance(isBoss ? 'M4A1' : (tier === 'sharp' && Math.random() < 0.35 ? 'AWM' : ['M4A1', 'MP40', 'M1887'][Math.floor(Math.random() * 3)]));

    const armorLv = isPlayer ? currentLevel.startArmor : (isBoss ? 3 : (tier === 'pro' ? 2 : tier === 'sharp' ? 1 : 0));
    const armorMax = armorLv * 40;

    return {
      isPlayer,
      isBoss,
      name,
      x, y,
      vx: 0, vy: 0,
      r: isBoss ? 22 : 16,
      angle: 0,
      hp: isBoss ? 280 : 100,
      maxHp: isBoss ? 280 : 100,
      armor: armorMax,
      maxArmor: armorMax,
      armorLevel: armorLv,
      slots: [startWep, null, makeWeaponInstance('G18')],
      activeSlot: 0,
      fireCooldown: 0,
      medkits: isPlayer ? 2 : 1,
      healing: 0,
      scoping: false,
      sprinting: false,
      kills: 0,
      damageDealt: 0,
      alive: true,
      // Articulated Animation States
      animCycle: Math.random() * 10,
      stepTimer: 0,
      recoilKick: 0,
      moveSpeedRatio: 0, // 0 idle, ~0.6 walk, 1.0 run
      // AI properties
      tier,
      aiState: 'roam',
      aiTarget: null,
      aiMoveX: x,
      aiMoveY: y,
      aiThinkTimer: rand(0.2, 0.8),
      aiStrafeDir: Math.random() < 0.5 ? 1 : -1,
      aiStrafeTimer: rand(0.6, 1.8),
      shirtColor: isPlayer ? getOutfit().color : (isBoss ? '#dc2626' : ['#3b82f6', '#8b5cf6', '#10b981', '#ec4899', '#64748b'][Math.floor(Math.random() * 5)])
    };
  }

  function findClearSpawn(minDistFromPlayer = 0) {
    for (let tries = 0; tries < 80; tries++) {
      const x = rand(180, WORLD_SIZE - 180);
      const y = rand(180, WORLD_SIZE - 180);
      if (player && minDistFromPlayer > 0 && dist(x, y, player.x, player.y) < minDistFromPlayer) continue;
      if (collidesObstacles(x, y, 24)) continue;
      const tz = terrainAt(x, y);
      if (tz && tz.kind === 'water') continue;
      if (citadel && x > citadel.x - 60 && x < citadel.x + citadel.w + 60 && y > citadel.y - 60 && y < citadel.y + citadel.h + 60) continue;
      return { x, y };
    }
    return { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 };
  }

  function startLevel(levelId) {
    audio.init();
    currentLevel = LEVELS.find(l => l.id === levelId) || LEVELS[0];
    selectedLevelId = currentLevel.id;
    matchTime = 0;
    bullets = [];
    particles = [];
    gunfireBlips = [];
    screenShake = 0;
    damageFlash = 0;
    airdropTimer = currentLevel.airdropInterval * 0.65;

    generateMap(currentLevel);

    const pSpawn = findClearSpawn(0);
    player = createUnit(true, 'YOU', pSpawn.x, pSpawn.y);

    bots = [];
    const shuffled = [...BOT_NAMES].sort(() => Math.random() - 0.5);
    for (let i = 0; i < currentLevel.enemies; i++) {
      const sp = findClearSpawn(320);
      bots.push(createUnit(false, shuffled[i % shuffled.length], sp.x, sp.y, currentLevel.botTier, false));
    }
    if (currentLevel.hasBoss) {
      const bsp = citadel ? { x: WORLD_SIZE / 2, y: WORLD_SIZE / 2 } : findClearSpawn(520);
      bots.push(createUnit(false, 'BOSS_CITADEL', bsp.x, bsp.y, 'pro', true));
    }

    zone = {
      x: WORLD_SIZE / 2, y: WORLD_SIZE / 2, radius: 1380,
      targetX: WORLD_SIZE / 2 + rand(-240, 240),
      targetY: WORLD_SIZE / 2 + rand(-240, 240),
      targetRadius: 820,
      phase: 1,
      timer: 24 / currentLevel.zoneSpeed,
      shrinking: false,
      dps: 3.5
    };

    cam.x = player.x;
    cam.y = player.y;
    cam.zoom = 1;

    initWeather();
    state = 'playing';
    ui.lobbyOverlay.classList.add('hidden');
    ui.pauseOverlay.classList.add('hidden');
    ui.endOverlay.classList.add('hidden');
    ui.hud.classList.remove('hidden');
    ui.killFeed.innerHTML = '';
    ui.hudLevelTag.textContent = `LVL ${currentLevel.id}`;
    ui.bossPill.style.display = currentLevel.hasBoss ? 'inline' : 'none';
    syncSettingsUI();
    showAlert(`${currentLevel.icon} LEVEL ${currentLevel.id}: ${currentLevel.name.toUpperCase()} — ${currentLevel.intro}`, 4.6);
    updateHud();
  }

  // ---------- COLLISIONS ----------
  function circleRectCollide(cx, cy, cr, rx, ry, rw, rh) {
    const closestX = clamp(cx, rx, rx + rw);
    const closestY = clamp(cy, ry, ry + rh);
    return dist(cx, cy, closestX, closestY) < cr;
  }

  const TERRAIN_FX = {
    water: { speed: 0.5 }, quicksand: { speed: 0.6 }, drift: { speed: 0.72 },
    ice: { speed: 1.1, slip: true }, boost: { speed: 1.45 }
  };
  function inTerrainRect(t, x, y) {
    if (t.round) {
      const nx = (x - (t.x + t.w / 2)) / (t.w / 2);
      const ny = (y - (t.y + t.h / 2)) / (t.h / 2);
      return nx * nx + ny * ny <= 1;
    }
    return x >= t.x && x <= t.x + t.w && y >= t.y && y <= t.y + t.h;
  }
  function terrainAt(x, y) {
    for (let i = 0; i < bridges.length; i++) {
      const b = bridges[i];
      if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return null;
    }
    for (let i = 0; i < terrain.length; i++) {
      if (inTerrainRect(terrain[i], x, y)) return terrain[i];
    }
    return null;
  }
  function inWater(x, y) {
    const t = terrainAt(x, y);
    return !!(t && (t.kind === 'water' || t.kind === 'quicksand'));
  }
  function rectHitsTerrain(x, y, w, h) {
    const pts = [[x, y], [x + w, y], [x, y + h], [x + w, y + h], [x + w / 2, y + h / 2]];
    return pts.some(([px, py]) => { const t = terrainAt(px, py); return t && t.kind !== 'boost'; });
  }

  function collidesObstacles(x, y, r) {
    if (x < r || x > WORLD_SIZE - r || y < r || y > WORLD_SIZE - r) return true;
    for (let i = 0; i < rocks.length; i++) {
      if (dist(x, y, rocks[i].x, rocks[i].y) < r + rocks[i].r) return true;
    }
    for (let i = 0; i < trees.length; i++) {
      if (dist(x, y, trees[i].x, trees[i].y) < r + trees[i].trunkR) return true;
    }
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      if (circleRectCollide(x, y, r, w.x, w.y, w.w, w.h)) return true;
    }
    return false;
  }

  function resolveUnitMovement(u, dx, dy) {
    const tr = terrainAt(u.x, u.y);
    const fx = tr ? TERRAIN_FX[tr.kind] : null;
    u.terrainKind = tr ? tr.kind : null;
    u.onIce = !!(fx && fx.slip);
    if (fx) { dx *= fx.speed; dy *= fx.speed; }
    const nx = clamp(u.x + dx, u.r, WORLD_SIZE - u.r);
    if (!collidesObstacles(nx, u.y, u.r)) u.x = nx;
    const ny = clamp(u.y + dy, u.r, WORLD_SIZE - u.r);
    if (!collidesObstacles(u.x, ny, u.r)) u.y = ny;
  }

  function hasLineOfSight(x1, y1, x2, y2) {
    const d = dist(x1, y1, x2, y2);
    const steps = Math.ceil(d / 28);
    for (let s = 1; s < steps; s++) {
      const t = s / steps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      for (let i = 0; i < rocks.length; i++) {
        if (dist(px, py, rocks[i].x, rocks[i].y) < rocks[i].r) return false;
      }
      for (let i = 0; i < walls.length; i++) {
        const w = walls[i];
        if (px >= w.x && px <= w.x + w.w && py >= w.y && py <= w.y + w.h) return false;
      }
    }
    return true;
  }

  // ---------- COMBAT & WEAPON ACTIONS ----------
  function getActiveWeaponInst(u) {
    return u.slots[u.activeSlot] || u.slots[2];
  }

  function startReload(u) {
    const inst = getActiveWeaponInst(u);
    if (!inst || inst.reloading > 0) return;
    const def = WEAPONS[inst.id];
    if (inst.ammo >= def.magSize || inst.reserve <= 0) return;
    inst.reloading = def.reloadTime;
    if (u.isPlayer) audio.playReload(def.sound);
  }

  function fireWeapon(u) {
    const inst = getActiveWeaponInst(u);
    if (!inst || inst.reloading > 0 || u.fireCooldown > 0 || u.healing > 0) return;
    const def = WEAPONS[inst.id];
    if (inst.ammo <= 0) {
      startReload(u);
      return;
    }

    inst.ammo--;
    u.fireCooldown = def.fireRate;
    u.recoilKick = def.recoil;

    const muzzleDist = u.r + def.barrelLen;
    const mx = u.x + Math.cos(u.angle) * muzzleDist;
    const my = u.y + Math.sin(u.angle) * muzzleDist;

    const spreadMult = u.scoping ? 0.35 : (u.sprinting ? 1.45 : 1.0);
    for (let p = 0; p < def.pellets; p++) {
      const a = u.angle + (Math.random() - 0.5) * def.spread * spreadMult;
      bullets.push({
        owner: u,
        weaponName: def.name,
        x: mx, y: my,
        vx: Math.cos(a) * def.bulletSpeed,
        vy: Math.sin(a) * def.bulletSpeed,
        traveled: 0,
        maxRange: def.range,
        damage: def.damage * (u.isBoss ? 1.15 : 1),
        color: def.color,
        pierce: !!def.pierce,
        hitSet: new Set()
      });
    }

    // Muzzle flash & shell particles
    for (let i = 0; i < 4; i++) {
      const a = u.angle + rand(-0.45, 0.45);
      particles.push({
        x: mx, y: my,
        vx: Math.cos(a) * rand(80, 210),
        vy: Math.sin(a) * rand(80, 210),
        life: rand(0.06, 0.13),
        maxLife: 0.13,
        size: rand(2.5, 5),
        color: '#fef08a'
      });
    }

    const dToPlayer = player ? dist(u.x, u.y, player.x, player.y) : 9999;
    audio.playGun(def.sound, Math.max(0, 1 - dToPlayer / 950));
    if (u.isPlayer) screenShake = Math.min(8, screenShake + def.recoil * 0.45);

    gunfireBlips.push({ x: u.x, y: u.y, life: 1.6, isPlayer: u.isPlayer });

    if (inst.ammo === 0) startReload(u);
  }

  function applyDamage(target, amount, attacker, weaponName) {
    if (!target.alive) return;
    let dmg = amount;
    if (target.armor > 0) {
      const absorbed = Math.min(target.armor, dmg * 0.45);
      target.armor -= absorbed;
      dmg -= absorbed * 0.72;
    }
    target.hp -= dmg;
    if (attacker && attacker.isPlayer) {
      attacker.damageDealt += Math.round(dmg);
      audio.playHit();
    }
    if (target.isPlayer) {
      damageFlash = 0.35;
      screenShake = Math.min(10, screenShake + 4);
    }

    // Blood / spark particles
    for (let i = 0; i < 5; i++) {
      const a = rand(0, Math.PI * 2);
      particles.push({
        x: target.x, y: target.y,
        vx: Math.cos(a) * rand(50, 160),
        vy: Math.sin(a) * rand(50, 160),
        life: rand(0.18, 0.35),
        maxLife: 0.35,
        size: rand(2, 4),
        color: target.armor > 0 ? '#38bdf8' : '#ef4444'
      });
    }

    if (target.hp <= 0) {
      target.hp = 0;
      target.alive = false;
      if (attacker) {
        attacker.kills++;
        addKillFeed(attacker.name, target.name, weaponName);
        if (attacker.isPlayer) audio.playKill();
      } else {
        addKillFeed('BLUE ZONE', target.name, 'ZONE');
      }

      // Drop deathbox loot
      const dropWep = target.slots[0] ? target.slots[0].id : 'M4A1';
      spawnLoot(target.x, target.y, 'deathbox', { weaponId: dropWep });

      checkMatchEnd();
    }
  }

  function startMedkit(u) {
    if (!u.alive || u.medkits <= 0 || u.healing > 0 || u.hp >= u.maxHp) return;
    u.healing = 2.4;
    u.scoping = false;
    u.sprinting = false;
    if (u.isPlayer) audio.playHeal();
  }

  function tryPickupLoot(u, itemIndex) {
    const item = lootItems[itemIndex];
    if (!item) return;
    if (item.kind === 'medkit') {
      u.medkits = Math.min(5, u.medkits + 1);
    } else if (item.kind === 'armor') {
      if (item.level >= u.armorLevel) {
        u.armorLevel = item.level;
        u.maxArmor = item.level * 40;
        u.armor = u.maxArmor;
      } else {
        u.armor = Math.min(u.maxArmor, u.armor + 30);
      }
    } else if (item.kind === 'weapon' || item.kind === 'deathbox') {
      const wid = item.weaponId;
      // Put in empty primary slot, else replace active primary
      let targetSlot = u.slots[0] ? (u.slots[1] ? (u.activeSlot < 2 ? u.activeSlot : 0) : 1) : 0;
      if (u.slots[0] && u.slots[0].id === wid) {
        u.slots[0].reserve = Math.min(WEAPONS[wid].maxReserve, u.slots[0].reserve + WEAPONS[wid].magSize);
      } else if (u.slots[1] && u.slots[1].id === wid) {
        u.slots[1].reserve = Math.min(WEAPONS[wid].maxReserve, u.slots[1].reserve + WEAPONS[wid].magSize);
      } else {
        u.slots[targetSlot] = makeWeaponInstance(wid);
        if (u.isPlayer) u.activeSlot = targetSlot;
      }
      if (item.kind === 'deathbox') u.medkits = Math.min(5, u.medkits + 1);
    } else if (item.kind === 'airdrop') {
      u.slots[1] = makeWeaponInstance('AWM');
      u.armorLevel = 3;
      u.maxArmor = 120;
      u.armor = 120;
      u.medkits = Math.min(5, u.medkits + 2);
      if (u.isPlayer) {
        u.activeSlot = 1;
        showAlert('SUPPLY AIRDROP SECURED: AWM + LV.3 VEST!', 2.4);
      }
    }
    lootItems.splice(itemIndex, 1);
    if (u.isPlayer) audio.playPickup();
  }

  function findNearestLoot(u) {
    let bestIdx = -1;
    let bestD = 54;
    for (let i = 0; i < lootItems.length; i++) {
      const d = dist(u.x, u.y, lootItems[i].x, lootItems[i].y);
      if (d < bestD) { bestD = d; bestIdx = i; }
    }
    return bestIdx;
  }

  // ---------- UPDATE LOOP ----------
  function updateUnitTimers(u, dt) {
    if (u.fireCooldown > 0) u.fireCooldown -= dt;
    if (u.recoilKick > 0) u.recoilKick = Math.max(0, u.recoilKick - dt * 28);

    const inst = getActiveWeaponInst(u);
    if (inst && inst.reloading > 0) {
      inst.reloading -= dt;
      if (inst.reloading <= 0) {
        inst.reloading = 0;
        const def = WEAPONS[inst.id];
        const needed = def.magSize - inst.ammo;
        if (inst.reserve === Infinity) {
          inst.ammo = def.magSize;
        } else {
          const take = Math.min(needed, inst.reserve);
          inst.ammo += take;
          inst.reserve -= take;
        }
      }
    }

    if (u.healing > 0) {
      u.healing -= dt;
      if (u.healing <= 0) {
        u.healing = 0;
        u.medkits = Math.max(0, u.medkits - 1);
        u.hp = Math.min(u.maxHp, u.hp + 60);
      }
    }

    // Blue Zone Damage
    if (dist(u.x, u.y, zone.x, zone.y) > zone.radius) {
      applyDamage(u, zone.dps * dt, null, 'ZONE');
    }
  }

  function updateLimbAnimation(u, speed, maxWalk, maxRun, dt) {
    if (speed > 12) {
      const running = speed > maxWalk * 1.12;
      u.moveSpeedRatio = clamp(speed / maxRun, 0.2, 1.0);
      const cadence = running ? 14.5 : 9.2;
      u.animCycle += dt * cadence;

      u.stepTimer -= dt;
      if (u.stepTimer <= 0) {
        u.stepTimer = running ? 0.25 : 0.38;
        if (u.isPlayer) audio.playStep(running);
        if (u.terrainKind === 'water') {
          if (u.isPlayer) audio.playSplash();
          for (let k = 0; k < 3; k++) {
            particles.push({ x: u.x + rand(-8, 8), y: u.y + rand(-8, 8), vx: rand(-40, 40), vy: rand(-40, 40),
              life: 0.4, maxLife: 0.4, size: rand(2, 4), color: 'rgba(186,230,253,0.7)' });
          }
        }
        if (running) {
          // Sprint dust puff behind feet
          particles.push({
            x: u.x - Math.cos(u.angle) * 10 + rand(-5, 5),
            y: u.y - Math.sin(u.angle) * 10 + rand(-5, 5),
            vx: rand(-20, 20),
            vy: rand(-20, 20),
            life: 0.32,
            maxLife: 0.32,
            size: rand(3, 5.5),
            color: 'rgba(226, 232, 240, 0.45)'
          });
        }
      }
    } else {
      u.moveSpeedRatio = Math.max(0, u.moveSpeedRatio - dt * 6);
      u.animCycle += dt * 1.6; // subtle idle breathing
    }
  }

  function updatePlayer(dt) {
    if (!player.alive) return;
    const spdMul = SPEED_MULTIPLIERS[gameSpeedMode];

    let ix = 0, iy = 0;
    if (keys['KeyW'] || keys['ArrowUp']) iy -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) iy += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) ix -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) ix += 1;

    if (Math.hypot(touch.moveX, touch.moveY) > 0.1) {
      ix = touch.moveX;
      iy = touch.moveY;
    }

    const mag = Math.hypot(ix, iy);
    if (mag > 1) { ix /= mag; iy /= mag; }

    const wantsSprint = (keys['ShiftLeft'] || keys['ShiftRight'] || touch.sprinting) && mag > 0.2 && !player.scoping && player.healing <= 0;
    player.sprinting = wantsSprint;

    // Tactical speed profile: Walk 145, Sprint 195, Scope 95, Medkit 65
    let targetSpeed = 145;
    if (player.healing > 0) targetSpeed = 65;
    else if (player.scoping) targetSpeed = 95;
    else if (wantsSprint) targetSpeed = 195;
    targetSpeed *= spdMul;

    const targetVx = ix * targetSpeed;
    const targetVy = iy * targetSpeed;
    const smooth = 1 - Math.exp(-(player.onIce ? 2.6 : 12) * dt);
    player.vx += (targetVx - player.vx) * smooth;
    player.vy += (targetVy - player.vy) * smooth;

    resolveUnitMovement(player, player.vx * dt, player.vy * dt);
    updateLimbAnimation(player, Math.hypot(player.vx, player.vy), 145 * spdMul, 195 * spdMul, dt);

    // Aiming
    if (touch.aimActive && Math.hypot(touch.aimX, touch.aimY) > 0.15) {
      player.angle = Math.atan2(touch.aimY, touch.aimX);
    } else if (!touchControlsEnabled || !touch.aimActive) {
      const screenCx = window.innerWidth / 2;
      const screenCy = window.innerHeight / 2;
      mouse.worldX = cam.x + (mouse.x - screenCx) / cam.zoom;
      mouse.worldY = cam.y + (mouse.y - screenCy) / cam.zoom;
      if (!touchControlsEnabled || mouse.down) {
        player.angle = Math.atan2(mouse.worldY - player.y, mouse.worldX - player.x);
      } else if (mag > 0.15 && !touch.firing) {
        const moveAngle = Math.atan2(iy, ix);
        player.angle += angleDiff(player.angle, moveAngle) * Math.min(1, dt * 10);
      }
    }

    // Firing (Mouse or Touch Fire button or strong Aim-stick pull)
    const aimAutoFire = touch.aimActive && Math.hypot(touch.aimX, touch.aimY) > 0.72;
    if (mouse.down || touch.firing || aimAutoFire) {
      fireWeapon(player);
    }

    updateUnitTimers(player, dt);

    // Loot Prompt check
    const nearLootIdx = findNearestLoot(player);
    if (nearLootIdx >= 0) {
      ui.lootPromptBtn.textContent = `📦 [E] ${lootItems[nearLootIdx].label}`;
      ui.lootPromptBtn.classList.remove('hidden');
    } else {
      ui.lootPromptBtn.classList.add('hidden');
    }
  }

  function updateBots(dt) {
    const spdMul = SPEED_MULTIPLIERS[gameSpeedMode];
    const allUnits = [player, ...bots].filter(u => u && u.alive);

    for (let i = 0; i < bots.length; i++) {
      const b = bots[i];
      if (!b.alive) continue;
      updateUnitTimers(b, dt);

      // Speed profile by tier
      const tierWalk = b.tier === 'easy' ? 100 : (b.tier === 'normal' ? 115 : (b.tier === 'sharp' ? 122 : 128));
      const tierRun = b.tier === 'easy' ? 118 : (b.tier === 'normal' ? 132 : (b.tier === 'sharp' ? 140 : 148));
      const walkSpd = tierWalk * spdMul;
      const runSpd = tierRun * spdMul;

      b.aiThinkTimer -= dt;
      b.aiStrafeTimer -= dt;
      if (b.aiStrafeTimer <= 0) {
        b.aiStrafeDir *= -1;
        b.aiStrafeTimer = rand(0.9, 2.2);
      }

      // Heal if hurt
      if (b.hp < b.maxHp * 0.45 && b.medkits > 0 && b.healing <= 0) {
        startMedkit(b);
      }

      // Find nearest visible enemy (bots also fight each other!)
      if (b.aiThinkTimer <= 0) {
        b.aiThinkTimer = rand(0.3, 0.65);
        let nearest = null;
        let bestD = (b.tier === 'pro' || b.tier === 'sharp' ? 540 : 420) * (stormActive > 0 ? 0.6 : 1);
        for (let j = 0; j < allUnits.length; j++) {
          const other = allUnits[j];
          if (other === b || !other.alive) continue;
          const d = dist(b.x, b.y, other.x, other.y);
          if (d < bestD && hasLineOfSight(b.x, b.y, other.x, other.y)) {
            bestD = d;
            nearest = other;
          }
        }
        b.aiTarget = nearest;

        // If outside safe zone, prioritize moving inside
        const dZone = dist(b.x, b.y, zone.targetX, zone.targetY);
        if (dZone > zone.targetRadius * 0.85) {
          b.aiMoveX = zone.targetX + rand(-120, 120);
          b.aiMoveY = zone.targetY + rand(-120, 120);
        } else if (!b.aiTarget && dist(b.x, b.y, b.aiMoveX, b.aiMoveY) < 40) {
          b.aiMoveX = clamp(zone.targetX + rand(-zone.targetRadius * 0.75, zone.targetRadius * 0.75), 120, WORLD_SIZE - 120);
          b.aiMoveY = clamp(zone.targetY + rand(-zone.targetRadius * 0.75, zone.targetRadius * 0.75), 120, WORLD_SIZE - 120);
        }
      }

      let desiredVx = 0, desiredVy = 0;
      const dZone = dist(b.x, b.y, zone.x, zone.y);
      const mustRunZone = dZone > zone.radius * 0.88;

      if (mustRunZone) {
        const a = Math.atan2(zone.y - b.y, zone.x - b.x);
        desiredVx = Math.cos(a) * runSpd;
        desiredVy = Math.sin(a) * runSpd;
        b.angle += angleDiff(b.angle, a) * Math.min(1, dt * 6);
      } else if (b.aiTarget && b.aiTarget.alive) {
        const tx = b.aiTarget.x;
        const ty = b.aiTarget.y;
        const d = dist(b.x, b.y, tx, ty);
        const aimAngle = Math.atan2(ty - b.y, tx - b.x);
        const turnRate = b.tier === 'easy' ? 4.2 : (b.tier === 'normal' ? 5.8 : 7.5);
        b.angle += angleDiff(b.angle, aimAngle) * Math.min(1, dt * turnRate);

        // Tactical strafe + spacing
        const idealDist = b.slots[0]?.id === 'M1887' ? 140 : (b.slots[0]?.id === 'AWM' ? 380 : 250);
        let moveAngle = aimAngle + (Math.PI / 2) * b.aiStrafeDir;
        if (d > idealDist + 55) moveAngle = aimAngle + 0.35 * b.aiStrafeDir;
        else if (d < idealDist - 55) moveAngle = aimAngle + Math.PI + 0.35 * b.aiStrafeDir;

        const combatSpd = b.healing > 0 ? walkSpd * 0.5 : walkSpd * 0.88;
        desiredVx = Math.cos(moveAngle) * combatSpd;
        desiredVy = Math.sin(moveAngle) * combatSpd;

        const aimTolerance = b.tier === 'easy' ? 0.28 : (b.tier === 'normal' ? 0.2 : 0.14);
        if (Math.abs(angleDiff(b.angle, aimAngle)) < aimTolerance && hasLineOfSight(b.x, b.y, tx, ty)) {
          const fireChance = b.tier === 'easy' ? 0.38 : (b.tier === 'normal' ? 0.58 : 0.78);
          if (Math.random() < fireChance) fireWeapon(b);
        }
      } else {
        const a = Math.atan2(b.aiMoveY - b.y, b.aiMoveX - b.x);
        const d = dist(b.x, b.y, b.aiMoveX, b.aiMoveY);
        if (d > 24) {
          desiredVx = Math.cos(a) * walkSpd;
          desiredVy = Math.sin(a) * walkSpd;
          b.angle += angleDiff(b.angle, a) * Math.min(1, dt * 5);
        }
      }

      const smooth = 1 - Math.exp(-8 * dt);
      b.vx += (desiredVx - b.vx) * smooth;
      b.vy += (desiredVy - b.vy) * smooth;

      const prevX = b.x, prevY = b.y;
      resolveUnitMovement(b, b.vx * dt, b.vy * dt);
      // Unstick if blocked
      if (Math.hypot(desiredVx, desiredVy) > 30 && dist(prevX, prevY, b.x, b.y) < 0.4) {
        b.aiMoveX = b.x + rand(-180, 180);
        b.aiMoveY = b.y + rand(-180, 180);
      }

      updateLimbAnimation(b, Math.hypot(b.vx, b.vy), walkSpd, runSpd, dt);

      // Opportunistic loot pickup
      const lootIdx = findNearestLoot(b);
      if (lootIdx >= 0 && Math.random() < 0.04) tryPickupLoot(b, lootIdx);
    }
  }

  function updateBullets(dt) {
    const units = [player, ...bots];
    for (let i = bullets.length - 1; i >= 0; i--) {
      const bl = bullets[i];
      const stepX = bl.vx * dt;
      const stepY = bl.vy * dt;
      bl.x += stepX;
      bl.y += stepY;
      bl.traveled += Math.hypot(stepX, stepY);

      if (bl.traveled >= bl.maxRange || bl.x < 0 || bl.x > WORLD_SIZE || bl.y < 0 || bl.y > WORLD_SIZE) {
        bullets.splice(i, 1);
        continue;
      }

      // Obstacle hit
      let hitObs = false;
      for (let r = 0; r < rocks.length; r++) {
        if (dist(bl.x, bl.y, rocks[r].x, rocks[r].y) < rocks[r].r) { hitObs = true; break; }
      }
      if (!hitObs) {
        for (let w = 0; w < walls.length; w++) {
          const wl = walls[w];
          if (bl.x >= wl.x && bl.x <= wl.x + wl.w && bl.y >= wl.y && bl.y <= wl.y + wl.h) { hitObs = true; break; }
        }
      }
      if (hitObs) {
        for (let k = 0; k < 3; k++) {
          particles.push({
            x: bl.x, y: bl.y,
            vx: rand(-90, 90), vy: rand(-90, 90),
            life: 0.16, maxLife: 0.16, size: 2.5, color: '#cbd5e1'
          });
        }
        bullets.splice(i, 1);
        continue;
      }

      // Unit hit
      let removeBullet = false;
      for (let uIdx = 0; uIdx < units.length; uIdx++) {
        const u = units[uIdx];
        if (!u || !u.alive || u === bl.owner || bl.hitSet.has(u)) continue;
        if (dist(bl.x, bl.y, u.x, u.y) < u.r + 3) {
          bl.hitSet.add(u);
          applyDamage(u, bl.damage, bl.owner, bl.weaponName);
          if (!bl.pierce) {
            removeBullet = true;
            break;
          }
        }
      }
      if (removeBullet) bullets.splice(i, 1);
    }
  }

  function updateZoneAndAirdrops(dt) {
    if (!zone.shrinking) {
      zone.timer -= dt;
      if (zone.timer <= 0) {
        zone.shrinking = true;
        showAlert(`⚠ BLUE ZONE PHASE ${zone.phase} SHRINKING!`, 2.5);
      }
    } else {
      const shrinkSpeed = 28 * currentLevel.zoneSpeed;
      zone.radius = Math.max(zone.targetRadius, zone.radius - shrinkSpeed * dt);
      zone.x += (zone.targetX - zone.x) * dt * 0.45;
      zone.y += (zone.targetY - zone.y) * dt * 0.45;
      if (Math.abs(zone.radius - zone.targetRadius) < 2) {
        zone.shrinking = false;
        zone.phase++;
        zone.dps = 3.5 + zone.phase * 2.2;
        zone.timer = Math.max(10, (22 - zone.phase * 2) / currentLevel.zoneSpeed);
        zone.targetRadius = Math.max(85, zone.radius * 0.52);
        const shift = zone.radius * 0.22;
        zone.targetX = clamp(zone.x + rand(-shift, shift), 220, WORLD_SIZE - 220);
        zone.targetY = clamp(zone.y + rand(-shift, shift), 220, WORLD_SIZE - 220);
      }
    }

    // Periodic Supply Airdrops
    airdropTimer -= dt;
    if (airdropTimer <= 0) {
      airdropTimer = currentLevel.airdropInterval;
      const a = rand(0, Math.PI * 2);
      const d = rand(40, Math.max(60, zone.targetRadius * 0.65));
      const ax = clamp(zone.targetX + Math.cos(a) * d, 160, WORLD_SIZE - 160);
      const ay = clamp(zone.targetY + Math.sin(a) * d, 160, WORLD_SIZE - 160);
      spawnLoot(ax, ay, 'airdrop');
      showAlert('📦 SUPPLY AIRDROP DEPLOYED! Check Radar', 2.8);
    }
  }

  function updateParticlesAndEffects(dt) {
    updateWeather(dt);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
    for (let i = gunfireBlips.length - 1; i >= 0; i--) {
      gunfireBlips[i].life -= dt;
      if (gunfireBlips[i].life <= 0) gunfireBlips.splice(i, 1);
    }
    for (let i = 0; i < trees.length; i++) {
      const tr = trees[i];
      const under = player && dist(player.x, player.y, tr.x, tr.y) < tr.canopyR + 12;
      const targetA = under ? 0.36 : 1.0;
      tr.alpha += (targetA - tr.alpha) * Math.min(1, dt * 8);
    }
    if (screenShake > 0) screenShake = Math.max(0, screenShake - dt * 24);
    if (damageFlash > 0) damageFlash = Math.max(0, damageFlash - dt * 1.4);
    if (alertTimeout > 0) {
      alertTimeout -= dt;
      if (alertTimeout <= 0) ui.alertBanner.classList.add('hidden');
    }
  }

  let lastFirstClear = false;
  function checkMatchEnd() {
    if (state !== 'playing') return;
    const aliveBots = bots.filter(b => b.alive).length;
    if (!player.alive) {
      endMatch(false, aliveBots + 1);
    } else if (aliveBots === 0) {
      lastFirstClear = !clearedLevels.has(currentLevel.id);
      clearedLevels.add(currentLevel.id);
      saveProgress();
      endMatch(true, 1);
    }
  }

  function endMatch(victory, rank) {
    state = 'ended';
    ui.touchControls.classList.add('hidden');
    ui.endOverlay.classList.remove('hidden');

    ui.endBadge.textContent = victory ? `LEVEL ${currentLevel.id} CLEARED` : 'ELIMINATED';
    ui.endTitle.textContent = victory ? 'BOOYAH!' : 'DEFEATED';
    ui.endTitle.classList.toggle('lose', !victory);
    ui.endSubtitle.textContent = `Level ${currentLevel.id} — ${currentLevel.name}`;

    ui.statRank.textContent = `#${rank}`;
    ui.statKills.textContent = `${player.kills}`;
    ui.statDamage.textContent = `${player.damageDealt}`;
    const mins = String(Math.floor(matchTime / 60)).padStart(2, '0');
    const secs = String(Math.floor(matchTime % 60)).padStart(2, '0');
    ui.statTime.textContent = `${mins}:${secs}`;

    const rewardEl = document.getElementById('endReward');
    if (rewardEl) rewardEl.textContent = awardMatchRewards(victory, lastFirstClear);
    lastFirstClear = false;

    const hasNext = victory && currentLevel.id < LEVELS.length;
    ui.nextLevelBtn.classList.toggle('hidden', !hasNext);
    if (hasNext) ui.nextLevelBtn.textContent = `Level ${currentLevel.id + 1} ▶`;
    renderLevelCards();
  }

  // ---------- RENDERING ----------
  function drawArticulatedUnit(u) {
    ctx.save();
    ctx.translate(u.x, u.y);

    // Boss aura
    if (u.isBoss) {
      ctx.beginPath();
      ctx.arc(0, 0, u.r + 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.65)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    ctx.rotate(u.angle);

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.32)';
    ctx.beginPath();
    ctx.ellipse(-2, 3, u.r * 1.05, u.r * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Articulated legs: hip -> knee -> boot. Legs alternate (walk / run stride),
    // the swinging foot lifts (bigger boot) and the knee bends outward.
    const isRun = u.sprinting && u.moveSpeedRatio > 0.5;
    const stride = u.moveSpeedRatio * (isRun ? 15 : 10);
    const hipY = u.r * 0.36;
    const pants = u.isBoss ? '#7f1d1d' : '#273449';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const side of [-1, 1]) {
      const cyc = u.animCycle + (side > 0 ? Math.PI : 0);
      const lift = Math.max(0, Math.cos(cyc)) * u.moveSpeedRatio;
      const footX = Math.sin(cyc) * stride;
      const kneeX = footX * 0.5 + (isRun ? 3 : 1.5) * lift;
      const kneeY = side * (hipY + 1.8 + lift * 1.6);
      const footY = side * (hipY + 1.2);
      ctx.strokeStyle = pants;
      ctx.lineWidth = 6.4;
      ctx.beginPath();
      ctx.moveTo(0, side * hipY);
      ctx.lineTo(kneeX, kneeY);
      ctx.lineTo(footX, footY);
      ctx.stroke();
      ctx.fillStyle = '#0b1220';
      ctx.beginPath(); ctx.arc(kneeX, kneeY, 2.3, 0, Math.PI * 2); ctx.fill();
      const bs = 1 + lift * 0.22;
      ctx.fillStyle = '#111827';
      ctx.beginPath(); ctx.roundRect(footX - 4.5 * bs, footY - 3.4 * bs, 12 * bs, 6.8 * bs, 3); ctx.fill();
      ctx.fillStyle = u.isPlayer ? '#f59e0b' : '#64748b';
      ctx.fillRect(footX + 3.2 * bs, footY - 1, 2.4 * bs, 2);
    }

    // Subtle body sway while running
    const swayY = Math.sin(u.animCycle) * u.moveSpeedRatio * 1.4;
    const kick = -u.recoilKick;

    // Shoulders / Torso
    ctx.fillStyle = u.shirtColor;
    ctx.beginPath();
    ctx.ellipse(0, swayY, u.r * 0.72, u.r * 0.96, Math.sin(u.animCycle) * u.moveSpeedRatio * 0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Armor Vest Overlay
    if (u.armor > 0) {
      ctx.fillStyle = u.armorLevel >= 3 ? '#0284c7' : (u.armorLevel === 2 ? '#334155' : '#475569');
      ctx.beginPath();
      ctx.roundRect(-7, swayY - u.r * 0.65, 14, u.r * 1.3, 4);
      ctx.fill();
    }

    // Active Weapon + Articulated Arms gripping gun
    const inst = getActiveWeaponInst(u);
    const def = WEAPONS[inst ? inst.id : 'G18'];
    const gunX = u.r * 0.45 + kick;
    const gunY = 3 + swayY + Math.sin(u.animCycle * 2) * u.moveSpeedRatio * 0.9;

    // AWM Laser Sight
    if (def.laser && (u.isPlayer || u.scoping)) {
      ctx.beginPath();
      ctx.moveTo(gunX + def.barrelLen, gunY);
      ctx.lineTo(gunX + def.barrelLen + 260, gunY);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.38)';
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    // Jointed arms: elbows and wrists subtly move with each walk/run cycle.
    // Both hands stay on the weapon while the shoulder/elbow joints animate.
    ctx.strokeStyle = '#e2b48d';
    ctx.lineWidth = 4.6;
    ctx.lineCap = 'round';
    const armSwing = Math.sin(u.animCycle + Math.PI / 2) * u.moveSpeedRatio * (u.sprinting ? 5.2 : 3.0);
    const supportShoulder = { x: 1, y: -u.r * 0.72 + swayY };
    const supportElbow = { x: gunX - 5 + armSwing, y: gunY - 8 - armSwing * 0.35 };
    const supportHand = { x: gunX + def.barrelLen * 0.48, y: gunY - 1 };
    ctx.beginPath();
    ctx.moveTo(supportShoulder.x, supportShoulder.y);
    ctx.lineTo(supportElbow.x, supportElbow.y);
    ctx.lineTo(supportHand.x, supportHand.y);
    ctx.stroke();

    const triggerShoulder = { x: 0, y: u.r * 0.72 + swayY };
    const triggerElbow = { x: gunX - 8 - armSwing * 0.65, y: gunY + 10 + armSwing * 0.25 };
    const triggerHand = { x: gunX + 3, y: gunY + 2 };
    ctx.beginPath();
    ctx.moveTo(triggerShoulder.x, triggerShoulder.y);
    ctx.lineTo(triggerElbow.x, triggerElbow.y);
    ctx.lineTo(triggerHand.x, triggerHand.y);
    ctx.stroke();

    // Small elbow joint details make the limb articulation readable at game scale.
    ctx.fillStyle = '#d6a47e';
    ctx.beginPath();
    ctx.arc(supportElbow.x, supportElbow.y, 2.1, 0, Math.PI * 2);
    ctx.arc(triggerElbow.x, triggerElbow.y, 2.1, 0, Math.PI * 2);
    ctx.fill();

    // Gun Body & Barrel
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(gunX - 3, gunY - def.bodyW / 2, def.barrelLen + 3, def.bodyW);
    ctx.fillStyle = def.color;
    ctx.fillRect(gunX + 2, gunY - def.bodyW / 2 + 1, Math.max(6, def.barrelLen * 0.45), def.bodyW - 2);

    // Head / Tactical Helmet
    ctx.fillStyle = '#f1c27d';
    ctx.beginPath();
    ctx.arc(1, swayY, u.r * 0.52, 0, Math.PI * 2);
    ctx.fill();

    // Helmet / Hair cap
    ctx.fillStyle = u.isPlayer ? '#1e293b' : (u.isBoss ? '#f59e0b' : '#334155');
    ctx.beginPath();
    ctx.arc(-1, swayY, u.r * 0.54, Math.PI * 0.55, Math.PI * 1.45);
    ctx.fill();

    ctx.restore();

    // Overhead Name & Compact HP Bar (Bots + Player Healing Bar)
    if (!u.isPlayer) {
      const bw = u.isBoss ? 46 : 30;
      const bx = u.x - bw / 2;
      const by = u.y - u.r - 12;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      ctx.fillRect(bx, by, bw, 4);
      ctx.fillStyle = u.isBoss ? '#fbbf24' : '#ef4444';
      ctx.fillRect(bx, by, bw * (u.hp / u.maxHp), 4);
      if (u.isBoss) {
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('👑 BOSS_CITADEL', u.x, by - 3);
      }
    } else if (u.healing > 0) {
      const pct = 1 - u.healing / 2.4;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(u.x - 20, u.y - u.r - 14, 40, 5);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(u.x - 20, u.y - u.r - 14, 40 * pct, 5);
    } else {
      const inst = getActiveWeaponInst(u);
      if (inst && inst.reloading > 0) {
        const pct = 1 - inst.reloading / WEAPONS[inst.id].reloadTime;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(u.x - 20, u.y - u.r - 14, 40, 4);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(u.x - 20, u.y - u.r - 14, 40 * pct, 4);
      }
    }
  }

  function renderGame() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const colors = currentLevel.colors;

    ctx.fillStyle = '#070b12';
    ctx.fillRect(0, 0, vw, vh);

    if (!player) return;

    // Camera smooth follow + Scope Zoom
    const desiredZoom = player.scoping ? 0.78 : 1.0;
    cam.zoom += (desiredZoom - cam.zoom) * 0.1;

    const lookAhead = player.scoping ? 95 : 28;
    const targetCamX = player.x + Math.cos(player.angle) * lookAhead;
    const targetCamY = player.y + Math.sin(player.angle) * lookAhead;
    cam.x += (targetCamX - cam.x) * 0.12;
    cam.y += (targetCamY - cam.y) * 0.12;

    const shakeX = (Math.random() - 0.5) * screenShake;
    const shakeY = (Math.random() - 0.5) * screenShake;

    ctx.save();
    ctx.translate(vw / 2 + shakeX, vh / 2 + shakeY);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);

    // Map Terrain Ground
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, WORLD_SIZE, WORLD_SIZE);

    // Grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= WORLD_SIZE; x += 100) {
      ctx.moveTo(x, 0); ctx.lineTo(x, WORLD_SIZE);
    }
    for (let y = 0; y <= WORLD_SIZE; y += 100) {
      ctx.moveTo(0, y); ctx.lineTo(WORLD_SIZE, y);
    }
    ctx.stroke();

    // Map Boundary
    ctx.strokeStyle = 'rgba(239,68,68,0.6)';
    ctx.lineWidth = 6;
    ctx.strokeRect(0, 0, WORLD_SIZE, WORLD_SIZE);

    drawTerrain();

    // Compound Floors
    ctx.fillStyle = colors.floor;
    for (let i = 0; i < floors.length; i++) {
      const f = floors[i];
      ctx.fillRect(f.x, f.y, f.w, f.h);
    }

    drawCitadelDecor();

    // Loot Items
    const now = performance.now() / 1000;
    for (let i = 0; i < lootItems.length; i++) {
      const l = lootItems[i];
      const pulse = 1 + Math.sin(now * 4 + l.bob) * 0.12;
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.beginPath();
      ctx.arc(0, 0, (l.kind === 'airdrop' ? 16 : 11) * pulse, 0, Math.PI * 2);
      ctx.fillStyle = l.kind === 'airdrop' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255,255,255,0.12)';
      ctx.fill();
      ctx.fillStyle = l.color;
      if (l.kind === 'airdrop' || l.kind === 'deathbox') {
        ctx.fillRect(-9, -9, 18, 18);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-9, -9, 18, 18);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(l.label, 0, -13);
      ctx.restore();
    }

    // Walls
    ctx.fillStyle = colors.wall;
    for (let i = 0; i < walls.length; i++) {
      const w = walls[i];
      ctx.fillRect(w.x, w.y, w.w, w.h);
      if (currentLevel.theme === 'neon') {
        ctx.strokeStyle = 'rgba(34,211,238,0.9)';
        ctx.lineWidth = 2.2;
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,0.45)';
        ctx.lineWidth = 1.5;
      }
      ctx.strokeRect(w.x, w.y, w.w, w.h);
    }

    // Rocks
    for (let i = 0; i < rocks.length; i++) {
      const r = rocks[i];
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.arc(r.x + 4, r.y + 5, r.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.rock;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Bullets
    for (let i = 0; i < bullets.length; i++) {
      const bl = bullets[i];
      ctx.strokeStyle = bl.color;
      ctx.lineWidth = bl.pierce ? 3 : 2.2;
      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y);
      ctx.lineTo(bl.x - bl.vx * 0.022, bl.y - bl.vy * 0.022);
      ctx.stroke();
    }

    // Units (Bots & Player)
    for (let i = 0; i < bots.length; i++) {
      if (bots[i].alive) drawArticulatedUnit(bots[i]);
    }
    if (player.alive) drawArticulatedUnit(player);

    // Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.globalAlpha = clamp(p.life / p.maxLife, 0, 1);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Trees (Rendered ABOVE units so canopies provide cover & turn semi-transparent!)
    for (let i = 0; i < trees.length; i++) {
      const tr = trees[i];
      ctx.fillStyle = '#4a3520';
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.trunkR, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = tr.alpha;
      ctx.fillStyle = colors.tree;
      ctx.beginPath();
      ctx.arc(tr.x, tr.y, tr.canopyR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = colors.treeTop;
      ctx.beginPath();
      ctx.arc(tr.x - 6, tr.y - 6, tr.canopyR * 0.68, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Next Safe Zone White Dashed Ring
    ctx.setLineDash([10, 8]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(zone.targetX, zone.targetY, zone.targetRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Active Blue Zone Ring + Outer Tint
    ctx.save();
    ctx.beginPath();
    ctx.rect(-600, -600, WORLD_SIZE + 1200, WORLD_SIZE + 1200);
    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(14, 165, 233, 0.18)';
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();

    drawWeather(vw, vh);

    // Vignettes
    ui.damageVignette.style.opacity = String(damageFlash);
    const outsideZone = dist(player.x, player.y, zone.x, zone.y) > zone.radius;
    ui.zoneVignette.style.opacity = outsideZone ? '0.75' : '0';

    renderMinimap();
  }

  function renderMinimap() {
    const s = miniCanvas.width;
    const scale = s / WORLD_SIZE;
    miniCtx.clearRect(0, 0, s, s);
    miniCtx.fillStyle = currentLevel.colors.bg;
    miniCtx.fillRect(0, 0, s, s);
    for (const t of terrain) {
      miniCtx.fillStyle = t.kind === 'water' ? 'rgba(59,130,246,0.75)' : t.kind === 'ice' ? 'rgba(186,230,253,0.85)'
        : t.kind === 'quicksand' ? 'rgba(120,80,30,0.75)' : t.kind === 'boost' ? 'rgba(34,211,238,0.9)' : 'rgba(255,255,255,0.7)';
      miniCtx.fillRect(t.x * scale, t.y * scale, t.w * scale, t.h * scale);
    }
    miniCtx.fillStyle = '#a16207';
    for (const b of bridges) miniCtx.fillRect(b.x * scale, b.y * scale, b.w * scale, b.h * scale);
    if (citadel) {
      miniCtx.strokeStyle = '#e879f9'; miniCtx.lineWidth = 1.5;
      miniCtx.strokeRect(citadel.x * scale, citadel.y * scale, citadel.w * scale, citadel.h * scale);
    }

    // Safe Zone & Blue Zone
    miniCtx.strokeStyle = '#38bdf8';
    miniCtx.lineWidth = 1.8;
    miniCtx.beginPath();
    miniCtx.arc(zone.x * scale, zone.y * scale, zone.radius * scale, 0, Math.PI * 2);
    miniCtx.stroke();

    miniCtx.strokeStyle = 'rgba(255,255,255,0.6)';
    miniCtx.lineWidth = 1;
    miniCtx.beginPath();
    miniCtx.arc(zone.targetX * scale, zone.targetY * scale, zone.targetRadius * scale, 0, Math.PI * 2);
    miniCtx.stroke();

    // Airdrops
    miniCtx.fillStyle = '#f43f5e';
    for (let i = 0; i < lootItems.length; i++) {
      if (lootItems[i].kind === 'airdrop') {
        miniCtx.fillRect(lootItems[i].x * scale - 2.5, lootItems[i].y * scale - 2.5, 5, 5);
      }
    }

    // Gunfire Blips
    for (let i = 0; i < gunfireBlips.length; i++) {
      const g = gunfireBlips[i];
      if (g.isPlayer) continue;
      miniCtx.fillStyle = `rgba(251, 146, 60, ${clamp(g.life / 1.6, 0, 1)})`;
      miniCtx.beginPath();
      miniCtx.arc(g.x * scale, g.y * scale, 3, 0, Math.PI * 2);
      miniCtx.fill();
    }

    // Nearby enemies & Boss
    for (let i = 0; i < bots.length; i++) {
      const b = bots[i];
      if (!b.alive) continue;
      if (b.isBoss || dist(player.x, player.y, b.x, b.y) < 380) {
        miniCtx.fillStyle = b.isBoss ? '#fbbf24' : '#ef4444';
        miniCtx.beginPath();
        miniCtx.arc(b.x * scale, b.y * scale, b.isBoss ? 3.2 : 2, 0, Math.PI * 2);
        miniCtx.fill();
      }
    }

    // Player Dot
    miniCtx.fillStyle = '#4ade80';
    miniCtx.beginPath();
    miniCtx.arc(player.x * scale, player.y * scale, 3, 0, Math.PI * 2);
    miniCtx.fill();
  }

  function updateHud() {
    if (!player) return;
    const aliveTotal = (player.alive ? 1 : 0) + bots.filter(b => b.alive).length;
    ui.aliveText.textContent = `👥 ${aliveTotal}`;
    ui.killsText.textContent = `💀 ${player.kills}`;

    const tSec = Math.max(0, Math.ceil(zone.timer));
    ui.zoneTimerText.textContent = zone.shrinking ? `⚠ SHRINKING` : `🛡 ZONE 00:${String(tSec).padStart(2, '0')}`;

    // HP & Armor
    const hpPct = clamp((player.hp / player.maxHp) * 100, 0, 100);
    ui.hpLabel.textContent = `HP ${Math.ceil(player.hp)}`;
    ui.hpFill.style.width = `${hpPct}%`;
    ui.hpFill.classList.toggle('low', hpPct < 30);

    const armorPct = player.maxArmor > 0 ? clamp((player.armor / player.maxArmor) * 100, 0, 100) : 0;
    ui.armorLabel.textContent = `VEST ${player.armorLevel}`;
    ui.armorFill.style.width = `${armorPct}%`;

    // Medkit badge & progress ring
    ui.medkitCount.textContent = String(player.medkits);
    const healOffset = player.healing > 0 ? 94.2 * (player.healing / 2.4) : 94.2;
    ui.healRingProgress.style.strokeDashoffset = String(healOffset);

    // Weapon slots
    for (let s = 0; s < 3; s++) {
      const slotEl = document.querySelector(`.w-slot[data-slot="${s}"]`);
      const inst = player.slots[s];
      const nameEl = document.getElementById(`slot${s}Name`);
      const ammoEl = document.getElementById(`slot${s}Ammo`);
      slotEl.classList.toggle('active', player.activeSlot === s);
      if (inst) {
        nameEl.textContent = inst.id;
        ammoEl.textContent = inst.reloading > 0
          ? 'RLD...'
          : `${inst.ammo}/${inst.reserve === Infinity ? '∞' : inst.reserve}`;
      } else {
        nameEl.textContent = 'EMPTY';
        ammoEl.textContent = '--';
      }
    }

    // Boss indicator
    if (currentLevel.hasBoss) {
      const bossAlive = bots.some(b => b.isBoss && b.alive);
      ui.bossPill.textContent = bossAlive ? '👑 BOSS ALIVE' : '👑 BOSS SLAIN';
    }
  }

  // ---------- MAIN ANIMATION LOOP (Delta-Time Clamped <= 0.05s) ----------
  let lastTs = performance.now();
  function loop(ts) {
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    if (state === 'playing') {
      matchTime += dt;
      updatePlayer(dt);
      updateBots(dt);
      updateBullets(dt);
      updateZoneAndAirdrops(dt);
      updateParticlesAndEffects(dt);
      updateHud();
    }

    if (state === 'lobby') renderLobby(dt);
    else renderGame();
    requestAnimationFrame(loop);
  }

  // ---------- EVENT LISTENERS ----------
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 150));

  window.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (state !== 'playing') return;
    if (e.code === 'Digit1' && player.slots[0]) player.activeSlot = 0;
    if (e.code === 'Digit2' && player.slots[1]) player.activeSlot = 1;
    if (e.code === 'Digit3') player.activeSlot = 2;
    if (e.code === 'KeyR') startReload(player);
    if (e.code === 'KeyQ') player.scoping = !player.scoping;
    if (e.code === 'KeyH' || e.code === 'Digit4') startMedkit(player);
    if (e.code === 'KeyE') {
      const idx = findNearestLoot(player);
      if (idx >= 0) tryPickupLoot(player, idx);
    }
    if (e.code === 'Escape' || e.code === 'KeyP') togglePause();
  });

  window.addEventListener('keyup', e => { keys[e.code] = false; });

  canvas.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  canvas.addEventListener('mousedown', e => {
    audio.init();
    if (state !== 'playing') return;
    if (e.button === 0) mouse.down = true;
    if (e.button === 2) player.scoping = !player.scoping;
  });
  window.addEventListener('mouseup', e => {
    if (e.button === 0) mouse.down = false;
  });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  canvas.addEventListener('wheel', e => {
    if (state !== 'playing') return;
    const dir = e.deltaY > 0 ? 1 : -1;
    for (let k = 0; k < 3; k++) {
      const next = (player.activeSlot + dir + 3) % 3;
      player.activeSlot = next;
      if (player.slots[next]) break;
    }
  });

  // Weapon Slot Clicks
  document.querySelectorAll('.w-slot').forEach(btn => {
    btn.addEventListener('click', () => {
      if (state !== 'playing') return;
      const s = Number(btn.dataset.slot);
      if (player.slots[s]) player.activeSlot = s;
    });
  });

  ui.lootPromptBtn.addEventListener('click', () => {
    if (state !== 'playing') return;
    const idx = findNearestLoot(player);
    if (idx >= 0) tryPickupLoot(player, idx);
  });

  // Dual Virtual Joystick Binding
  function bindJoystick(baseEl, knobEl, onChange, onEnd) {
    let activeId = null;
    const maxR = 32;

    function handleMove(clientX, clientY) {
      const rect = baseEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > maxR) { dx = (dx / d) * maxR; dy = (dy / d) * maxR; }
      knobEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      onChange(dx / maxR, dy / maxR);
    }

    baseEl.addEventListener('pointerdown', e => {
      audio.init();
      activeId = e.pointerId;
      baseEl.setPointerCapture(e.pointerId);
      baseEl.classList.add('active');
      handleMove(e.clientX, e.clientY);
    });
    baseEl.addEventListener('pointermove', e => {
      if (e.pointerId !== activeId) return;
      handleMove(e.clientX, e.clientY);
    });
    const finish = e => {
      if (e.pointerId !== activeId) return;
      activeId = null;
      baseEl.classList.remove('active');
      knobEl.style.transform = 'translate(-50%, -50%)';
      onEnd();
    };
    baseEl.addEventListener('pointerup', finish);
    baseEl.addEventListener('pointercancel', finish);
  }

  bindJoystick(
    ui.moveStickBase, ui.moveStickKnob,
    (x, y) => { touch.moveX = x; touch.moveY = y; },
    () => { touch.moveX = 0; touch.moveY = 0; }
  );

  bindJoystick(
    ui.aimStickBase, ui.aimStickKnob,
    (x, y) => { touch.aimActive = true; touch.aimX = x; touch.aimY = y; },
    () => { touch.aimActive = false; touch.aimX = 0; touch.aimY = 0; }
  );

  // Touch Action Buttons
  ui.touchFireBtn.addEventListener('pointerdown', e => { e.preventDefault(); audio.init(); touch.firing = true; ui.touchFireBtn.classList.add('active'); });
  const stopFire = () => { touch.firing = false; ui.touchFireBtn.classList.remove('active'); };
  ui.touchFireBtn.addEventListener('pointerup', stopFire);
  ui.touchFireBtn.addEventListener('pointercancel', stopFire);

  ui.touchSprintBtn.addEventListener('click', () => {
    touch.sprinting = !touch.sprinting;
    ui.touchSprintBtn.classList.toggle('active', touch.sprinting);
  });
  ui.touchScopeBtn.addEventListener('click', () => {
    if (!player) return;
    player.scoping = !player.scoping;
    ui.touchScopeBtn.classList.toggle('active', player.scoping);
  });
  ui.touchReloadBtn.addEventListener('click', () => { if (player) startReload(player); });
  ui.touchMedkitBtn.addEventListener('click', () => { if (player) startMedkit(player); });

  // Settings Selectors
  document.querySelectorAll('[data-speed]').forEach(btn => {
    btn.addEventListener('click', () => {
      gameSpeedMode = btn.dataset.speed;
      syncSettingsUI();
    });
  });
  document.querySelectorAll('[data-hud]').forEach(btn => {
    btn.addEventListener('click', () => {
      hudSizeMode = btn.dataset.hud;
      syncSettingsUI();
    });
  });

  // Top Bar & Modal Controls
  function togglePause() {
    if (state === 'playing') {
      state = 'paused';
      mouse.down = false;
      touch.firing = false;
      ui.pauseOverlay.classList.remove('hidden');
      ui.touchControls.classList.add('hidden');
    } else if (state === 'paused') {
      state = 'playing';
      ui.pauseOverlay.classList.add('hidden');
      syncSettingsUI();
    }
  }

  ui.pauseBtn.addEventListener('click', togglePause);
  ui.resumeBtn.addEventListener('click', togglePause);
  ui.restartBtn.addEventListener('click', () => startLevel(currentLevel.id));
  ui.quitLobbyBtn.addEventListener('click', goToLobby);
  ui.endLobbyBtn.addEventListener('click', goToLobby);
  ui.playBtn.addEventListener('click', () => startLevel(selectedLevelId));
  ui.playAgainBtn.addEventListener('click', () => startLevel(currentLevel.id));
  ui.nextLevelBtn.addEventListener('click', () => startLevel(Math.min(LEVELS.length, currentLevel.id + 1)));

  ui.soundToggleBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    ui.soundToggleBtn.textContent = audio.muted ? '🔇' : '🔊';
  });
  ui.touchToggleBtn.addEventListener('click', () => {
    touchControlsEnabled = !touchControlsEnabled;
    syncSettingsUI();
  });
  ui.lobbyFullscreenBtn.addEventListener('click', enterFullscreenLandscape);
  ui.hudFullscreenBtn.addEventListener('click', enterFullscreenLandscape);
  ui.rotateFullscreenBtn.addEventListener('click', enterFullscreenLandscape);
  ui.continuePortraitBtn.addEventListener('click', () => {
    ignorePortraitGuard = true;
    checkOrientation();
  });

  function goToLobby() {
    state = 'lobby';
    mouse.down = false;
    touch.firing = false;
    ui.hud.classList.add('hidden');
    ui.pauseOverlay.classList.add('hidden');
    ui.endOverlay.classList.add('hidden');
    ui.lobbyOverlay.classList.remove('hidden');
    openLobbyTab('home');
    refreshLobby();
  }

  // =========================================================
  // FF-STYLE LOBBY  (profile, currency, armory, outfits, rewards, 2D hero)
  // =========================================================
  const OUTFITS = [
    { id: 'amber',   name: 'Amber',      color: '#f59e0b', gold: 0 },
    { id: 'crimson', name: 'Crimson',    color: '#dc2626', gold: 200 },
    { id: 'ocean',   name: 'Ocean',      color: '#0ea5e9', gold: 200 },
    { id: 'emerald', name: 'Emerald',    color: '#10b981', gold: 250 },
    { id: 'violet',  name: 'Violet',     color: '#8b5cf6', gold: 250 },
    { id: 'frost',   name: 'Frost',      color: '#7dd3fc', gold: 350 },
    { id: 'neon',    name: 'Neon Pink',  color: '#ec4899', gems: 25 },
    { id: 'shadow',  name: 'Shadow',     color: '#475569', gems: 20 },
    { id: 'royal',   name: 'Royal Gold', color: '#fbbf24', gems: 40 }
  ];
  const ARMORY = [
    { id: 'M4A1',  gold: 0,   note: 'Balanced assault rifle' },
    { id: 'MP40',  gold: 300, note: 'Fast SMG, close range' },
    { id: 'M1887', gold: 500, note: 'Shotgun, 5 pellets' },
    { id: 'AWM',   gold: 900, note: 'Sniper, one-two shot' }
  ];

  const PROFILE_KEY = 'ar_royal_profile';
  function defaultProfile() {
    return { name: 'PLAYER', xp: 0, gold: 500, gems: 50, outfit: 'amber', weapon: 'M4A1',
             ownedW: ['M4A1'], ownedO: ['amber'], lastDaily: '', kills: 0, wins: 0 };
  }
  function loadProfile() {
    const base = defaultProfile();
    try {
      const raw = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null');
      if (raw && typeof raw === 'object') Object.assign(base, raw);
    } catch (e) {}
    if (!WEAPONS[base.weapon]) base.weapon = 'M4A1';
    if (!OUTFITS.some(o => o.id === base.outfit)) base.outfit = 'amber';
    if (!Array.isArray(base.ownedW)) base.ownedW = ['M4A1'];
    if (!Array.isArray(base.ownedO)) base.ownedO = ['amber'];
    return base;
  }
  let profile = loadProfile();
  function saveProfile() {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); } catch (e) {}
  }
  const todayKey = () => new Date().toLocaleDateString('en-CA');
  const getOutfit = () => OUTFITS.find(o => o.id === profile.outfit) || OUTFITS[0];

  function levelInfo() {
    let lv = 1, xp = profile.xp;
    while (xp >= 100 + lv * 50) { xp -= 100 + lv * 50; lv++; }
    return { lv, cur: xp, need: 100 + lv * 50 };
  }
  function rankTitle(lv) {
    return lv < 3 ? 'ROOKIE' : lv < 6 ? 'SOLDIER' : lv < 10 ? 'VETERAN' : lv < 15 ? 'ELITE' : 'LEGEND';
  }

  const L = {
    canvas: document.getElementById('lobbyCanvas'),
    name: document.getElementById('ffName'),
    avatar: document.getElementById('ffAvatar'),
    lv: document.getElementById('ffLv'),
    xpFill: document.getElementById('ffXpFill'),
    gold: document.getElementById('ffGold'),
    gems: document.getElementById('ffGems'),
    modeName: document.getElementById('modeName'),
    modeDesc: document.getElementById('modeDesc'),
    nameplate: document.getElementById('ffNameplate'),
    npTitle: document.getElementById('npTitle'),
    npName: document.getElementById('npName'),
    npGear: document.getElementById('npGear'),
    panel: document.getElementById('lobbyPanel'),
    panelTitle: document.getElementById('panelTitle'),
    armoryList: document.getElementById('armoryList'),
    outfitList: document.getElementById('outfitList'),
    claimBtn: document.getElementById('claimDailyBtn'),
    rewardDot: document.getElementById('rewardDot'),
    nameInput: document.getElementById('nameInput'),
    toast: document.getElementById('lobbyToast'),
    soundBtn: document.getElementById('lobbySoundBtn')
  };
  const lctx = L.canvas.getContext('2d');

  let toastTimer = null;
  function lobbyToast(msg) {
    L.toast.textContent = msg;
    L.toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => L.toast.classList.add('hidden'), 1900);
  }

  function updateModeCard() {
    const lvl = LEVELS.find(l => l.id === selectedLevelId) || LEVELS[0];
    L.modeName.textContent = `${lvl.icon || ''} Level ${lvl.id} — ${lvl.name}`;
    L.modeDesc.textContent = lvl.desc;
    ui.playBtn.textContent = '▶ START';
  }

  function updateLobbyUI() {
    const info = levelInfo();
    L.name.textContent = profile.name;
    L.avatar.textContent = profile.name.slice(0, 2).toUpperCase();
    L.avatar.style.background = `linear-gradient(135deg, ${getOutfit().color}, #0f172a)`;
    L.avatar.style.color = '#fff';
    L.lv.textContent = `LV ${info.lv}`;
    L.xpFill.style.width = `${Math.round((info.cur / info.need) * 100)}%`;
    L.gold.textContent = profile.gold.toLocaleString();
    L.gems.textContent = profile.gems.toLocaleString();
    L.npTitle.textContent = rankTitle(info.lv);
    L.npName.textContent = profile.name;
    L.npGear.textContent = `${profile.weapon} • ${getOutfit().name.toUpperCase()}`;
    L.rewardDot.classList.toggle('hidden', profile.lastDaily === todayKey());
    L.claimBtn.disabled = profile.lastDaily === todayKey();
    L.claimBtn.textContent = profile.lastDaily === todayKey() ? 'CLAIMED ✓' : 'CLAIM';
    L.soundBtn.textContent = audio.muted ? '🔇' : '🔊';
    ui.progressSummary.textContent = `${clearedLevels.size}/5 Cleared`;
    updateModeCard();
  }

  function renderArmory() {
    L.armoryList.innerHTML = '';
    ARMORY.forEach(item => {
      const w = WEAPONS[item.id];
      const owned = profile.ownedW.includes(item.id);
      const equipped = profile.weapon === item.id;
      const row = document.createElement('div');
      row.className = 'shop-item' + (equipped ? ' equipped' : '');
      row.innerHTML = `
        <div>
          <div class="shop-name">${w.name}</div>
          <div class="shop-meta">DMG ${w.damage} • MAG ${w.magSize} • ${item.note}</div>
        </div>`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shop-btn' + (equipped ? ' on' : owned ? ' owned' : '');
      btn.textContent = equipped ? 'EQUIPPED' : owned ? 'EQUIP' : `🪙 ${item.gold}`;
      btn.addEventListener('click', () => {
        if (equipped) return;
        if (!owned) {
          if (profile.gold < item.gold) { lobbyToast('Gold kam hai! Match khelo aur kamao 🪙'); return; }
          profile.gold -= item.gold;
          profile.ownedW.push(item.id);
          lobbyToast(`${w.name} unlock ho gayi!`);
        }
        profile.weapon = item.id;
        saveProfile();
        updateLobbyUI();
        renderArmory();
      });
      const snd = document.createElement('button');
      snd.type = 'button';
      snd.className = 'shop-btn owned';
      snd.style.minWidth = '34px';
      snd.textContent = '🔊';
      snd.title = 'Gun sound sun lo';
      snd.addEventListener('click', () => { audio.init(); audio.playGun(w.sound, 1); });
      const acts = document.createElement('div');
      acts.className = 'shop-actions';
      acts.appendChild(snd);
      acts.appendChild(btn);
      row.appendChild(acts);
      L.armoryList.appendChild(row);
    });
  }

  function renderOutfits() {
    L.outfitList.innerHTML = '';
    OUTFITS.forEach(o => {
      const owned = profile.ownedO.includes(o.id);
      const equipped = profile.outfit === o.id;
      const cell = document.createElement('div');
      cell.className = 'outfit-item' + (equipped ? ' equipped' : '');
      const price = owned ? (equipped ? 'ON ✓' : 'OWNED') : (o.gems ? `💎 ${o.gems}` : `🪙 ${o.gold}`);
      cell.innerHTML = `
        <div class="outfit-dot" style="background:${o.color}"></div>
        <div class="outfit-name">${o.name}</div>
        <div class="outfit-price">${price}</div>`;
      cell.addEventListener('click', () => {
        if (!owned) {
          if (o.gems) {
            if (profile.gems < o.gems) { lobbyToast('Diamonds kam hain 💎'); return; }
            profile.gems -= o.gems;
          } else {
            if (profile.gold < o.gold) { lobbyToast('Gold kam hai 🪙'); return; }
            profile.gold -= o.gold;
          }
          profile.ownedO.push(o.id);
          lobbyToast(`${o.name} outfit unlock!`);
        }
        profile.outfit = o.id;
        saveProfile();
        updateLobbyUI();
        renderOutfits();
      });
      L.outfitList.appendChild(cell);
    });
  }

  const PANEL_TITLES = { missions: 'MISSION', armory: 'ARMORY', outfit: 'OUTFIT', rewards: 'REWARDS', settings: 'SETTINGS' };
  let lobbyTab = 'home';
  function openLobbyTab(tab) {
    lobbyTab = tab;
    document.querySelectorAll('.ff-nav').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    if (tab === 'home') { L.panel.classList.add('hidden'); return; }
    L.panel.classList.remove('hidden');
    L.panelTitle.textContent = PANEL_TITLES[tab];
    document.querySelectorAll('[data-panel]').forEach(s => s.classList.toggle('hidden', s.dataset.panel !== tab));
    if (tab === 'missions') renderLevelCards();
    if (tab === 'armory') renderArmory();
    if (tab === 'outfit') renderOutfits();
    if (tab === 'settings') L.nameInput.value = profile.name;
    updateLobbyUI();
  }

  function claimDaily() {
    if (profile.lastDaily === todayKey()) { lobbyToast('Aaj ka reward le liya ✓'); return; }
    profile.lastDaily = todayKey();
    profile.gold += 200;
    profile.gems += 5;
    saveProfile();
    updateLobbyUI();
    lobbyToast('Daily reward: +200 🪙  +5 💎');
  }

  function awardMatchRewards(victory, firstClear) {
    const kills = player ? player.kills : 0;
    const xp = 20 + kills * 10 + (victory ? 50 : 0);
    const gold = kills * 15 + (victory ? 100 : 20);
    const gems = victory && firstClear ? 5 : 0;
    const before = levelInfo().lv;
    profile.xp += xp;
    profile.gold += gold;
    profile.gems += gems;
    profile.kills += kills;
    if (victory) profile.wins += 1;
    saveProfile();
    const after = levelInfo().lv;
    let txt = `+${gold} 🪙   +${xp} XP` + (gems ? `   +${gems} 💎` : '');
    if (after > before) txt += `   ⬆ LEVEL ${after}!`;
    return txt;
  }

  function refreshLobby() {
    updateLobbyUI();
    renderLevelCards();
    if (lobbyTab === 'armory') renderArmory();
    if (lobbyTab === 'outfit') renderOutfits();
  }

  // ----- Lobby bindings -----
  document.querySelectorAll('.ff-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.init();
      openLobbyTab(btn.dataset.tab === lobbyTab && lobbyTab !== 'home' ? 'home' : btn.dataset.tab);
    });
  });
  document.getElementById('panelClose').addEventListener('click', () => openLobbyTab('home'));
  document.getElementById('changeMissionBtn').addEventListener('click', () => openLobbyTab('missions'));
  document.getElementById('profileBtn').addEventListener('click', () => openLobbyTab('settings'));
  L.claimBtn.addEventListener('click', claimDaily);
  document.getElementById('nameSaveBtn').addEventListener('click', () => {
    const v = L.nameInput.value.replace(/[^A-Za-z0-9_ ]/g, '').trim().toUpperCase().slice(0, 12);
    if (!v) { lobbyToast('Naam khali nahi ho sakta'); return; }
    profile.name = v;
    saveProfile();
    updateLobbyUI();
    lobbyToast('Naam save ho gaya ✓');
  });
  L.soundBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    ui.soundToggleBtn.textContent = audio.muted ? '🔇' : '🔊';
    updateLobbyUI();
  });
  window.addEventListener('keydown', e => {
    if (state !== 'lobby') return;
    if (e.target && e.target.tagName === 'INPUT') return;
    if (e.code === 'Enter' || e.code === 'Space') { e.preventDefault(); startLevel(selectedLevelId); }
    if (e.code === 'Escape') openLobbyTab('home');
  });

  const poseBar = document.getElementById('poseBar');
  poseBar.querySelectorAll('.pose-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.init();
      lobbyPose = btn.dataset.pose;
      poseBar.querySelectorAll('.pose-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // ----- 2D Hero rendering -----
  let lobbyTime = 0, lobbyKick = 0, lobbyLook = 0, lobbyLookTarget = 0, lobbyCx = null;
  let lobbyPose = 'idle', lobbyPhase = 0, lobbyAmp = 0;
  const lobbyEmbers = Array.from({ length: 28 }, () => ({
    x: Math.random(), y: Math.random(), s: rand(0.7, 2.4), v: rand(0.03, 0.09), ph: Math.random() * 6.28
  }));

  L.canvas.addEventListener('pointermove', e => {
    lobbyLookTarget = clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1);
  });
  L.canvas.addEventListener('pointerdown', () => {
    audio.init();
    lobbyKick = 1;
    try { audio.playGun(WEAPONS[profile.weapon].sound, 0.55); } catch (e) {}
  });

  function drawLobbyHero(c, t, accent, wid, kick, look) {
    const def = WEAPONS[wid];
    const breathe = Math.sin(t * 2.1);
    const sway = Math.sin(t * 1.1) * 2.5;
    const skin = '#f1c27d';
    c.lineCap = 'round';
    c.lineJoin = 'round';

    // ground shadow
    c.fillStyle = 'rgba(0,0,0,0.42)';
    c.beginPath(); c.ellipse(0, 2, 74, 14, 0, 0, Math.PI * 2); c.fill();

    c.save();
    c.translate(sway * 0.4, 0);

    // legs + boots
    for (const sx of [-1, 1]) {
      c.fillStyle = '#1f2937';
      c.beginPath(); c.roundRect(sx * 17 - 13, -118, 26, 98, 8); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.09)';
      c.beginPath(); c.roundRect(sx * 17 - 11, -78, 22, 16, 6); c.fill();
      c.fillStyle = '#0f172a';
      c.beginPath(); c.roundRect(sx * 17 - 16 + sx * 3, -22, 33, 22, 7); c.fill();
      c.fillStyle = accent;
      c.fillRect(sx * 17 - 12 + sx * 3, -9, 25, 3);
    }

    // torso (breathing)
    c.save();
    c.translate(0, breathe * 1.3);
    c.fillStyle = accent;
    c.beginPath();
    c.moveTo(-50, -205); c.quadraticCurveTo(0, -222, 50, -205);
    c.lineTo(38, -112); c.quadraticCurveTo(0, -104, -38, -112); c.closePath();
    c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.45)'; c.lineWidth = 3; c.stroke();

    // tactical vest
    c.fillStyle = 'rgba(15,23,42,0.80)';
    c.beginPath(); c.moveTo(-34, -200); c.lineTo(34, -200); c.lineTo(30, -122); c.lineTo(-30, -122); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.13)';
    c.fillRect(-26, -168, 18, 22); c.fillRect(8, -168, 18, 22);
    c.fillStyle = accent; c.fillRect(-3, -200, 6, 78);
    // belt
    c.fillStyle = '#0f172a'; c.fillRect(-40, -122, 80, 12);
    c.fillStyle = '#fbbf24'; c.fillRect(-7, -121, 14, 10);
    // shoulder pads
    for (const sx of [-1, 1]) {
      c.fillStyle = '#111827';
      c.beginPath(); c.arc(sx * 52, -200, 15, 0, Math.PI * 2); c.fill();
      c.strokeStyle = accent; c.lineWidth = 3; c.stroke();
    }

    // weapon across the chest
    const L2 = 50 + def.barrelLen * 1.8;
    const W2 = def.bodyW * 3.4;
    c.save();
    c.translate(6 - kick * 8, -156 + kick * 3);
    c.rotate(-0.30 - kick * 0.08);
    c.fillStyle = '#1f2937';
    c.beginPath(); c.roundRect(-L2 * 0.55 - 26, -W2 * 0.5, 34, W2 * 1.4, 5); c.fill();
    c.fillStyle = '#0f172a';
    c.beginPath(); c.roundRect(-L2 * 0.55, -W2 / 2, L2 * 1.05, W2, 4); c.fill();
    c.fillStyle = def.color;
    c.fillRect(-L2 * 0.2, -W2 / 2 + 2, L2 * 0.42, W2 - 4);
    c.fillStyle = '#334155';
    c.fillRect(L2 * 0.5 - 2, -W2 * 0.25, L2 * 0.28, W2 * 0.5);
    if (wid !== 'AWM' && wid !== 'M1887') {
      c.fillStyle = '#111827';
      c.beginPath(); c.roundRect(-L2 * 0.1, W2 / 2 - 1, 12, W2 * 1.9, 3); c.fill();
    }
    if (wid === 'AWM') {
      c.fillStyle = '#111827'; c.fillRect(-L2 * 0.15, -W2 / 2 - 12, L2 * 0.5, 9);
      c.fillStyle = '#38bdf8'; c.fillRect(L2 * 0.32, -W2 / 2 - 11, 4, 7);
    }
    if (kick > 0.5) {
      c.fillStyle = `rgba(253,224,71,${kick})`;
      c.beginPath();
      c.moveTo(L2 * 0.78, 0); c.lineTo(L2 * 0.78 + 34 * kick, -9);
      c.lineTo(L2 * 0.78 + 16 * kick, 0); c.lineTo(L2 * 0.78 + 34 * kick, 9);
      c.closePath(); c.fill();
    }
    c.restore();

    // arms (sleeve -> forearm -> glove)
    const arm = (sx, sy, ex, ey, hx, hy) => {
      c.strokeStyle = accent; c.lineWidth = 21;
      c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
      c.strokeStyle = skin; c.lineWidth = 14;
      c.beginPath(); c.moveTo(ex, ey); c.lineTo(hx, hy); c.stroke();
      c.fillStyle = '#111827';
      c.beginPath(); c.arc(hx, hy, 9, 0, Math.PI * 2); c.fill();
    };
    const hk = kick * 4;
    arm(-52, -200, -64, -150, -8 - hk, -152);
    arm(52, -200, 70, -160, 36 - hk, -165);
    c.restore(); // torso

    // neck + head
    const hx = look * 4, hy = -242 + breathe * 0.8;
    c.fillStyle = '#d6a47e';
    c.fillRect(-9, -228, 18, 18);
    c.fillStyle = skin;
    c.beginPath(); c.arc(hx, hy, 27, 0, Math.PI * 2); c.fill();

    // face mask
    c.save();
    c.beginPath(); c.arc(hx, hy, 27, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#111827'; c.fillRect(hx - 30, hy + 7, 60, 30);
    c.fillStyle = accent; c.fillRect(hx - 30, hy + 7, 60, 3);
    c.restore();

    // eyes (with blink)
    const blink = (t % 4.2) < 0.12;
    for (const sx of [-1, 1]) {
      const ex = hx + sx * 10 + look * 3;
      c.fillStyle = '#fff';
      c.beginPath(); c.ellipse(ex, hy - 3, 5.5, blink ? 0.8 : 4, 0, 0, Math.PI * 2); c.fill();
      if (!blink) {
        c.fillStyle = '#0f172a';
        c.beginPath(); c.arc(ex + look * 1.8, hy - 3, 2.3, 0, Math.PI * 2); c.fill();
      }
      c.strokeStyle = '#1e293b'; c.lineWidth = 2.4;
      c.beginPath(); c.moveTo(ex - 6, hy - 11 + sx * 0.5); c.lineTo(ex + 6, hy - 9 - sx * 0.5); c.stroke();
    }

    // helmet + accent band
    c.fillStyle = '#1e293b';
    c.beginPath(); c.arc(hx, hy - 3, 29, Math.PI, 0); c.lineTo(hx + 29, hy - 12); c.lineTo(hx - 29, hy - 12); c.closePath(); c.fill();
    c.fillStyle = accent; c.fillRect(hx - 28, hy - 18, 56, 5);
    c.fillStyle = '#0f172a';
    c.beginPath(); c.roundRect(hx - 31, hy - 14, 62, 4, 2); c.fill();

    c.restore();
  }


  // Side-view walk / run cycle: thigh + knee + boot, arm swing, torso lean, head bob
  function drawHeroSide(c, t, accent, wid, ph, amp, kick) {
    const def = WEAPONS[wid];
    const run = amp > 0.8;
    const skin = '#f1c27d';
    c.lineCap = 'round';
    c.lineJoin = 'round';
    const bounce = -Math.abs(Math.sin(ph)) * (run ? 9 : 4.5) * amp;
    const lean = (run ? 0.20 : 0.07) * Math.min(1, amp * 1.2);

    c.fillStyle = 'rgba(0,0,0,0.42)';
    c.beginPath(); c.ellipse(0, 2, 66 - bounce * 0.8, 12, 0, 0, Math.PI * 2); c.fill();

    const drawLeg = (p, col, bootCol) => {
      const A = run ? 0.9 : 0.5;
      const thigh = Math.sin(p) * A;
      const bend = Math.max(0, Math.cos(p + 0.25)) * (run ? 1.35 : 0.7);
      c.save();
      c.translate(0, -118 + bounce);
      c.rotate(-thigh);
      c.fillStyle = col;
      c.beginPath(); c.roundRect(-12, -4, 24, 56, 9); c.fill();
      c.translate(0, 50);
      c.rotate(bend);
      c.beginPath(); c.roundRect(-10.5, -4, 21, 54, 9); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.12)';
      c.beginPath(); c.arc(0, 0, 8, 0, Math.PI * 2); c.fill();
      c.translate(0, 50);
      c.rotate(-0.6 * thigh + 0.45 * bend);
      c.fillStyle = bootCol;
      c.beginPath(); c.roundRect(-9, -3, 32, 15, 6); c.fill();
      c.fillStyle = accent; c.fillRect(-8, 6, 30, 3);
      c.restore();
    };
    drawLeg(ph + Math.PI, '#161e2c', '#0a0f1a');   // far leg
    drawLeg(ph, '#1f2937', '#0f172a');             // near leg

    // torso block (leans forward from the hip)
    c.save();
    c.translate(0, -118 + bounce);
    c.rotate(lean);

    // far arm swings freely (behind torso)
    const armSwing = (p, front) => {
      const A = run ? 1.05 : 0.55;
      const sh = Math.sin(p) * A;
      const elbow = 0.45 + Math.max(0, Math.sin(p)) * (run ? 1.1 : 0.5);
      c.save();
      c.translate(0, -86);
      c.rotate(-sh);
      c.fillStyle = accent;
      c.beginPath(); c.roundRect(-8, -4, 16, 42, 8); c.fill();
      c.fillStyle = 'rgba(0,0,0,0.28)';
      c.beginPath(); c.roundRect(-8, -4, 16, 42, 8); c.fill();
      c.translate(0, 38);
      c.rotate(-elbow);
      c.fillStyle = skin;
      c.beginPath(); c.roundRect(-7, -3, 14, 36, 7); c.fill();
      c.fillStyle = '#111827';
      c.beginPath(); c.arc(0, 36, 8, 0, Math.PI * 2); c.fill();
      c.restore();
    };
    armSwing(ph, false);

    // backpack
    c.fillStyle = '#111827';
    c.beginPath(); c.roundRect(-40, -84, 18, 52, 6); c.fill();
    c.fillStyle = accent; c.fillRect(-40, -62, 18, 3);

    // torso + vest
    c.fillStyle = accent;
    c.beginPath(); c.roundRect(-23, -94, 46, 98, 15); c.fill();
    c.strokeStyle = 'rgba(0,0,0,0.45)'; c.lineWidth = 3; c.stroke();
    c.fillStyle = 'rgba(15,23,42,0.80)';
    c.beginPath(); c.roundRect(-19, -88, 36, 72, 10); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.13)';
    c.fillRect(2, -66, 14, 20);
    c.fillStyle = '#0f172a'; c.fillRect(-24, -4, 48, 11);
    c.fillStyle = '#fbbf24'; c.fillRect(10, -3, 10, 9);

    // near arm holds the weapon (2-bone IK from shoulder to grip)
    const bob = Math.sin(ph * 2) * 2.4 * amp - kick * 3;
    const gx = 30 - kick * 7, gy = -50 + bob;
    const sx = 0, sy = -86;
    const dx = gx - sx, dy = gy - sy, d = Math.hypot(dx, dy);
    const l1 = 38;
    const hgt = Math.sqrt(Math.max(1, l1 * l1 - (d / 2) * (d / 2)));
    let nx = -dy / d, ny = dx / d;
    if (ny < 0) { nx = -nx; ny = -ny; }
    const ex = (sx + gx) / 2 + nx * hgt, ey = (sy + gy) / 2 + ny * hgt;

    // weapon
    const L2 = 46 + def.barrelLen * 1.5;
    const W2 = def.bodyW * 3;
    c.save();
    c.translate(gx, gy);
    c.rotate(-0.06 - kick * 0.07);
    c.fillStyle = '#1f2937';
    c.beginPath(); c.roundRect(-L2 * 0.55 - 22, -W2 * 0.35, 30, W2 * 1.3, 5); c.fill();
    c.fillStyle = '#0f172a';
    c.beginPath(); c.roundRect(-L2 * 0.5, -W2 / 2, L2, W2, 4); c.fill();
    c.fillStyle = def.color;
    c.fillRect(-L2 * 0.15, -W2 / 2 + 2, L2 * 0.4, W2 - 4);
    c.fillStyle = '#334155';
    c.fillRect(L2 * 0.5 - 2, -W2 * 0.25, L2 * 0.3, W2 * 0.5);
    if (wid !== 'AWM' && wid !== 'M1887') {
      c.fillStyle = '#111827';
      c.beginPath(); c.roundRect(-L2 * 0.05, W2 / 2 - 1, 11, W2 * 1.8, 3); c.fill();
    }
    if (wid === 'AWM') {
      c.fillStyle = '#111827'; c.fillRect(-L2 * 0.12, -W2 / 2 - 11, L2 * 0.45, 8);
      c.fillStyle = '#38bdf8'; c.fillRect(L2 * 0.28, -W2 / 2 - 10, 4, 6);
    }
    if (kick > 0.5) {
      c.fillStyle = `rgba(253,224,71,${kick})`;
      c.beginPath();
      c.moveTo(L2 * 0.8, 0); c.lineTo(L2 * 0.8 + 34 * kick, -9);
      c.lineTo(L2 * 0.8 + 16 * kick, 0); c.lineTo(L2 * 0.8 + 34 * kick, 9);
      c.closePath(); c.fill();
    }
    c.restore();

    c.strokeStyle = accent; c.lineWidth = 16;
    c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.stroke();
    c.strokeStyle = skin; c.lineWidth = 13;
    c.beginPath(); c.moveTo(ex, ey); c.lineTo(gx, gy); c.stroke();
    c.fillStyle = '#111827';
    c.beginPath(); c.arc(gx, gy, 8, 0, Math.PI * 2); c.fill();

    // shoulder pad
    c.fillStyle = '#111827';
    c.beginPath(); c.arc(0, -88, 13, 0, Math.PI * 2); c.fill();
    c.strokeStyle = accent; c.lineWidth = 3; c.stroke();

    // head (side view) with flowing headband tail
    const hx = 4, hy = -128 - bounce * 0.35;
    c.fillStyle = '#d6a47e'; c.fillRect(-8, -112, 16, 16);
    const flutter = Math.sin(t * 9) * 5 * (0.3 + amp);
    c.fillStyle = accent;
    c.beginPath();
    c.moveTo(hx - 22, hy - 12);
    c.quadraticCurveTo(hx - 44, hy - 14 + flutter, hx - 62, hy - 6 + flutter * 1.4);
    c.lineTo(hx - 58, hy + 2 + flutter * 1.4);
    c.quadraticCurveTo(hx - 40, hy - 6 + flutter, hx - 22, hy - 4);
    c.closePath(); c.fill();

    c.fillStyle = skin;
    c.beginPath(); c.arc(hx, hy, 25, 0, Math.PI * 2); c.fill();
    c.save();
    c.beginPath(); c.arc(hx, hy, 25, 0, Math.PI * 2); c.clip();
    c.fillStyle = '#111827'; c.fillRect(hx - 28, hy + 6, 58, 30);
    c.fillStyle = accent; c.fillRect(hx - 28, hy + 6, 58, 3);
    c.restore();
    const blink = (t % 4.2) < 0.12;
    c.fillStyle = '#fff';
    c.beginPath(); c.ellipse(hx + 12, hy - 4, 5.5, blink ? 0.8 : 4, 0, 0, Math.PI * 2); c.fill();
    if (!blink) { c.fillStyle = '#0f172a'; c.beginPath(); c.arc(hx + 14, hy - 4, 2.3, 0, Math.PI * 2); c.fill(); }
    c.strokeStyle = '#1e293b'; c.lineWidth = 2.4;
    c.beginPath(); c.moveTo(hx + 5, hy - 11); c.lineTo(hx + 18, hy - 9); c.stroke();
    c.fillStyle = '#1e293b';
    c.beginPath(); c.arc(hx - 1, hy - 3, 27, Math.PI, 0); c.lineTo(hx + 26, hy - 11); c.lineTo(hx - 28, hy - 11); c.closePath(); c.fill();
    c.fillStyle = accent; c.fillRect(hx - 27, hy - 17, 54, 5);

    c.restore(); // torso
  }

  function renderLobby(dt) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    const pw = Math.floor(w * dpr), ph = Math.floor(h * dpr);
    if (L.canvas.width !== pw || L.canvas.height !== ph) { L.canvas.width = pw; L.canvas.height = ph; }
    lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lctx.clearRect(0, 0, w, h);

    lobbyTime += dt;
    lobbyKick = Math.max(0, lobbyKick - dt * 3.5);
    lobbyLook += (lobbyLookTarget - lobbyLook) * Math.min(1, dt * 5);
    const ampTarget = lobbyPose === 'run' ? 1 : lobbyPose === 'walk' ? 0.6 : 0;
    lobbyAmp += (ampTarget - lobbyAmp) * Math.min(1, dt * 6);
    lobbyPhase += dt * (lobbyPose === 'run' ? 12 : lobbyPose === 'walk' ? 7.5 : 0);

    const accent = getOutfit().color;
    const panelOpen = !L.panel.classList.contains('hidden');
    const wantCx = panelOpen && w > 700 ? w * 0.62 : w * 0.5;
    if (lobbyCx === null) lobbyCx = wantCx;
    lobbyCx += (wantCx - lobbyCx) * Math.min(1, dt * 6);
    const cx = lobbyCx;
    const gy = h * 0.74;
    const s = Math.max(0.4, Math.min((gy - 62) / 292, w / 720));

    // watermark
    lctx.save();
    lctx.globalAlpha = 0.045;
    lctx.fillStyle = '#fff';
    lctx.font = `900 ${Math.floor(h * 0.62)}px sans-serif`;
    lctx.textAlign = 'center';
    lctx.fillText('AR', cx, h * 0.72);
    lctx.restore();

    // hero glow
    const glow = lctx.createRadialGradient(cx, gy - 120 * s, 10, cx, gy - 120 * s, 260 * s);
    glow.addColorStop(0, accent + '55');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    lctx.fillStyle = glow;
    lctx.fillRect(0, 0, w, h);

    // light beam
    const beam = lctx.createLinearGradient(0, gy - 320 * s, 0, gy);
    beam.addColorStop(0, 'rgba(255,255,255,0)');
    beam.addColorStop(1, accent + '30');
    lctx.fillStyle = beam;
    lctx.beginPath();
    lctx.moveTo(cx - 40 * s, gy - 320 * s); lctx.lineTo(cx + 40 * s, gy - 320 * s);
    lctx.lineTo(cx + 125 * s, gy); lctx.lineTo(cx - 125 * s, gy);
    lctx.closePath(); lctx.fill();

    // embers
    lobbyEmbers.forEach(e => {
      e.y -= e.v * dt;
      if (e.y < -0.05) { e.y = 1.05; e.x = Math.random(); }
      const ex = e.x * w + Math.sin(lobbyTime + e.ph) * 14;
      lctx.fillStyle = accent + '99';
      lctx.beginPath(); lctx.arc(ex, e.y * h, e.s, 0, Math.PI * 2); lctx.fill();
    });

    // platform
    const pg = lctx.createRadialGradient(cx, gy, 5, cx, gy, 140 * s);
    pg.addColorStop(0, accent + '66');
    pg.addColorStop(1, 'rgba(15,23,42,0.0)');
    lctx.fillStyle = pg;
    lctx.beginPath(); lctx.ellipse(cx, gy, 150 * s, 34 * s, 0, 0, Math.PI * 2); lctx.fill();
    lctx.strokeStyle = accent;
    lctx.lineWidth = 2.5;
    lctx.setLineDash([14, 10]);
    lctx.lineDashOffset = -lobbyTime * 26;
    lctx.beginPath(); lctx.ellipse(cx, gy, 118 * s, 26 * s, 0, 0, Math.PI * 2); lctx.stroke();
    lctx.setLineDash([]);
    lctx.strokeStyle = 'rgba(255,255,255,0.35)';
    lctx.lineWidth = 1.5;
    lctx.beginPath(); lctx.ellipse(cx, gy, 138 * s, 31 * s, 0, 0, Math.PI * 2); lctx.stroke();

    // speed streaks while moving
    if (lobbyPose !== 'idle') {
      lctx.strokeStyle = 'rgba(255,255,255,0.22)';
      lctx.lineWidth = 2;
      const spd = lobbyPose === 'run' ? 520 : 260;
      for (let i = 0; i < 7; i++) {
        const off = ((lobbyTime * spd + i * 97) % 520);
        const sx0 = cx - (70 * s) - off * s * 0.55;
        const sy0 = gy - (30 + (i * 41) % 190) * s;
        lctx.globalAlpha = 1 - off / 520;
        lctx.beginPath(); lctx.moveTo(sx0, sy0); lctx.lineTo(sx0 - 40 * s, sy0); lctx.stroke();
      }
      lctx.globalAlpha = 1;
    }

    // hero
    lctx.save();
    lctx.translate(cx, gy);
    lctx.scale(s, s);
    if (lobbyPose === 'idle') drawLobbyHero(lctx, lobbyTime, accent, profile.weapon, lobbyKick, lobbyLook);
    else drawHeroSide(lctx, lobbyTime, accent, profile.weapon, lobbyPhase, Math.max(0.35, lobbyAmp), lobbyKick);
    lctx.restore();

    L.nameplate.style.left = `${cx}px`;
    L.nameplate.style.top = `${gy + 34 * s}px`;
    poseBar.style.left = `${cx + 100 * s}px`;
    poseBar.style.top = `${Math.max(56, gy - 230 * s)}px`;
  }

  // ---------- INIT ----------
  resizeCanvas();
  refreshLobby();
  syncSettingsUI();
  requestAnimationFrame(loop);
})();
