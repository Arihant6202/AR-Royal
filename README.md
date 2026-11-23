# AR ROYAL — 2D Landscape Battle Royale (GitHub Pages Ready)

**AR ROYAL** ek 2D Top-Down Landscape Battle Royale web game hai jo pure HTML, CSS, aur JavaScript par bana hai (bina kisi external library ke).

## Included Files
- `index.html` — Main game page & Landscape HUD
- `style.css` — Ultra-compact Landscape-first UI & mobile touch controls
- `script.js` — 5-Level Campaign engine, articulated walk/run animations, AI bots & 5 distinct Web Audio gun sounds
- `manifest.json` — Fullscreen Landscape PWA manifest
- `README.md` — GitHub Pages setup instructions

## Game Highlights
1. **5-Level Campaign:**
   - **Level 1:** Bermuda Outpost (6 Easy Bots, Lush Grass)
   - **Level 2:** Kalahari Sandstorm (8 Normal Bots, Desert Cover, Lv.1 Vest)
   - **Level 3:** Purgatory Bridge (10 Bots, Heavy Airdrops, Lv.2 Vest)
   - **Level 4:** Alpine Snowbase (12 Sharp Bots, AWM Snipers, Fast Blue Zone)
   - **Level 5:** Neon Citadel Finale (14 Pro Bots + `BOSS_CITADEL`)
2. **Articulated Limb Animations:** Walk aur Sprint (Run) par alag leg stride, dust particles, arms weapon grip, aur recoil kickback.
3. **5 Distinct Gun Sounds:** M4A1, MP40, M1887 (shotgun boom + pump rack), AWM (sniper crack + bolt cycle), aur G18.
4. **Controls:**
   - **PC:** `WASD` Move, `Shift` Run, `Mouse` Aim & Fire, `Right Click / Q` Scope, `R` Reload, `E` Loot, `H` Medkit, `1/2/3` Switch Gun.
   - **Mobile:** Landscape Dual Joysticks + corner action buttons (`📱` button se PC par bhi test kar sakte hain).


## NEW: Free Fire Style Lobby
- **Lobby (Home):** Center me tumhara 2D character (idle animation, blink, mouse follow, tap par gun fire + sound), glowing platform, profile + LV/XP bar, 🪙 Gold & 💎 Diamonds.
- **Left Menu:** LOBBY • MISSION (5 levels) • ARMORY (M4A1/MP40/M1887/AWM) • OUTFIT (9 colors) • REWARD (daily claim) • SETTINGS (name, speed, HUD).
- **Right Side:** SOLO mode card (DUO/SQUAD locked), squad slots, bada **START** button.
- **Economy:** Har kill +15 🪙 +10 XP, BOOYAH +100 🪙 +50 XP, pehli baar level clear +5 💎. Equipped weapon aur outfit match me use hote hain.
- **Save:** Sab progress browser `localStorage` me save hota hai.
- Keyboard: `Enter / Space` = Start, `Esc` = panel band.


## v2 Update: Levels, Movement, Sounds
- **Level by level design (5 levels):**
  1. 🌴 Bermuda Outpost — jheel (paani me speed kam), phool, patte
  2. 🏜 Kalahari Sandstorm — quicksand, dunes, cactus, **sandstorm** (visibility kam, bots bhi kam dekhte hain)
  3. 🌉 Purgatory Bridge — beech me **nadi + 3 pul**, girte patte
  4. ❄ Alpine Snowbase — **fisalti ice**, snow drifts, snowfall
  5. 🌆 Neon Citadel — beech me **Citadel (4 gates)**, BOSS andar, **boost pads**, neon walls
- **Movement:** walk aur run me alag pair stride (thigh-knee-boot), haath/elbow swing, torso twist, gun bob, paani me splash.
- **Lobby pose preview:** IDLE / WALK / RUN buttons se side-view me chalta/daudta character dekho.
- **Gun sounds (har gun alag):** M4A1, MP40, M1887, AWM, G18 — fire aur reload dono alag. Armory me 🔊 se sun sakte ho.

## GitHub Pages par Live Host Kaise Karein (Step-by-Step)
1. Is `ar-royal.zip` ko apne computer ya phone me **Extract / Unzip** karein.
2. GitHub.com par jayein aur ek **New Repository** banayein (jaise `ar-royal`, visibility **Public** rakhein).
3. Repository me **Add file -> Upload files** par click karein aur unzip ki hui saari 5 files (`index.html`, `style.css`, `script.js`, `manifest.json`, `README.md`) upload karke **Commit changes** daba dein.
4. Repository ke **Settings -> Pages** me jayein.
5. **Branch** me `main` aur folder me `/ (root)` select karke **Save** karein.
6. 1-2 minute me aapka live game link (`https://<your-username>.github.io/ar-royal/`) ready ho jayega!
