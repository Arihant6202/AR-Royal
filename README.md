# AR ROYAL — 2D Landscape Battle Royale (GitHub Pages Ready)

**AR ROYAL** ek 2D Top-Down Landscape Battle Royale web game hai jo pure HTML, CSS, aur JavaScript par bana hai (bina kisi external library ke).

## Included Files
- `index.html` — Main game page & Landscape HUD
- `style.css` — Ultra-compact Landscape-first UI & mobile touch controls
- `script.js` — 10-Level Campaign engine, articulated walk/run animations, AI bots & 5 distinct Web Audio gun sounds
- `manifest.json`, `sw.js`, `icon-*.png` — PWA (📲 INSTALL button ke liye)
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

## v3 Update: 20 Levels + Har Map ka Alag Structure + Install Button
Har level up par **naya map, naya design** — shape ya structure dono alag.

| Lvl | Map | Structure |
|---|---|---|
| 1 | Bermuda Outpost | ⭕ Khula island + 2 lakes |
| 2 | Kalahari Sandstorm | Canyon walls + beech me oasis chamber |
| 3 | Purgatory Bridge | Nadi + 3 pul + dono kinare fort + sandbags |
| 4 | Alpine Snowbase | Double-ring ice fortress + inner keep |
| 5 | Neon Citadel | ✚ Plus map: Citadel + 4 arm bunkers + BOSS |
| 6 | Swamp Jungle | ⬠ Tedhi nadi + 3 lakdi ke pul |
| 7 | Moonlit Ruins | ☾ Toote kamre + pillars |
| 8 | Crimson Volcano | ♥ Lava nadi + 3 pathar ke pul |
| 9 | Toxic Wasteland | ✡ Lab hub + toxic moat + 4 pul |
| 10 | Galaxy Star Fortress | ★ Citadel + 5 outposts + BOSS + 18 bots |
| 11 | Sunset Harbor | Octagon: samundar + piers + godown |
| 12 | Sand Temple | T-shape: sanctum + pillars + gated corridor |
| 13 | Frozen Lake | Beech me barf ki jheel + 4 igloo |
| 14 | Rail Yard | L-shape: train-car deewarein |
| 15 | Sewer Maze | Lanes + toxic nehar + BOSS |
| 16 | Haunted Graveyard | Ulta triangle: qabron ki grid + mausoleum |
| 17 | Magma Fortress | Octagon: ring wall + lava moat + 4 pul |
| 18 | Lost Temple | Arrow shape: temple + ruins + ghana jungle |
| 19 | Orbital Station | Hourglass: 2 chambers + patli galli |
| 20 | Omega Arena | Octagon: ring + Citadel + 4 outposts + BOSS + 20 bots |

- Lava aur toxic pools damage karte hain. Minimap me deewarein bhi dikhti hain.
- Level clear karne par **"Level N ▶ New Map"** se agla map khulta hai.

### 📲 Install Button
Lobby ke top-right me **INSTALL** button. Android/Chrome par seedha install; iPhone Safari par Share → Add to Home Screen. Game **https** par host hona chahiye (GitHub Pages).

## GitHub Pages par Live Host Kaise Karein (Step-by-Step)
1. Is `ar-royal.zip` ko apne computer ya phone me **Extract / Unzip** karein.
2. GitHub.com par jayein aur ek **New Repository** banayein (jaise `ar-royal`, visibility **Public** rakhein).
3. Repository me **Add file -> Upload files** par click karein aur unzip ki hui saari files (`index.html`, `style.css`, `script.js`, `manifest.json`, `sw.js`, icons, `README.md`) upload karke **Commit changes** daba dein.
4. Repository ke **Settings -> Pages** me jayein.
5. **Branch** me `main` aur folder me `/ (root)` select karke **Save** karein.
6. 1-2 minute me aapka live game link (`https://<your-username>.github.io/ar-royal/`) ready ho jayega!


## v4 Update: Full 9-Screen Royal UI + Mobile Scroll Fix + Official Logo
- Complete Black, Royal Gold & Dark Blue interface suite across Lobby, Missions (20 Levels), Armory, Outfits, Rewards, Settings, Player Profile, Pause Menu, and Result Screen.
- Removed global `touch-action: none` and added full touch + mouse-wheel scrolling across all panels.
- Integrated custom AR ROYAL emblem (`logo.png`) and PWA icons.
